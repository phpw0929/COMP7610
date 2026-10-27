# Project context: Volunteer Service-Hour Verification

Handoff prepared on 2026-10-27. The next conversation will begin Solidity contract design and implementation. No project-specific Solidity contract has been implemented in this conversation.

## Read first

Paths below are relative to `final project/`:

- `AGENTS.md`: project workflow instructions.
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

Some introductory bullets in `doc/plan.md` still mention sharing, QR codes, or summaries. The explicit eight-function table and the user's removal request define the intended scope; those leftover phrases do not authorize extra features.

## Data and rules

The four entities are **Organization**, **Activity**, **Claim**, and **Verified Service Record**. Their proposed fields are in `doc/plan.md`; they include issuer/volunteer addresses, activity links, durations, dates, statuses, and correction links.

Claim workflow: `Pending -> Approved` or `Pending -> Rejected`. Rejection creates no approved credential. An issued record may later become `Revoked` or `Corrected`; replacement links preserve the history. Distinguish claim-review status from the current validity of an issued record.

Enforce positive durations, permissions, and valid transitions in Solidity. Preserve issued facts while recording status changes. Distinguish service dates from issuance timestamps.

Keep personal details off-chain. On-chain history is public, even if the interface shows only a selected record. Hashes verify matching content, not truth; mutable URIs alone do not ensure integrity. Wallets do not prove real-world identity.

## Design decisions still to resolve

The product is approved; the concrete contract design is not. Resolve during design:

- Fractional-hour representation and whether the issuer can adjust claimed hours.
- Duplicate claims, resubmission after rejection, and multiple sessions per activity.
- Activity edits/closure, date validation, and pending claims after issuer deactivation.
- Correction permissions and links. The plan mentions exceptional administrator intervention; replacement-issuance authority remains unclear. Avoid unrestricted rewriting.
- Whether issuer deactivation affects historical credentials; it is not automatically credential revocation.
- Simple storage, IDs, history retrieval, and metadata integrity. No off-chain storage provider is selected.

## Scope boundaries

Exclude payments, reward tokens, NFTs, transferable credentials, GPS/geofencing, venue QR attendance, photos, handwritten signatures, emails, two-stage institutional approval, skills matching, bookings/waitlists, recurring schedules, background checks, waivers, team/bulk management, PDF/CSV exports, impact dashboards, and economic-value conversion. These were discussed but not adopted for the MVP.

## Implementation and coursework context

- Target Solidity on Sepolia, with React/Vite, Ethers.js, and MetaMask for the eventual frontend.
- `dapp/` contains only `index.html`, `package.json`, `package-lock.json`, and `src/App.jsx`. Invalid `</XXXX>` placeholders and NFT wording remain. It is not runnable as the volunteer DApp; the final tree in `guide.md` is a target, not the current state.
- Use `dapp/contracts/`. Review the design, implement incrementally, and give Remix/local test inputs, expected states, and rejected permission/state cases. Avoid a monolithic code dump.
- Demonstrate administrator registration, activity creation, claim submission, unauthorized-review rejection, approval/issuance, volunteer history, public lookup, and revocation/correction history.
- Coursework requires meaningful on-chain operation(s), a testnet deployment, an English demo within 15 minutes, a PDF report, and runnable source with README. The brief lists final submission on November 8 at 11:59 PM.
- Use simple Git workflows in the parent `COMP7610` repository: `https://github.com/phpw0929/COMP7610.git`. The template's nested `dapp/.git` was moved out. Recheck status; earlier failed pushes do not establish current sync state.

Next: translate the eight features into a small Solidity design and implement step by step. Preserve the approved scope.
