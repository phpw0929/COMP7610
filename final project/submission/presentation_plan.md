# Volunteer Service-Hour Verification DApp Presentation Plan

## Presentation goal

Explain the verification problem, the DApp's user journey, its blockchain implementation, and the evidence supporting the prototype. Balance the instructor's need to assess the technical contribution with a user's need to understand how to use it.

- **Audience:** COMP7610 course instructor and DApp users.
- **Language:** English, with technical terms explained through user actions.
- **Length:** 12 slides, including opening and closing slides.
- **Timing:** 11 minutes 20 seconds of planned content, including the browser demonstration. Allow two additional minutes for wallet switching and confirmation, leaving room within the course's 15-minute video limit.
- **Story arc:** Problem, blockchain rationale, people and rules, implementation, demonstration, results, limitations, and outcome.

## 1. Presentation outline

| Slide | Title | One-line purpose | What the audience should feel | Time |
|---|---|---|---|---|
| 1 | Volunteer Service-Hour Verification DApp | Introduce the project and its value to volunteers, issuers, and verifiers. | Interested and clear about the subject. | 0:20 |
| 2 | The service-record verification problem | Show why a submitted record may need an independent status check. | The problem is relevant and easy to understand. | 0:40 |
| 3 | Why a blockchain registry | Explain the value of attributable issuance and persistent history. | The technology choice serves a specific need. | 0:40 |
| 4 | Four workspaces and eight features | Map product capabilities to the people who use them. | Oriented and able to identify their role. | 0:50 |
| 5 | Claims and service-record history | Explain approval, validity, correction, and revocation. | Confident about what the statuses mean. | 0:45 |
| 6 | How the browser connects to Sepolia | Explain the frontend, Ethers.js, wallet, and contract responsibilities. | The system is understandable. | 0:55 |
| 7 | Demo: organization and activity setup | Show the administrator and organization preparing an activity. | Ready to follow the real interface. | 1:10 |
| 8 | Demo: claim, approval, and verification | Follow one claim through approval to public verification. | Confident in the core user workflow. | 2:10 |
| 9 | Demo: correction and revocation | Show visible status changes and preserved record history. | Reassured that changes remain traceable. | 1:30 |
| 10 | Testing and observed results | Present specific results with their evidence boundaries. | Trust grounded in evidence. | 1:00 |
| 11 | Limitations and trust | Explain human responsibilities and technical dependencies. | Realistic confidence in the prototype. | 0:45 |
| 12 | Project outcome and next steps | Close with the delivered value and focused improvements. | Clear about the contribution and its next steps. | 0:35 |

## 2. Slide content

### Slide 1: Volunteer Service-Hour Verification DApp

**Key points**

- Project name and COMP7610 course title.
- Short description: Organizations approve service claims. Anyone can check the resulting record and its current status.
- Actual team names and student IDs, once confirmed.

**Layout:** Minimal title slide with a genuine crop of the public verification interface. Keep the project description to one sentence.

**Transition:** Introduce a verifier trying to establish whether a volunteer's record is still valid.

### Slide 2: The service-record verification problem

**Key points**

- Independent organizations maintain separate service records.
- A submitted copy may not show a later correction or revocation.
- Verifiers need to check the issuer, approved duration, and current validity without repeatedly contacting the issuer.

**Layout:** Use one clearly fictional example involving a volunteer, organization, and verifier. Show the verifier's information needs beside the scenario. Avoid invented fraud statistics or institutional adoption claims.

**Transition:** Explain how a shared, independently readable issuance history addresses this problem.

### Slide 3: Why a blockchain registry

**Key points**

- Wallet signatures attribute submissions and approvals to accounts.
- The contract preserves issued facts and links corrected replacements.
- Anyone can query record validity independently of the issuing organization's database.
- Organizations still verify attendance. The registry cannot establish real-world truth.

**Layout:** A simple comparison of institution-managed lookup and public contract lookup. Explain the trade-offs verbally: gas costs, public history, and external service dependencies.

**Transition:** Identify who controls each part of the workflow.

### Slide 4: Four workspaces and eight features

**Key points**

Use the actual UI tab names and show all eight agreed product features:

| Workspace | Product features | User |
|---|---|---|
| Administration | 1. Register and manage recognized organizations | Administrator |
| Organization | 2. Create activities; 4. Approve or reject claims; 5. Create verified records automatically on approval; 8. Revoke or correct records | Registered organization |
| My service | 3. Submit service-hour claims; 6. View volunteer history | Volunteer |
| Public verification | 7. Verify an individual record | Anyone |

- Approval creates the record in the same transaction. No separate issuance or mint action is needed.
- The administrator can also handle exceptional corrections and revocations.

**Layout:** One four-row table. Use short feature labels on the actual slide and explain the detail aloud.

**Transition:** Separate the volunteer's claim from the approved service record.

### Slide 5: Claims and service-record history

**Key points**

