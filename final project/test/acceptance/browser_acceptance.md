# Browser and integration acceptance

Executed 2026-10-28 in Chrome using ordinary UI actions. Baseline: existing contract/ABI from `21ad35e`, plus this delivery working tree. User confirmed the friend owns contracts/deployment and this work owns the frontend. Full source revision is frozen in submission_manifest after local commit.

## Environment separation

- Sepolia: chain 11155111, existing contract `0xf1a55E316439a99Cd904E131e0f889E4D36D7DEe`, no wallet signature submitted in this session. Public getters and browser record lookup succeeded. Existing example.org metadata was inaccessible and correctly marked unverified.
- Local UI integration: real Solidity contract on Ganache chain 31337, contract `0x97D06951801e25f4BeD9c0F718B185C8ed9400d8`; a loopback-only development wallet harness, separate from production. 14 real successful local transactions, 3 claims, 5 records; details/receipts in local-browser-ledger.json.
- Automated tests: fresh independent Ganache instance, same source compiled with Solidity 0.8.34 targeting Shanghai for Ganache compatibility. Original Osaka/Sepolia artifacts unchanged. 15 tests passed; this instance is separate from the UI ledger.
- Clean reproduction: npm ci, npm test and npm run build all passed in a new source directory without existing dependencies/environment files.

## Cases and observed results

| Case | Actual result | Evidence |
| --- | --- | --- |
| T01/T13 install/build | Pass in delivery and clean directory | build.log; clean-reproduction.log |
| T02 public verification | Real Sepolia record 1 read while wallet not connected; Corrected, replacement 2, issuer inactive. Independent non-harness local page read Valid record 5 with no connected wallet. Nonexistent ID 999999 gave Service record not found. | sepolia-record-1.jpg; local-public-valid.jpg; record-not-found.jpg |
| T03 permissions/account changes | Switched local roles, cleared old wallet permissions, reconnected; plain volunteer/unauthorized account had no Administration access. | local-unauthorized-ui.jpg; local-browser-ledger.json |
| T04 metadata | Local organization/activity exact-byte hashes verified in actual UI. Legacy Sepolia URLs failed and displayed unverified metadata. Hash mismatch, invalid UTF-8/JSON/schema, HTTP failure and prohibited URL protocols tested in domain suite. | local-public-valid.jpg; sepolia-record-1.jpg; automated-tests.log |
| T05 main workflow | Administrator registration → issuer activity → volunteer claim 120 → issuer approval 90 → automatic record 1 → public lookup | local-organization-registration.jpg; local-activity-created.jpg; local-claim-submitted.jpg; local-claim-approved.jpg; ledger |
| T06 unauthorized review | Actual Solidity staticCall rejected outsider registration/review; UI prevented unauthorized admin workspace. Static simulation is not a mined failed transaction. | local-contract.json; automated-tests.log; local-unauthorized-ui.jpg |
| T07 review/rejection | Claim 2 Rejected without a record. Claimed 120 vs approved 90 remained distinct; repeated review failed in contract tests. | local-claim-rejected.jpg; ledger; automated-tests.log |
| T08 history | Record 1 → 2 → 3 retained links; record 3 revoked. Later admin correction linked record 4 → 5. Public page refreshed after confirmed write. | local-status-refresh-fixed.jpg; local-admin-correction.jpg; ledger |
| T09 lifecycle | Closed activity 1, then approved existing pending claim 3. Deactivated issuer; local record 4 stayed valid until admin correction; record 5 remained Valid despite inactive issuer. Inactive issuer UI blocked new activity actions. | local-closed-activity-pending-approved.jpg; local-inactive-organization.jpg; local-public-valid.jpg; ledger |
| T10 boundaries | Positive integer/uint limits, UTC leap day/invalid date, positive duration, service window/future date and nonzero reason/metadata rules passed automated tests. | automated-tests.log |
| T11 transaction behavior | Browser simulated a wallet refusal through EIP-1193 and displayed no fake success; successful writes waited for actual receipts. Submission locking and pending/failed/replaced handling implemented. Delayed/cancelled pending transactions, every outage combination and live MetaMask signing on Sepolia not fully exercised. | local-wallet-declined.jpg; source hook; remaining partial cases explicitly open |
| T12 responsive | 390×844 viewport: document width 390, viewport width 390, no horizontal overflow; temporary viewport reset. Visible labels/focus styles implemented. Full assistive-technology audit not claimed. | mobile-390.jpg |
| T14 coursework files | Draft PDF and English narrated evidence video prepared. Team identities, final signed Sepolia live demo, latest Moodle requirements and all submission receipts remain pending. | submission/ and integration_status |

The local browser's inspected JavaScript error log was empty. Sepolia legacy metadata failures are intentional visible unavailability, not an asserted metadata pass. No runtime benchmark or comprehensive security certification is claimed.

## Defects found and fixed

### B01 stale record validity after correction

Severity: P1 for verification correctness. Reproduced twice on records 1 and 2 before fixing.

1. Verify a Valid record in Public verification.
2. Open Organization and issue a correction for that same record; wait for receipt.
3. Return to Public verification. The previous UI kept cached Valid without the new replacement link.

Before: issue-stale-record-before-fix.jpg and issue-stale-record-reproduced.jpg. Captured screencast frames are retained under recording/; their idle gaps may be shortened in a derived repro video. Fix: refetch the previously verified ID on confirmed writes, invalidate outdated requests, show lookup time and explicit Refresh record. Regression: revoked record 3 automatically became Revoked on the public page after its write confirmed. Evidence: local-status-refresh-fixed.jpg.

### B02 local-only explorer links

Local test mode initially linked addresses/hashes to nonexistent explorer pages. Production Sepolia links were correct. Fix: display local hashes and addresses as text; preserve real Etherscan links in production. The local test harness has no block explorer and is not presented as one.

### B03 inactive permission mislabeled as waiting

Inactive organization buttons were disabled through the busy flag and displayed Waiting indefinitely. Fix: separate permission-disabled from operation-busy state. Inactive organizations now retain normal action labels with disabled controls; explanatory text states why actions are unavailable.

## Open acceptance boundaries

T11 remains partial. Fresh signed Sepolia UI writes are not done because the controlling wallets are not available here. Public metadata files are supplied locally but have not been published into a new Sepolia activity. Moodle navigation timed out; no course platform state or submission receipt was confirmed. These are recorded limits, not hidden passes.


## Production preview smoke test

The production build served at 127.0.0.1:5185 loaded without the development wallet harness and read actual Sepolia record 2 as Revoked with no connected wallet. The current lookup time and record fields were visible. See production-browser.json, production-sepolia.jpg and production-viewport.jpg; unavailable legacy metadata remains distinct from on-chain status.
