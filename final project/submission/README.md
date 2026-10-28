# Delivery artifacts and finalization

Updated 28 October 2026. These artifacts are a reviewable development delivery, not a confirmed course submission.

| File | Purpose and status |
| --- | --- |
| project_report_draft.md | Editable English report source; identities/contribution attribution and final testnet wallet evidence pending |
| project_report_draft.pdf | Generated 4-page report draft; all rendered pages visually inspected |
| build_report.py | Regenerates PDF with Python/reportlab; local Arial font when available, otherwise Helvetica |
| demo_script.md | Complete English narration, with explicit separation of local writes and Sepolia reads |
| demo_walkthrough_draft.mp4 | 1920×1080 English synthesized-narration captured-screen review, about 220 seconds; not final live testnet demo |
| build_demo.py | Rebuilds review video with macOS say and FFmpeg; inputs are actual captured browser JPEGs |
| demo_media_probe.json | Actual media stream/format/duration probe |
| browser-regression-repro.mp4 | Repeated stale-status defect before its fix, assembled from 29 real screencast frames; idle gaps capped at 8 seconds |
| submission_manifest.md | Source version, files, evidence boundaries, checksums and remaining submission dependencies |

The videos and generated ZIP/patch are separate local delivery artifacts and are ignored by Git to avoid embedding delivery media in source history. The full delivery ZIP includes the videos. Keep the original acceptance JPEGs and screencast frames for provenance; no fake record imagery was generated.

Production source does not contain the test wallet harness. The local harness executes real Solidity on chain 31337 and does not sign a Sepolia transaction. The existing Sepolia contract was read from the actual browser/RPC, and inaccessible metadata remains labeled unverified.

Before final submission: integrate the friend's final contract/deployment, publish accessible metadata, sign a new Sepolia UI workflow with dedicated demo wallets/test ETH, provide all real team contributions, verify Moodle requirements and update the final report/video. Record the group submission receipt and each person's Peer assignment 04 completion. No private keys are requested or included.