- A claim starts as Pending and receives one decision: Approved or Rejected.
- Approval creates a Valid record containing the issuer, volunteer, activity, approved minutes, and service date.
- A valid record can become Corrected with a linked replacement, or Revoked. Both remain readable.
- A claim can remain Approved while its issued record becomes Corrected or Revoked.

**Layout:** Two separate state sequences, one for claims and one for records. Illustrate 120 minutes claimed, 90 approved, then a replacement approving 100 minutes. Label these as proposed demo inputs.

**Transition:** Explain how the browser sends these actions to the deployed contract.

### Slide 6: How the browser connects to Sepolia

**Key points**

- React and Vite provide the browser interface. Website hosting and contract deployment are separate operations.
- Ethers.js uses the contract address and ABI to encode calls, read results, wait for receipts, and decode events. The application uses it in `useRegistry.js`.
- MetaMask holds the wallet keys and requests transaction approval.
- The Sepolia contract enforces permissions and stores claims, records, and status changes.

**Layout:** One architecture diagram with two labeled paths: public reads through a read-only RPC, and writes through MetaMask followed by Sepolia confirmation. Show metadata as an external JSON source whose downloaded bytes the frontend checks against the stored hash. Keep full addresses and code in speaker notes.

**Transition:** Move to the browser and follow one fictional service activity.

### Slide 7: Demo: organization and activity setup

**Key points**

- Account 1 controls the actual contract administrator wallet and registers Account 2 as an organization.
- Account 2 creates an activity using the demo metadata, category `Community service`, and a service-date window.
- The app displays the confirmed activity ID for the volunteer to use.

**Browser sequence:** Administration, Register organization, confirmation, switch/reconnect Account 2, Organization, Create activity, confirmation and activity ID.

**Layout:** Browser takes most of the screen. Show only the current role, action, and resulting ID beside it.

**Demo inputs:** Use the runbook's activity window of 2026-01-01 to 2027-01-01. The organization wallet must not already be registered. If using existing setup, show its actual state and transaction evidence rather than attempting duplicate registration.

**Transition:** Give the activity ID to the volunteer.

### Slide 8: Demo: claim, approval, and verification

**Key points**

- Account 3 submits 120 minutes for the saved activity ID and service date 2026-10-25.
- Account 2 approves 90 minutes. Approval automatically issues a Valid record.
- Account 3 loads history and sees claimed and approved durations separately.
- Account 4, or a browser without a connected wallet, verifies the issued record ID.

**Browser sequence:** My service, Submit claim transaction, Organization, Load organization history, Approve and issue record, My service history, Public verification.

**Layout:** Full browser view with brief step labels. Show an actual MetaMask approval and a successful receipt or Etherscan transaction link. Record the real claim and record IDs.

**Demo note:** These values describe the planned demo, not a previously recorded result. Use IDs returned by the current deployment. Skip rejection and negative tests in this short video.

**Transition:** Introduce a duration adjustment to demonstrate how the record retains its history.

### Slide 9: Demo: correction and revocation

**Key points**

- Account 2 corrects the valid record to 100 minutes using reason `Demo correction`.
- The original becomes Corrected. Follow its link to the new Valid replacement.
- Account 2 revokes the replacement with reason `Demo revocation`, then the public verifier checks its Revoked status.
- Both records remain readable. The original claim remains Approved.

**Layout:** Show the actual original and replacement IDs with status labels alongside the live lookup. Refresh after each confirmation.

**Demo note:** Correction and revocation are real Sepolia transactions. Never present local-wallet captures as Sepolia evidence or replace waiting states with invented successes.

**Transition:** Present the broader checks supporting the workflow.

### Slide 10: Testing and observed results

**Key points**

| Verification | Result | Environment and evidence |
|---|---|---|
| Automated suite | 15 tests passed | Local EVM and domain/helper tests |
| Browser integration | 14 successful transactions | Local Ganache chain |
| Public record lookup | Existing records read successfully | Sepolia, without a connected wallet |
| Manual frontend workflow | Reported by the contract developer | Sepolia, separate from the archived local ledger |

- The team reproduced and fixed stale record validity after correction. Subsequent local tests refreshed the visible status after confirmed writes.
- These results do not establish production throughput or a security audit.

**Layout:** One evidence table plus a short defect/fix example. Put evidence filenames and dates in speaker notes.

**Evidence note:** The acceptance report is dated 28 October 2026. The later project report and developer confirmation describe manual Sepolia testing, but the reviewed acceptance folder does not contain that run's transaction ledger. Attach actual receipts and IDs from the final demo before describing its transactions as independently documented.

**Transition:** Explain which responsibilities remain outside the contract.

### Slide 11: Limitations and trust

**Key points**

- Attendance and identity depend on organizations' checks. Wallet signatures establish account actions.
- Administrator recognition is centralized. Compromised administrator or issuer keys can authorize harmful actions.
- Wallet-linked history is public. Keep personal details off-chain.
- RPC and metadata outages affect access. Larger deployments need more efficient history retrieval.

**Layout:** Four short rows naming each limitation and its practical effect. Explain that a content hash checks integrity without encrypting data or proving truth.

**Transition:** Close with the implemented contribution and focused next steps.

