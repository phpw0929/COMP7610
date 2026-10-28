# English evidence walkthrough script

Status: development draft. Captured screens with calm English female narration; not the final signed Sepolia live demonstration.

## 1. Observed Sepolia records

This development walkthrough presents the Volunteer Hours Registry for COMP seven six one zero. It uses captured browser evidence rather than claiming to be the final live testnet demonstration. The project lets recognized organizations approve volunteer service minutes, while anyone can check a record and its correction history. This first screen reads an actual Sepolia contract without connecting a wallet. The old record is corrected. The issuing organization is inactive, and its legacy example metadata is explicitly unverified. Blockchain state is not proof that a person really attended.

## 2. Application workflow on a local EVM

The implemented frontend contains four workspaces: public verification, my service, organization, and administration. In the local browser integration run, an administrator registered a demo organization. The organization created an activity. A volunteer submitted one hundred and twenty minutes, and the organization approved ninety. Approval automatically issued a service record in the same transaction. These operations ran the real Solidity code on a local Ethereum virtual machine. The local test banner is visible. This is genuine local contract execution, but it is not a new Sepolia wallet transaction.

## 3. Correction and revocation history

Approved facts cannot be edited silently. The issuer issued a linked replacement, then a second correction. The earlier records stayed readable, with links in both directions. Revocation invalidated the latest record without deleting the history. Browser testing discovered a stale status after a successful correction. That defect was fixed. The current build refreshes the displayed record after a confirmed write, shows the last lookup time, and provides a refresh control. This screen shows the correctly refreshed revoked state.

## 4. Wallet-free verification and metadata

An independent page with no test wallet connected successfully read the final local record. Its issuer had been deactivated, but the record itself remained valid, which is the contract rule. The administrator can still handle an exceptional correction. Organization and activity names are marked verified only when their exact downloaded bytes match the on-chain hash. The frontend distinguishes an unavailable or mismatched metadata file from the validity of the service record. A hash is an integrity commitment, not encryption and not proof of attendance.

## 5. Verification results and responsive layout

Fifteen automated tests passed. They cover integer and date boundaries, metadata integrity, review permissions, rejection without issuance, public history, multiple corrections, revocation, activity closure and administrator intervention. Separate browser operation created fourteen successful local transactions, three claims and five records. Wallet rejection produced a clear message instead of fake success. An unauthorized wallet could not enter administration. A three hundred and ninety pixel viewport had no horizontal overflow. A clean installation passed the same tests and the production build. These are functional results, not production performance measurements.

## 6. Team handoff and remaining final evidence

The ownership boundary is agreed: the friend maintains contracts and deployment, while this work delivers the frontend and integration tests. The repository includes a readable report draft, source code, configuration, a merge protocol and evidence files. Before the final course submission, the team must add real member details, publish usable demo metadata, confirm the deployment transaction, and record a fresh signed Sepolia workflow through the frontend. The final English video must remain within fifteen minutes. Each student must also complete the individual peer assignment. Private keys should never be shared. This draft honestly separates completed frontend work from the remaining team actions.
