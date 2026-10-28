# Frontend Handoff: VolunteerHoursRegistry

Updated 2026-10-28. The address below has passed real RPC/browser reads; executable bytecode matches the artifact excluding immutable ranges and compiler metadata. The metadata hash differs; deployment transaction and role control are still pending in [integration_status.md](integration_status.md). See [execution_plan.md](../doc/execution_plan.md) for the frontend and complete coursework delivery plan.

## Connection data

- Network: Sepolia
- Chain ID: `0xaa36a7`
- Contract: `VolunteerHoursRegistry`
- Address: `0xf1a55E316439a99Cd904E131e0f889E4D36D7DEe`
- Explorer: `https://sepolia.etherscan.io`
- ABI source: `dapp/artifacts/VolunteerHoursRegistry.json` → `abi`
- Runtime address: `dapp/.env` → `VITE_CONTRACT_ADDRESS`

Writes require a signer, MetaMask approval, and gas. View functions are read-only. Durations use whole minutes, dates use Unix seconds, IDs use integers, and optional hashes use a 32-byte zero hash.

Only supporting-information hashes and approval review-note hashes are optional. Organization/activity metadata hashes and rejection/revocation/correction reason hashes must be nonzero. The zero hash is not a valid substitute for required metadata/reasons. JSON metadata integrity uses keccak256 of exact fetched bytes. Public wallet-free verification uses the implemented READ_RPC_URL / VITE_READ_RPC_URL configuration, with a public Sepolia default. No signature is requested for these reads.

Claim status: `0 None`, `1 Pending`, `2 Approved`, `3 Rejected`.

Record status: `0 None`, `1 Valid`, `2 Revoked`, `3 Corrected`.

## Frontend-callable functions

For read functions, the example is the returned value. For write functions, Ethers.js first returns a transaction response such as `{ hash: "0x..." }`; after `await tx.wait()`, the Solidity result can be obtained from the receipt/event. Addresses and hashes below are shortened for readability.

For writes, the Solidity return value is not a direct property of the transaction response or receipt. Parse the relevant emitted event for the ID, or query confirmed contract state. Getter integers are generally `bigint` in Ethers 6. Treat `getOrganization` reverting for an unregistered wallet as a normal non-organization case, while distinguishing transport/network errors.

| Function | Purpose | Inputs | Output | Example output |
|---|---|---|---|---|
| `administrator()` | Read administrator wallet | none | `address` | `0x1111...1111` |
| `organizationCount()` | Read number of organizations | none | `uint256` | `1` |
| `activityCount()` | Read number of activities | none | `uint256` | `1` |
| `claimCount()` | Read number of claims | none | `uint256` | `2` |
| `recordCount()` | Read number of service records | none | `uint256` | `1` |
| `registerOrganization` | Admin registers an issuer | `wallet`, `metadataURI`, `metadataHash` | `organizationId` | `1` (`OrganizationRegistered`) |
| `setOrganizationActive` | Admin activates/deactivates issuer | `wallet`, `active` | none | Transaction confirmed; `OrganizationStatusChanged(..., active=false, ...)` |
| `getOrganization` | Read issuer by wallet | `wallet` | `Organization` | `{ id:1, wallet:0x2222...2222, metadataURI:"https://example.org/org.json", metadataHash:0xaaa..., active:true, registeredAt:1793118672 }` |
| `getOrganizationById` | Read issuer by ID | `organizationId` | `Organization` | Same `Organization` object as `getOrganization` |
| `createActivity` | Organization publishes activity | `metadataURI`, `metadataHash`, `category`, `serviceStartDate`, `serviceEndDate` | `activityId` | `1` (`ActivityCreated`) |
| `closeActivity` | Organization closes activity | `activityId` | none | Transaction confirmed; `ActivityClosed(1, issuer)` |
| `getActivity` | Read activity details | `activityId` | `Activity` | `{ id:1, issuer:0x2222...2222, metadataURI:"https://example.org/activity-1.json", metadataHash:0xbbb..., category:"Community service", serviceStartDate:1767225600, serviceEndDate:1798761600, open:true, createdAt:1793119320 }` |
| `getOrganizationActivityIds` | List issuer activity IDs | `issuer` | `uint256[]` | `[1, 2]` |
| `submitServiceClaim` | Volunteer submits claim | `activityId`, `claimedMinutes`, `serviceDate`, `supportingInfoHash` | `claimId` | `1` (`ServiceClaimSubmitted`) |
| `approveClaim` | Issuer approves pending claim and creates record | `claimId`, `approvedMinutes`, `reviewNoteHash` | `recordId` | `1` (`ServiceClaimReviewed`, `ServiceRecordIssued`) |
| `rejectClaim` | Issuer rejects pending claim | `claimId`, `reasonHash` | none | Transaction confirmed; claim status becomes `Rejected` |
| `getClaim` | Read claim details | `claimId` | `Claim` | `{ id:1, activityId:1, volunteer:0x3333...3333, claimedMinutes:120, serviceDate:1792886400, supportingInfoHash:bytes32(0), status:1 (Pending), submittedAt:1793119620, reviewedAt:0, reviewer:0x0000...0000, approvedMinutes:0, reviewNoteHash:bytes32(0), recordId:0 }` |
| `getActivityClaimIds` | List claims for activity | `activityId` | `uint256[]` | `[1, 2]` |
| `getVolunteerHistory` | List volunteer claims and records | `volunteer` | `claimIds`, `serviceRecordIds` | `([1, 2], [1])` |
| `getIssuerRecordIds` | List issuer record IDs | `issuer` | `uint256[]` | `[1, 2]` |
| `getServiceRecord` | Publicly verify a record | `recordId` | `ServiceRecord` | `{ id:1, claimId:1, volunteer:0x3333...3333, issuer:0x2222...2222, activityId:1, approvedMinutes:90, serviceDate:1792886400, issuedAt:1793120100, status:1 (Valid), replacesRecordId:0, replacementRecordId:0, statusChangedAt:0, reasonHash:bytes32(0), supportingInfoHash:bytes32(0), reviewNoteHash:bytes32(0) }` |
| `revokeRecord` | Issuer/admin invalidates valid record | `recordId`, `reasonHash` | none | Transaction confirmed; record status becomes `Revoked` and `ServiceRecordRevoked` is emitted |
| `correctRecord` | Issuer/admin replaces valid record | `recordId`, `correctedMinutes`, `correctedServiceDate`, `reasonHash` | `replacementRecordId` | `2` (`ServiceRecordCorrected`); record `1` becomes `Corrected` |

