# Project context: Volunteer Service-Hour Verification

Updated on 2026-10-28 after explicit execution authorization. The frontend is now implemented and builds successfully; 15 automated tests, a complete local-EVM browser workflow (14 successful transactions), clean reproduction, mobile width checks and real Sepolia read-only verification have passed. Solidity and original artifacts remain unchanged. Report/video drafts are generated, not final course submissions. User confirmed friend owns contracts/deployment and this work owns frontend. Member identities can be filled last.

This work is isolated in `/Users/diannao/Desktop/HKU/Semester-1/COMP7610/delivery`; preserve the concurrently edited `/Users/diannao/Desktop/HKU/Semester-1/COMP7610/repo`. Use handoff/merge_protocol.md. Connected GitHub account has no push access to the original repository.

## Read first

Paths below are relative to `final project/`:

- `AGENTS.md`: project workflow instructions.
- `doc/execution_plan.md`: current implementation, acceptance, report/video and submission plan (G0-G7).
- `doc/plan_review_2026-10-28.md`: feasibility and formal course-requirements coverage; not an implementation pass.
- `handoff/integration_status.md`: outstanding deployment/RPC/accounts/metadata, real progress and evidence.
- `../DOCUMENT_INDEX.md`: complete repository document index; update when documents change.
- `doc/plan.md`: reviewed product plan, data model, business rules, and acceptance criteria.
- `doc/guide.md`: template structure and implementation guide, renamed from `folder_structure.md`.
- `doc/Final Project.pdf` and `doc/Project Tutorial.pdf`: coursework requirements and technical tutorial.
- `doc/DApp_idea.xlsx`: earlier idea comparison; the group has already selected volunteer service-hour verification.

## Goal and agreed direction

Build a simple, useful DApp through which recognized organizations approve volunteer service hours and third parties independently verify the resulting records. The user rejected a basic NFT-as-proof application and wants a practical approval and verification workflow with manageable smart-contract complexity.

Blockchain provides attributable issuer approvals, persistent issuance history, and visible revocation/correction status. It does not independently prove attendance or the truth of the hours reported. Recognizing organizations and checking real-world participation remain human responsibilities. No NFT or token is required.

## Users

- **Administrator:** registers, approves, and deactivates issuing organizations. Cannot silently rewrite approved service details.
- **Organization:** creates activities, reviews claims for its own activities, and revokes or corrects records.
- **Volunteer:** submits claims using their own wallet and views their claims and service records.
- **Verifier:** looks up an individual record without a wallet transaction.

## Approved MVP: exactly eight product functions

| Function | Agreed behavior |
|---|---|
| 1. Recognized organization registration | Administrator maintains recognized issuer wallets and their active status. |
| 2. Service activity creation | An active issuer creates an activity that volunteers can reference in claims. |
| 3. Volunteer service-hour claim submission | A volunteer submits a claim for their own wallet; it starts as `Pending`. |
| 4. Organization approval or rejection | Only the activity's organization reviews a pending claim; review happens once. |
| 5. Verified service-record creation and status management | Approval produces a verifiable record. Approved service details cannot be edited in place. |
| 6. Volunteer service-history dashboard | Shows the connected volunteer's claims and records, including invalidated or replaced records. Contract reads support the frontend dashboard. |
| 7. Public verification of individual records | Read-only lookup by record ID returns the issuer, volunteer, activity, hours, dates, and current status. |
| 8. Revocation and corrected-record history | Invalidate an incorrect record and, when appropriate, link a replacement while preserving the original history. |

These are eight product features, not a requirement to have exactly eight Solidity functions. Approval should create the record as part of the same workflow, rather than requiring the volunteer to mint or approve it separately.

The user explicitly requested removal of **Browse service activities** and **Share verification link or QR code**. The separate verification-summary/total-hours function was also removed when the table was reduced to eight rows. Do not reintroduce these as first-version requirements. Activities can be referenced by ID supplied by the organization; public verification uses a record ID.

The 2026-10-28 documentation update removes stale sharing/QR/summary wording from the product plan. The explicit eight-function table and exclusions remain the scope boundary.

## Data and rules

The four entities are **Organization**, **Activity**, **Claim**, and **Verified Service Record**. Their proposed fields are in `doc/plan.md`; they include issuer/volunteer addresses, activity links, durations, dates, statuses, and correction links.

