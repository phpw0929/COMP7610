// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title Volunteer Hours Registry
/// @notice Records organization-approved volunteer service claims and preserves corrections.
/// @dev Wallet addresses and all stored data are public. Do not submit personal details or secrets.
///      Metadata and reason hashes should be keccak256 hashes of the exact off-chain content;
///      a hash can check matching content but does not prove that the content is true.
contract VolunteerHoursRegistry {
    enum ClaimStatus {
        None,
        Pending,
        Approved,
        Rejected
    }

    enum RecordStatus {
        None,
        Valid,
        Revoked,
        Corrected
    }

    struct Organization {
        uint256 id;
        address wallet;
        string metadataURI;
        bytes32 metadataHash;
        bool active;
        uint64 registeredAt;
    }

    struct Activity {
        uint256 id;
        address issuer;
        string metadataURI;
        bytes32 metadataHash;
        string category;
        uint64 serviceStartDate;
        uint64 serviceEndDate;
        bool open;
        uint64 createdAt;
    }

    struct Claim {
        uint256 id;
        uint256 activityId;
        address volunteer;
        uint32 claimedMinutes;
        uint64 serviceDate;
        bytes32 supportingInfoHash;
        ClaimStatus status;
        uint64 submittedAt;
        uint64 reviewedAt;
        address reviewer;
        uint32 approvedMinutes;
        bytes32 reviewNoteHash;
        uint256 recordId;
    }

    struct ServiceRecord {
        uint256 id;
        uint256 claimId;
        address volunteer;
        address issuer;
        uint256 activityId;
        uint32 approvedMinutes;
        uint64 serviceDate;
        uint64 issuedAt;
        RecordStatus status;
        uint256 replacesRecordId;
        uint256 replacementRecordId;
        uint64 statusChangedAt;
        bytes32 reasonHash;
        bytes32 supportingInfoHash;
        bytes32 reviewNoteHash;
    }

    address public immutable administrator;

    uint256 public organizationCount;
    uint256 public activityCount;
    uint256 public claimCount;
    uint256 public recordCount;

    mapping(address => Organization) private _organizations;
    mapping(uint256 => address) private _organizationWalletById;
    mapping(uint256 => Activity) private _activities;
    mapping(uint256 => Claim) private _claims;
    mapping(uint256 => ServiceRecord) private _records;
    mapping(address => uint256[]) private _organizationActivityIds;
    mapping(uint256 => uint256[]) private _activityClaimIds;
    mapping(address => uint256[]) private _volunteerClaimIds;
    mapping(address => uint256[]) private _volunteerRecordIds;
    mapping(address => uint256[]) private _issuerRecordIds;

    event OrganizationRegistered(uint256 indexed organizationId, address indexed wallet);
    event OrganizationStatusChanged(
        uint256 indexed organizationId,
        address indexed wallet,
        bool active,
        address indexed changedBy
    );
    event ActivityCreated(uint256 indexed activityId, address indexed issuer, string category);
    event ActivityClosed(uint256 indexed activityId, address indexed issuer);
    event ServiceClaimSubmitted(
        uint256 indexed claimId,
        uint256 indexed activityId,
        address indexed volunteer,
        uint32 claimedMinutes,
        uint64 serviceDate
    );
    event ServiceClaimReviewed(
        uint256 indexed claimId,
        ClaimStatus status,
        address indexed reviewer,
        uint32 approvedMinutes,
        uint256 recordId
    );
    event ServiceRecordIssued(
        uint256 indexed recordId,
        uint256 indexed activityId,
        address indexed volunteer,
        address issuer,
        uint32 approvedMinutes,
        uint64 serviceDate,
        uint256 replacesRecordId
    );
    event ServiceRecordRevoked(
        uint256 indexed recordId,
        address indexed changedBy,
        bytes32 reasonHash,
        uint64 changedAt
    );
    event ServiceRecordCorrected(
        uint256 indexed oldRecordId,
        uint256 indexed replacementRecordId,
        address indexed changedBy,
        bytes32 reasonHash
    );

    /// @dev Restricts organization registration and status changes to the deploying administrator.
    modifier onlyAdministrator() {
        require(msg.sender == administrator, "Only administrator");
        _;
    }

    /// @notice Sets the deploying wallet as the platform administrator.
    constructor() {
        administrator = msg.sender;
    }

    /// @notice Registers a recognized issuing organization.
    /// @param wallet Organization wallet that will create activities and review claims.
    /// @param metadataURI Public off-chain organization metadata location.
    /// @param metadataHash keccak256 hash of the exact metadata bytes fetched from metadataURI.
    /// @return organizationId New organization identifier, starting at 1.
    function registerOrganization(
        address wallet,
        string calldata metadataURI,
        bytes32 metadataHash
    ) external onlyAdministrator returns (uint256 organizationId) {
        require(wallet != address(0), "Organization wallet is zero");
        require(_organizations[wallet].id == 0, "Organization already registered");
        _validateMetadata(metadataURI, metadataHash);

        organizationId = ++organizationCount;
        _organizations[wallet] = Organization({
            id: organizationId,
            wallet: wallet,
            metadataURI: metadataURI,
            metadataHash: metadataHash,
            active: true,
            registeredAt: uint64(block.timestamp)
        });
        _organizationWalletById[organizationId] = wallet;

        emit OrganizationRegistered(organizationId, wallet);
        emit OrganizationStatusChanged(organizationId, wallet, true, msg.sender);
    }

    /// @notice Activates or deactivates an already registered organization.
    /// @dev Deactivation blocks new activity, claim, review, revocation, and correction actions;
    ///      it does not change the status of records already issued.
    /// @param wallet Wallet of the registered organization.
    /// @param active Whether the organization should be allowed to perform new actions.
    function setOrganizationActive(address wallet, bool active) external onlyAdministrator {
        Organization storage organization = _organizations[wallet];
        require(organization.id != 0, "Organization not registered");
        require(organization.active != active, "Organization already has this status");

        organization.active = active;
        emit OrganizationStatusChanged(organization.id, wallet, active, msg.sender);
    }

    /// @notice Returns organization details by wallet address.
    /// @param wallet Registered organization wallet.
    /// @return organization The public organization record.
    function getOrganization(address wallet) external view returns (Organization memory organization) {
        require(_organizations[wallet].id != 0, "Organization not registered");
        return _organizations[wallet];
    }

    /// @notice Returns organization details by sequential organization identifier.
    /// @param organizationId Organization identifier returned at registration.
    /// @return organization The public organization record.
    function getOrganizationById(
        uint256 organizationId
    ) external view returns (Organization memory organization) {
        address wallet = _organizationWalletById[organizationId];
        require(wallet != address(0), "Organization not registered");
        return _organizations[wallet];
    }

    /// @notice Creates an activity with immutable public details and a service-date window.
    /// @dev The metadata URI and date window cannot be edited; close this activity and create
    ///      another one if its published details need to change.
    /// @param metadataURI Public off-chain activity details location.
    /// @param metadataHash keccak256 hash of the exact activity metadata bytes fetched from metadataURI.
    /// @param category Human-readable activity category.
    /// @param serviceStartDate Inclusive start of the service window, as a Unix timestamp in seconds.
    /// @param serviceEndDate Inclusive end of the service window, as a Unix timestamp in seconds.
    /// @return activityId New activity identifier, starting at 1.
    function createActivity(
        string calldata metadataURI,
        bytes32 metadataHash,
        string calldata category,
        uint64 serviceStartDate,
        uint64 serviceEndDate
    ) external returns (uint256 activityId) {
        _requireActiveOrganization(msg.sender);
        _validateMetadata(metadataURI, metadataHash);
        require(bytes(category).length != 0, "Activity category is empty");
        require(serviceStartDate <= serviceEndDate, "Invalid service date window");

        activityId = ++activityCount;
        _activities[activityId] = Activity({
            id: activityId,
            issuer: msg.sender,
            metadataURI: metadataURI,
            metadataHash: metadataHash,
            category: category,
            serviceStartDate: serviceStartDate,
            serviceEndDate: serviceEndDate,
            open: true,
            createdAt: uint64(block.timestamp)
        });
        _organizationActivityIds[msg.sender].push(activityId);

        emit ActivityCreated(activityId, msg.sender, category);
    }

    /// @notice Closes an activity so volunteers cannot submit new claims for it.
    /// @dev Pending claims remain reviewable by the active issuing organization.
    /// @param activityId Activity to close.
    function closeActivity(uint256 activityId) external {
        Activity storage activity = _activities[activityId];
        require(activity.id != 0, "Activity not found");
        require(activity.issuer == msg.sender, "Only activity issuer");
        _requireActiveOrganization(msg.sender);
        require(activity.open, "Activity already closed");

        activity.open = false;
        emit ActivityClosed(activityId, msg.sender);
    }

    /// @notice Returns the public details and current submission status of an activity.
    /// @param activityId Activity identifier.
    /// @return activity The activity record.
    function getActivity(uint256 activityId) external view returns (Activity memory activity) {
        require(_activities[activityId].id != 0, "Activity not found");
        return _activities[activityId];
    }

    /// @notice Returns all activity IDs created by an organization wallet.
    /// @param issuer Organization wallet whose activities should be returned.
    /// @return activityIds Activity IDs, including open and closed activities.
    function getOrganizationActivityIds(
        address issuer
    ) external view returns (uint256[] memory activityIds) {
        require(issuer != address(0), "Issuer wallet is zero");
        return _organizationActivityIds[issuer];
    }

    /// @notice Submits a pending claim for service performed by the caller's wallet.
    /// @dev Multiple claims per activity are allowed; the application should avoid accidental duplicates.
    /// @param activityId Open activity being claimed.
    /// @param claimedMinutes Claimed duration in whole minutes (60 minutes = 1 hour).
    /// @param serviceDate Service date as a Unix timestamp in seconds; use UTC midnight for date-only input.
    /// @param supportingInfoHash Optional keccak256 hash of off-chain supporting information; do not store personal data here.
    /// @return claimId New claim identifier, starting at 1.
    function submitServiceClaim(
        uint256 activityId,
        uint32 claimedMinutes,
        uint64 serviceDate,
        bytes32 supportingInfoHash
    ) external returns (uint256 claimId) {
        Activity storage activity = _activities[activityId];
        require(activity.id != 0, "Activity not found");
        require(activity.open, "Activity is closed");
        _requireActiveOrganization(activity.issuer);
        require(claimedMinutes > 0, "Claimed minutes must be positive");
        _requireServiceDateInWindow(activity, serviceDate);

        claimId = ++claimCount;
        _claims[claimId] = Claim({
            id: claimId,
            activityId: activityId,
            volunteer: msg.sender,
            claimedMinutes: claimedMinutes,
            serviceDate: serviceDate,
            supportingInfoHash: supportingInfoHash,
            status: ClaimStatus.Pending,
            submittedAt: uint64(block.timestamp),
            reviewedAt: 0,
            reviewer: address(0),
            approvedMinutes: 0,
            reviewNoteHash: bytes32(0),
            recordId: 0
        });
        _activityClaimIds[activityId].push(claimId);
        _volunteerClaimIds[msg.sender].push(claimId);

        emit ServiceClaimSubmitted(claimId, activityId, msg.sender, claimedMinutes, serviceDate);
    }

    /// @notice Approves a pending claim and creates its service record in the same transaction.
    /// @dev The organization may approve fewer or more minutes than claimed; both values remain recorded.
    /// @param claimId Pending claim to approve.
    /// @param approvedMinutes Approved duration in whole minutes (60 minutes = 1 hour).
    /// @param reviewNoteHash Optional hash of off-chain review notes.
    /// @return recordId Newly issued service record identifier.
    function approveClaim(
        uint256 claimId,
        uint32 approvedMinutes,
        bytes32 reviewNoteHash
    ) external returns (uint256 recordId) {
        Claim storage claim = _getPendingClaim(claimId);
        Activity storage activity = _activities[claim.activityId];
        require(msg.sender == activity.issuer, "Only activity issuer may review");
        _requireActiveOrganization(activity.issuer);
        require(approvedMinutes > 0, "Approved minutes must be positive");

        claim.status = ClaimStatus.Approved;
        claim.reviewedAt = uint64(block.timestamp);
        claim.reviewer = msg.sender;
        claim.approvedMinutes = approvedMinutes;
        claim.reviewNoteHash = reviewNoteHash;

        recordId = _storeServiceRecord(
            claim.id,
            claim.volunteer,
            activity.issuer,
            claim.activityId,
            approvedMinutes,
            claim.serviceDate,
            claim.supportingInfoHash,
            reviewNoteHash,
            0,
            bytes32(0)
        );
        claim.recordId = recordId;

        emit ServiceClaimReviewed(claimId, ClaimStatus.Approved, msg.sender, approvedMinutes, recordId);
    }

    /// @notice Rejects a pending claim without creating a service record.
    /// @param claimId Pending claim to reject.
    /// @param reasonHash Required keccak256 hash of the off-chain rejection reason; keep personal details off-chain.
    function rejectClaim(uint256 claimId, bytes32 reasonHash) external {
        Claim storage claim = _getPendingClaim(claimId);
        Activity storage activity = _activities[claim.activityId];
        require(msg.sender == activity.issuer, "Only activity issuer may review");
        _requireActiveOrganization(activity.issuer);
        require(reasonHash != bytes32(0), "Rejection reason hash is required");

        claim.status = ClaimStatus.Rejected;
        claim.reviewedAt = uint64(block.timestamp);
        claim.reviewer = msg.sender;
        claim.reviewNoteHash = reasonHash;

        emit ServiceClaimReviewed(claimId, ClaimStatus.Rejected, msg.sender, 0, 0);
    }

    /// @notice Returns a claim and its review outcome.
    /// @param claimId Claim identifier.
    /// @return claim The public claim record.
    function getClaim(uint256 claimId) external view returns (Claim memory claim) {
        require(_claims[claimId].id != 0, "Claim not found");
        return _claims[claimId];
    }

    /// @notice Returns all claim IDs submitted against an activity.
    /// @param activityId Activity whose claims should be returned.
    /// @return claimIds Claim IDs, including pending, approved, and rejected claims.
    function getActivityClaimIds(
        uint256 activityId
    ) external view returns (uint256[] memory claimIds) {
        require(_activities[activityId].id != 0, "Activity not found");
        return _activityClaimIds[activityId];
    }

    /// @notice Returns all claim and service-record IDs indexed for a volunteer wallet.
    /// @dev The lookup is public because blockchain state and activity are publicly observable.
    /// @param volunteer Wallet whose history should be returned.
    /// @return claimIds Claim IDs, including pending and rejected claims.
    /// @return serviceRecordIds Issued record IDs, including revoked and replaced records.
    function getVolunteerHistory(
        address volunteer
    ) external view returns (uint256[] memory claimIds, uint256[] memory serviceRecordIds) {
        require(volunteer != address(0), "Volunteer wallet is zero");
        return (_volunteerClaimIds[volunteer], _volunteerRecordIds[volunteer]);
    }

    /// @notice Returns all issued record IDs for an organization, including replaced records.
    /// @param issuer Organization wallet whose records should be returned.
    /// @return serviceRecordIds Record IDs issued by the organization.
    function getIssuerRecordIds(
        address issuer
    ) external view returns (uint256[] memory serviceRecordIds) {
        require(issuer != address(0), "Issuer wallet is zero");
        return _issuerRecordIds[issuer];
    }

    /// @notice Returns a service record for volunteer history or public verification.
    /// @param recordId Record identifier to verify.
    /// @return serviceRecord The public record and its current validity/correction links.
    function getServiceRecord(
        uint256 recordId
    ) external view returns (ServiceRecord memory serviceRecord) {
        require(_records[recordId].id != 0, "Service record not found");
        return _records[recordId];
    }

    /// @notice Revokes a currently valid service record without deleting its history.
    /// @param recordId Record to revoke.
    /// @param reasonHash Required keccak256 hash of the off-chain revocation reason.
    function revokeRecord(uint256 recordId, bytes32 reasonHash) external {
        ServiceRecord storage serviceRecord = _getValidRecord(recordId);
        _requireRecordManager(serviceRecord.issuer);
        require(reasonHash != bytes32(0), "Revocation reason hash is required");

        serviceRecord.status = RecordStatus.Revoked;
        serviceRecord.statusChangedAt = uint64(block.timestamp);
        serviceRecord.reasonHash = reasonHash;

        emit ServiceRecordRevoked(recordId, msg.sender, reasonHash, serviceRecord.statusChangedAt);
    }

    /// @notice Corrects an immutable record by invalidating it and issuing a linked replacement.
    /// @dev The replacement keeps the same volunteer, issuer, activity, and claim; only the
    ///      approved minutes or service date may change. Use revokeRecord for other errors.
    /// @param recordId Valid record to correct.
    /// @param correctedMinutes Corrected duration in whole minutes; must be positive.
    /// @param correctedServiceDate Corrected Unix timestamp in seconds, within the activity's date window.
    /// @param reasonHash Required keccak256 hash of the off-chain correction explanation.
    /// @return replacementRecordId New record ID linked to the corrected original.
    function correctRecord(
        uint256 recordId,
        uint32 correctedMinutes,
        uint64 correctedServiceDate,
        bytes32 reasonHash
    ) external returns (uint256 replacementRecordId) {
        ServiceRecord storage original = _getValidRecord(recordId);
        _requireRecordManager(original.issuer);
        require(correctedMinutes > 0, "Corrected minutes must be positive");
        require(reasonHash != bytes32(0), "Correction reason hash is required");

        Activity storage activity = _activities[original.activityId];
        _requireServiceDateInWindow(activity, correctedServiceDate);

        replacementRecordId = _storeServiceRecord(
            original.claimId,
            original.volunteer,
            original.issuer,
            original.activityId,
            correctedMinutes,
            correctedServiceDate,
            original.supportingInfoHash,
            original.reviewNoteHash,
            recordId,
            reasonHash
        );

        original.status = RecordStatus.Corrected;
        original.replacementRecordId = replacementRecordId;
        original.statusChangedAt = uint64(block.timestamp);
        original.reasonHash = reasonHash;

        emit ServiceRecordCorrected(recordId, replacementRecordId, msg.sender, reasonHash);
    }

    /// @notice Checks whether a service date is in the inclusive activity window and not in the future.
    /// @param activity Activity whose immutable service window applies.
    /// @param serviceDate Service date as a Unix timestamp in seconds.
    function _requireServiceDateInWindow(Activity storage activity, uint64 serviceDate) private view {
        require(serviceDate >= activity.serviceStartDate, "Service date before activity window");
        require(serviceDate <= activity.serviceEndDate, "Service date after activity window");
        require(serviceDate <= block.timestamp, "Service date is in the future");
    }

    /// @notice Requires a registered organization to be active before it performs an issuing action.
    /// @param wallet Organization wallet that must be active.
    function _requireActiveOrganization(address wallet) private view {
        Organization storage organization = _organizations[wallet];
        require(organization.id != 0, "Organization not registered");
        require(organization.active, "Organization is inactive");
    }

    /// @notice Requires a record action to come from its active issuer or the administrator.
    /// @param issuer Organization that issued the record.
    function _requireRecordManager(address issuer) private view {
        if (msg.sender == administrator) {
            return;
        }
        require(msg.sender == issuer, "Only issuer or administrator");
        _requireActiveOrganization(issuer);
    }

    /// @notice Returns a claim only when it exists and has not already been reviewed.
    /// @param claimId Claim identifier to validate.
    /// @return claim Storage reference to the pending claim.
    function _getPendingClaim(uint256 claimId) private view returns (Claim storage claim) {
        claim = _claims[claimId];
        require(claim.id != 0, "Claim not found");
        require(claim.status == ClaimStatus.Pending, "Claim is not pending");
    }

    /// @notice Returns a record only when it exists and remains valid.
    /// @param recordId Record identifier to validate.
    /// @return serviceRecord Storage reference to the valid record.
    function _getValidRecord(uint256 recordId) private view returns (ServiceRecord storage serviceRecord) {
        serviceRecord = _records[recordId];
        require(serviceRecord.id != 0, "Service record not found");
        require(serviceRecord.status == RecordStatus.Valid, "Service record is not valid");
    }

    /// @notice Creates a service record and adds it to the volunteer's append-only history.
    /// @param claimId Claim associated with the record.
    /// @param volunteer Wallet that performed the service.
    /// @param issuer Active organization responsible for the record.
    /// @param activityId Activity the service belongs to.
    /// @param approvedMinutes Approved duration in whole minutes.
    /// @param serviceDate Service date as a Unix timestamp in seconds.
    /// @param supportingInfoHash Hash of optional off-chain supporting information.
    /// @param reviewNoteHash Hash of optional off-chain review notes.
    /// @param replacesRecordId Previous record ID, or zero for an original issuance.
    /// @param reasonHash Correction reason hash, or zero for an original issuance.
    /// @return recordId Newly created record ID.
    function _storeServiceRecord(
        uint256 claimId,
        address volunteer,
        address issuer,
        uint256 activityId,
        uint32 approvedMinutes,
        uint64 serviceDate,
        bytes32 supportingInfoHash,
        bytes32 reviewNoteHash,
        uint256 replacesRecordId,
        bytes32 reasonHash
    ) private returns (uint256 recordId) {
        recordId = ++recordCount;
        _records[recordId] = ServiceRecord({
            id: recordId,
            claimId: claimId,
            volunteer: volunteer,
            issuer: issuer,
            activityId: activityId,
            approvedMinutes: approvedMinutes,
            serviceDate: serviceDate,
            issuedAt: uint64(block.timestamp),
            status: RecordStatus.Valid,
            replacesRecordId: replacesRecordId,
            replacementRecordId: 0,
            statusChangedAt: 0,
            reasonHash: reasonHash,
            supportingInfoHash: supportingInfoHash,
            reviewNoteHash: reviewNoteHash
        });
        _volunteerRecordIds[volunteer].push(recordId);
        _issuerRecordIds[issuer].push(recordId);

        emit ServiceRecordIssued(
            recordId,
            activityId,
            volunteer,
            issuer,
            approvedMinutes,
            serviceDate,
            replacesRecordId
        );
    }

    /// @notice Validates a public metadata URI and the hash used to check its content.
    /// @dev The contract stores the commitment but does not fetch or verify off-chain content itself.
    /// @param metadataURI Public location of organization or activity metadata.
    /// @param metadataHash keccak256 hash of the exact metadata bytes.
    function _validateMetadata(string calldata metadataURI, bytes32 metadataHash) private pure {
        require(bytes(metadataURI).length != 0, "Metadata URI is empty");
        require(metadataHash != bytes32(0), "Metadata hash is empty");
    }
}
