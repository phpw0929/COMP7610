# Volunteer Service-Hour Verification DApp

## 1. Project definition

The DApp is a blockchain-based platform for issuing and verifying volunteer service-hour records.

An approved service organization confirms that a volunteer completed a specified activity for a stated number of hours. The volunteer can view the record and share a verification link. A school, employer, scholarship committee, or other verifier can independently check the record and its current status.

The DApp provides a common record system for multiple organizations. Its blockchain value comes from:

- **Immutability:** an approved record cannot be silently edited or deleted.
- **Transparency:** a verifier can inspect the issuer, activity, hours, date, and status.
- **Cryptographic security:** wallet signatures identify the account that submitted, approved, or revoked a record.
- **Decentralized verification:** a verifier does not need to contact the issuing organization for every check.

The blockchain proves that an authorized organization issued a particular record. It does not independently prove that the volunteer physically attended the activity. The organization remains responsible for confirming attendance and hours.

## 2. Users and permissions

### Volunteer

- Connects a wallet.
- Opens an activity reference shared by a service organization.
- Submits a claim for completed service hours.
- Views personal service records and their statuses.
- Shares a selected record or verification summary.

### Service organization

- Is registered and approved as an issuer.
- Creates service activities.
- Reviews claims for its own activities.
- Approves or rejects claims.
- Revokes an incorrect record or issues a corrected record.

### Verifier

- Does not need to submit a transaction.
- Opens a record through a record ID, link, or QR code.
- Checks the issuer, activity, hours, date, volunteer wallet, and current status.

### Platform administrator

- Registers or approves recognized service organizations.
- Deactivates an issuer when necessary.
- Does not edit approved service records.

## 3. Recommended first-version functions

| Function | Purpose | Main user | Smart-contract implementation logic |
|---|---|---|---|
| **Register recognized organization** | Establish which organizations are allowed to issue verified service records. | Platform administrator | Store an organization ID, organization wallet, display metadata reference, and active status. Only the administrator can add, approve, or deactivate an issuer. Emit an organization-status event. |
| **Create service activity** | Publish a volunteer opportunity that can later be referenced by a service claim. | Service organization | Require an active issuer. Store an activity ID, issuer address, activity metadata reference, service date or date range, category, and active status. Only the creating issuer can update or close its activity. |
| **Submit service-hour claim** | Let a volunteer request recognition for completed service. | Volunteer | Require the caller to be the volunteer wallet and the activity to exist and be active. Store a claim ID, activity ID, volunteer address, claimed hours, supporting metadata reference, and `Pending` status. Emit a claim-submitted event. |
| **Approve or reject claim** | Let the responsible organization decide whether the claimed service is valid. | Service organization | Permit review only by the issuer of the referenced activity. A pending claim can become `Approved` or `Rejected`; the decision and reviewer address are recorded. A claim cannot be reviewed twice. |
| **Create verified service record** | Represent an approved and verifiable service contribution. | Service organization and volunteer | Approval creates or activates a record containing the record ID, volunteer address, issuer address, activity ID, approved hours, service date, issue time, and status. The approved fields cannot be edited in place. Emit a record-issued event. |
| **View volunteer service history** | Give a volunteer a complete view of personal claims and issued records. | Volunteer | Read records indexed by the connected volunteer address. Display pending, approved, rejected, revoked, and corrected statuses. The contract exposes the data; the frontend provides the history view. |
| **Publicly verify an individual record** | Allow a third party to check whether a service record is authentic and currently valid. | Verifier | Provide a read-only lookup by record ID. Return the issuer, volunteer wallet, activity, approved hours, issue time, current status, and any linked correction or revocation reference. No verifier transaction is required. |
| **Revocation and corrected-record history** | Mark an incorrect record as invalid and issue a traceable replacement without deleting the original history. | Service organization or platform administrator | Permit the issuer, or the administrator for an exceptional case, to change an approved record to `Revoked` or `Corrected`. Store the status-change time, reason reference, and replacement or previous record ID. The original record remains queryable. |

## 4. Core data model

The contract should store only the data required for verification and state management.

### Organization

- Organization ID
- Issuer wallet address
- Metadata reference for name and public description
- Active or inactive status
- Registration timestamp

### Activity

- Activity ID
- Issuing organization address
- Metadata reference for title, description, and location information
- Service date or date range
- Activity category
- Open or closed status

### Claim

- Claim ID
- Activity ID
- Volunteer wallet address
- Claimed hours
- Supporting-information reference or hash
- Claim status
- Submission and review timestamps
- Reviewer address, when reviewed

### Verified service record

- Record ID
- Volunteer wallet address
- Issuing organization address
- Activity ID
- Approved hours
- Service date
- Issue timestamp
- Current status
- Previous or replacement record ID, when applicable
- Revocation or correction reference, when applicable

Names, email addresses, phone numbers, photos, GPS traces, uploaded documents, and other sensitive information should remain off-chain. The contract may store a hash or metadata URI when the application needs to prove that off-chain information has not been replaced.

## 5. Business rules

1. Only an active, recognized organization can issue or review service records.
2. Only the organization that created an activity can review claims for that activity.
3. A volunteer can submit a claim only for the volunteer’s connected wallet.
4. Claimed and approved hours must be positive numeric values.
5. A claim starts as `Pending` and can be reviewed only once in the first version.
6. Only the responsible organization can approve or reject a pending claim.
7. Approval creates a verifiable service record; rejection does not create an approved record.
8. Approved records cannot be edited or deleted in place.
9. An incorrect record is handled through revocation or a linked corrected record.
10. Public verification is read-only and does not require a verifier wallet transaction.
11. A volunteer’s wallet is treated as the account identifier. The DApp does not claim that a wallet address is a legally verified identity.
12. The contract does not make an independent judgment about whether the volunteer actually attended. The issuing organization is the trusted source for that fact.
13. The first version does not handle payments, tokens, NFTs, deposits, GPS attendance, photo evidence, background checks, or external institutional databases.

## 6. Main user flow

1. The administrator registers an organization wallet.
2. The organization creates a service activity and shares its reference with the volunteer.
3. The volunteer submits a completed-hours claim.
4. The organization reviews the claim and approves or rejects it.
5. An approved claim becomes a verified service record.
6. The volunteer sees the record in the service-history dashboard.
7. The verifier opens the public verification page using the record ID and checks the current status.
8. If an error is discovered, the organization revokes the record and may issue a linked correction.

## 7. Scope and success criteria

The first version is complete when a testnet user can demonstrate the full claim-to-verification workflow with at least one administrator, one organization, one volunteer, and one verifier account.

The demonstration should show:

- Organization registration and activity creation.
- Volunteer claim submission.
- Rejection of an unauthorized or invalid review attempt.
- Organization approval and record creation.
- Volunteer history.
- Public verification from a record ID.
- Revocation or correction with preserved history.

The group should implement the smallest reliable workflow first, test each state transition on the testnet, and add presentation features only after the contract rules and verification behavior are stable.
