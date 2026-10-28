# Delivery artifacts and finalization

Updated 28 October 2026. These are reviewable development artifacts, not a confirmed course submission.

| File | Purpose and status |
| --- | --- |
| project_report_draft.md | English content source; final identities, contribution attribution and signed Sepolia UI evidence pending |
| project_report_draft.docx | Editable academic report: A4, Times New Roman 12 pt body, 1.5 spacing, cover, black headings, numbered body pages, architecture and test table |
| project_report_draft.pdf | PDF exported from the same Word document; 7 pages including the cover, all pages visually checked |
| figures/architecture.svg and .png | Editable diagram source and high-resolution embedded figure |
| build_report.py | Generates Word from Markdown using Python/python-docx and the checked-in figure; then export Word to PDF |
| demo_script.md | English narration distinguishing local writes from actual Sepolia reads |
| demo_walkthrough_draft.mp4 | 1920×1080 H.264/AAC, about 247 seconds; Karen female voice at 145 words/minute with a softer mix; captured-screen evidence draft |
| build_demo.py | Rebuilds with macOS say, FFmpeg and ffprobe; defaults can be overridden with --voice and --rate |
| demo_media_probe.json | Actual media probe plus the narration preset and mix settings |
| audio_check.log and media_decode.log | Audio level measurement and complete decode check |
| document_media_qa.md | This revision's layout, media checks and reproducibility boundaries |
| browser-regression-repro.mp4 | Pre-fix stale-status defect, using 29 real screencast frames; idle gaps capped at 8 seconds |
| build_delivery.py | Builds cumulative binary Git patch, full ZIP and version/checksum receipt after a clean commit |
| submission_manifest.md | Frontend fingerprint, file checksums, evidence limits and final dependencies |
| ../handoff/frontend_code_handoff.md | Code entry points, setup, business invariants, integration and final acceptance handoff |

## Report maintenance

From this directory, run `python3 build_report.py` with Python/python-docx installed. Its input is `project_report_draft.md`, and the diagram is `figures/architecture.png`. Edit the SVG and render a matching PNG if the architecture changes. The checked-in PNG requires no image library to use in Word.

Export `project_report_draft.docx` to PDF with Word or LibreOffice and inspect every page. In this revision, the documents skill's `render_docx.py --emit_pdf` used the bundled headless LibreOffice and rendered page images for QA. Copy the inspected PDF to `project_report_draft.pdf`; the PDF and DOCX must remain the same revision. Do not maintain a second PDF layout independently of Word.

No course-specific report template was provided in the repository. A4, 25.4 mm margins and 12 pt Times New Roman with 1.5 spacing are the chosen formal draft layout, not a claim that the course mandates these settings. The cover identifies missing team details. References have numbered entries and in-text markers. The editable Word and PDF both retain the draft and pending-evidence status.

## Voice and media maintenance

On macOS with Karen installed, run `python3 build_demo.py`. The English script and actual screenshot inputs stay the same; default narration is Karen at 145 words/minute. The audio mix softens upper frequencies and uses light compression with a -18 LUFS / -2 dBTP target. Voice timbre is subjective: the encoding and levels were measured, while the final preference is heard by playing the artifact.

Recheck output with ffprobe and a complete FFmpeg decode. `demo_media_probe.json` records the selected voice, pace and actual duration. Keep DRAFT captions, local test banners and the distinction between local writes and Sepolia reads. Regenerate `audio_check.log` and `media_decode.log` for the final MP4; update the manifest, index and status docs.

## Packaging and remaining work

From the repository root, commit intended changes, ensure `git status --short` is empty, then run `python3 'final project/submission/build_delivery.py'`. It packages tracked source plus both videos and a cumulative patch from `21ad35e` to HEAD. ZIP/patch/media and generated receipts are ignored by Git. The external receipt includes the archive SHA256; the inner receipt omits its own outer ZIP digest to avoid self-reference.

The full ZIP contains no `.git`, node_modules, dist, private `.env` or ephemeral test-wallet files. Source fingerprints exclude generated content. Keep original browser JPEGs and screencast frames for provenance; no fake screenshots were generated.

Before final submission: integrate the friend's final contract/deployment, publish accessible demo metadata, sign a fresh Sepolia UI workflow with dedicated demo wallets/test ETH, provide real team contributions, verify Moodle requirements and regenerate the final report/video. Record the group submission receipt and each person's Peer assignment 04 completion. The existing local EVM execution and testnet reads do not constitute new signed Sepolia transactions.