Claim workflow: `Pending -> Approved` or `Pending -> Rejected`. Rejection creates no approved credential. An issued record may later become `Revoked` or `Corrected`; replacement links preserve the history. Distinguish claim-review status from the current validity of an issued record.

Enforce positive durations, permissions, and valid transitions in Solidity. Preserve issued facts while recording status changes. Distinguish service dates from issuance timestamps.

Keep personal details off-chain. On-chain history is public, even if the interface shows only a selected record. Hashes verify matching content, not truth; mutable URIs alone do not ensure integrity. Wallets do not prove real-world identity.

## Implemented contract decisions and remaining integration dependencies

- Durations are positive whole minutes (`uint32`). Approved minutes may differ from claimed minutes; both persist.
- Multiple claims per volunteer/activity are allowed; prevent accidental duplicate clicks without changing this rule.
- Activity metadata/category/date windows are immutable. Closing an activity blocks new claims but permits existing pending claims to be reviewed by its active issuer.
- Service dates are Unix seconds within the activity window and not in the future; date-only UI uses UTC midnight.
- Only active issuers can review their activities. Issuer deactivation does not automatically invalidate existing records; the administrator can still manage records.
- Correction creates a linked replacement retaining volunteer/issuer/activity/claim; minutes/date may change. No in-place rewrite or NFT mint is used.
- Organization/activity metadata and rejection/revocation/correction reasons require nonzero hashes. Supporting-info and approval-note hashes can be zero.
- Confirm the final live deployment/settings, controllable role accounts and test ETH. A reported address and historical test marks are not a new verification.
- Resolve a browser-usable read-only RPC, public static metadata bytes/URI/hash and team ownership. The execution plan proposes a small JSON schema and static-file workflow, still to be confirmed in G0.

## Scope boundaries

Exclude payments, reward tokens, NFTs, transferable credentials, GPS/geofencing, venue QR attendance, photos, handwritten signatures, emails, two-stage institutional approval, skills matching, bookings/waitlists, recurring schedules, background checks, waivers, team/bulk management, PDF/CSV exports, impact dashboards, and economic-value conversion. These were discussed but not adopted for the MVP.

## Implementation and coursework context

- Target Solidity on Sepolia, with React/Vite, Ethers.js, and MetaMask for the eventual frontend.
- `dapp/` has a working React entry, four workspaces, useRegistry hook, validated utils, responsive CSS, demo metadata and development-only tests/harness. The prior missing-entry/placeholder errors are fixed. npm ci/test/build passed in a clean directory.
- Keep the implemented `dapp/contracts/VolunteerHoursRegistry.sol` and ABI stable for frontend work. Follow G0-G7 incrementally and record real T01-T14 results. Ganache and solc were added for development-only real local-EVM tests; no production library or contract rewrite was added.
- Demonstrate administrator registration, activity creation, claim submission, unauthorized-review rejection, approval/issuance, volunteer history, public lookup, and revocation/correction history.
- Coursework requires meaningful on-chain operation(s), a testnet deployment, an English demo within 15 minutes, a PDF report, and runnable source with README. The brief lists final submission on November 8 at 11:59 PM.
- Use simple Git workflows in the parent `COMP7610` repository: `https://github.com/phpw0929/COMP7610.git`. The template's nested `dapp/.git` was moved out. Recheck status; earlier failed pushes do not establish current sync state.

Next: finish the external integration conditions: contract owner must provide controllable Sepolia wallets/test ETH, deployment tx and published metadata; run a fresh signed UI workflow. Add real group contributions and confirm live portal requirements, then finalize report/video and submit. Do not redo the already implemented frontend or relabel local tests as Sepolia writes. Keep evidence, code changes, deployment, media delivery and submission states separate; preserve the approved scope.


## Evidence boundaries

Real Sepolia proof: `test/acceptance/sepolia-proof.json`, code/getters and browser record lookup. Executable code matches the build excluding immutable slots and CBOR metadata; full compiler metadata differs, and historical logs were pruned at the public endpoint. This is not deployment receipt/source verification. Existing issuer is inactive; old activity is closed, records corrected/revoked.

Local browser proof: `local-browser-ledger.json`, 14 real local transactions, 3 claims and 5 records. The injected test role toolbar is confined to local-test development on loopback and absent from the production build. Report is 4 pages; narrated evidence draft is about 220 seconds, based on actual captures with system-synthesized English speech. Do not call it the final live Sepolia recording. T11 delayed/cancelled/provider combinations remain partially untested.