Returned structs contain:

- `Organization`: `id`, `wallet`, `metadataURI`, `metadataHash`, `active`, `registeredAt`
- `Activity`: `id`, `issuer`, `metadataURI`, `metadataHash`, `category`, `serviceStartDate`, `serviceEndDate`, `open`, `createdAt`
- `Claim`: `id`, `activityId`, `volunteer`, `claimedMinutes`, `serviceDate`, `supportingInfoHash`, `status`, `submittedAt`, `reviewedAt`, `reviewer`, `approvedMinutes`, `reviewNoteHash`, `recordId`
- `ServiceRecord`: `id`, `claimId`, `volunteer`, `issuer`, `activityId`, `approvedMinutes`, `serviceDate`, `issuedAt`, `status`, `replacesRecordId`, `replacementRecordId`, `statusChangedAt`, `reasonHash`, `supportingInfoHash`, `reviewNoteHash`

## Permissions

- Administrator: register/deactivate organizations; correct or revoke records exceptionally.
- Active organization: create/close activities, approve/reject its claims, correct/revoke its records.
- Volunteer: submit claims and read personal history.
- Verifier: read `getServiceRecord` and related activity/organization data without a transaction.

## Events useful for refreshing UI

`OrganizationRegistered`, `OrganizationStatusChanged`, `ActivityCreated`, `ActivityClosed`, `ServiceClaimSubmitted`, `ServiceClaimReviewed`, `ServiceRecordIssued`, `ServiceRecordRevoked`, `ServiceRecordCorrected`.

## Internal Solidity helpers

`_requireServiceDateInWindow`, `_requireActiveOrganization`, `_requireRecordManager`, `_getPendingClaim`, `_getValidRecord`, `_storeServiceRecord`, and `_validateMetadata` are private helpers. They are not frontend-callable and do not belong in the UI function list.


## Current execution evidence

The UI, local-EVM lifecycle and 15 automated tests have been implemented and executed; see [browser_acceptance.md](../test/acceptance/browser_acceptance.md). Local signing through a development harness is not live MetaMask/Sepolia acceptance. The existing issuer is inactive and its old activity closed; the contract owner must prepare a new demo activity and accessible metadata. Keep source/ABI stable or apply the [merge protocol](merge_protocol.md) before final verification.