### Slide 12: Project outcome and next steps

**Key points**

- The prototype supports organization-approved records with independently readable status and visible correction/revocation history.
- Four workspaces cover the eight agreed features.
- Proposed improvements: stronger issuer-recognition governance, more resilient metadata/RPC access, and history retrieval for larger datasets. Mark these as future work.
- Include a confirmed demo/repository link and brief, accurate team-role credits. Invite questions if the presentation format allows.

**Layout:** One outcome statement, a small next-steps list, and a readable verified URL. Use only actual names and contributions.

## 3. Design for the whole presentation

### Color scheme

Use the DApp's green and warm neutral palette to connect the slides visually with the browser demo.

| Role | Color | Use |
|---|---|---|
| Main text | `#20352E` deep green | Titles and body |
| Accent | `#2C6655` forest green | Important terms and diagram paths |
| Background | `#F6F5EF` warm ivory | Main slide canvas |
| Secondary text | `#627269` muted green-gray | Supporting labels |
| Divider | `#DCE1D8` pale neutral | Table rules and separators |
| Caution | `#B38A37` ochre | Correction/caution emphasis |
| Revoked | `#873E2B` rust | Revoked status with a text label |

Keep dark text on light backgrounds and check projected contrast. Always pair status colors with words. Avoid decorative gradients and generic cryptocurrency graphics.

### Slide layout

- Use 16:9 widescreen, a consistent title position, and generous margins.
- Give each slide one message and usually three or four short points. Aim below 50 visible words except for the feature and evidence tables.
- Alternate simple text, a scenario, tables, diagrams, and browser-focused demo slides. Favor flat compositions over repeated decorative panels.
- Use genuine captures for product evidence. Label historical images with date and environment. Preserve visible status, IDs, and transaction context when cropping.
- Reveal workflow steps only when it helps the explanation. Avoid decorative animations during transactions.
- Put full hashes, contract addresses, API details, and source references in speaker notes or linked project documentation.

### Font pairings

**Recommended:** Georgia for the opening title and Segoe UI for slide headings, body, and tables. This echoes the application's typography. Use Consolas sparingly for technical values.

- Opening title: 42-48 pt.
- Slide titles: 32-36 pt, Segoe UI Semibold.
- Body: 22-26 pt, Segoe UI.
- Tables: about 20 pt. Shorten wording before shrinking text.
- Source notes: 14-16 pt. Keep essential information in the main readable text.

If Segoe UI is unavailable on the recording machine, use Arial consistently for headings and body. Check font substitution before recording.

## 4. Demo preparation and factual boundaries

- Follow the [Sepolia demo runbook](../test/test_for_demo.md). Use the same deployment and actual returned IDs throughout. Existing deployments may already contain organizations and activities.
- Account 1 must control the deployed administrator. Accounts 1-3 need Sepolia test ETH for their transactions. Reconnect after changing accounts or networks. Public verification needs no wallet signature.
- Check accessible metadata URLs and matching hashes. Label the fictional organization and activity as demonstration data.
- The [README](../README.md) links to `https://phpw0929.github.io/COMP7610/`. Verify the site and intended contract before placing the URL on Slide 12.
- Capture transaction hashes, successful receipts, and resulting IDs from the final Sepolia demonstration. Keep private keys and seed phrases out of recordings.
- Allow transactions to confirm. Shortened recorded waits should preserve action order and be identified when edited. A fallback recording must show its actual environment.
- The report retains older pending statements alongside a later manual Sepolia-test claim. Reconcile dates and evidence before finalizing slides. Treat the snapshot's counts and inactive issuer as historical observations.
- Keep NFT minting, payments, QR sharing, public activity browsing, and total-hour dashboards outside the feature claims.

## 5. Source map

Use these files when preparing the final slide notes. This plan does not establish new test results or course submission completion.

| Slides | Project sources |
|---|---|
| 1-3, 11-12 | [Report draft](project_report_draft.md), particularly Background, Idea and blockchain rationale, and Limitations |
| 4-5 | [Product scope](../doc/plan.md), [contract interface](../doc/handoff/frontend_handoff.md), [Solidity source](../dapp/contracts/VolunteerHoursRegistry.sol) |
| 6 | [React UI](../dapp/src/App.jsx), [registry hook](../dapp/src/useRegistry.js), [metadata utilities](../dapp/src/utils.js) |
| 7-9 | [Demo runbook](../test/test_for_demo.md) and the actual final demo's receipts |
| 10 | [Browser acceptance](../test/acceptance/browser_acceptance.md), [test log](../test/acceptance/automated-tests.log), [local browser ledger](../test/acceptance/local-browser-ledger.json), [dated Sepolia snapshot](../test/acceptance/sepolia-proof.json) |
| Design and timing | [App stylesheet](../dapp/src/styles.css), [execution plan](../doc/execution_plan.md), [course brief](../doc/course%20material/Final%20Project.pdf) |

The existing [architecture artwork](figures/architecture.svg) can inform Slide 6 after its labels are checked against the final setup.
