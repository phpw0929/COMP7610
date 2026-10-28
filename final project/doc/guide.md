# DApp Folder and Implementation Guide

Updated: 2026-10-28. The VolunteerHoursRegistry contract and integration ABI exist. The business frontend is implemented and builds successfully; local-EVM acceptance and real Sepolia reads have passed. Final signed testnet acceptance remains pending. This guide describes the current source and planned additions; it does not certify deployment or completion.

## 1. Current and planned files

Paths below are relative to `final project/`. `planned` entries do not exist yet.

```text
AGENTS.md                         Project workflow rules
README.md                         Current status and setup
.codex/context.md                 Scope and latest handoff context
doc/
  plan.md                         Product definition and eight-feature scope
  execution_plan.md               Stages G0-G7, tests T01-T14, delivery plan
  plan_review_2026-10-28.md        Feasibility and course-requirements review
  guide.md                        This guide
  Final Project.pdf               Formal coursework brief
  Project Tutorial.pdf            Technical tutorial
  DApp_idea.xlsx                  Earlier idea comparison
handoff/
  frontend_handoff.md             Contract function and data reference
  integration_status.md           Real dependencies, milestones and evidence
  merge_protocol.md               Contract/frontend ownership and safe integration
  repository_review_2026-10-28.md  Initial repository inspection snapshot
test/
  test_overview.md                 Historical manual coverage table
  test_procedure.md                Remix test procedure and expected values
  acceptance/                     Actual local/testnet-read evidence and browser report
dapp/
  contracts/VolunteerHoursRegistry.sol
  artifacts/                      Tracked ABI, metadata and build-info
  src/
    contract.js                   Current ABI, address and network constants
    App.jsx                       Implemented workspaces, forms, history and verification
    useRegistry.js                Provider, wallet/session and transaction lifecycle
    main.jsx                      React mount entry
    styles.css                    Responsive presentation and form styles
    components/                   optional; not needed in this implementation
    utils.js                      Shared validated dates, integers, metadata and query helpers
  public/metadata/                Explicitly fictional demo JSON assets
  index.html                      Loads the implemented main.jsx
  package.json                    React/Vite/Ethers; build/dev/preview and development tests
  package-lock.json               Locked dependency installation
  .env.example                    Public configuration template
  .gitignore                      Local/generated exclusions
submission/                       Report/video drafts, build scripts and manifest
```

The repository-wide document index is `../DOCUMENT_INDEX.md`. Keep it synchronized whenever a document is added, moved or updated. Source files under `assignment 3/` are a separate assignment, not contracts or assets to copy into this DApp.

## 2. Runtime relationships

`index.html -> main.jsx -> App.jsx -> feature components` is the React entry path. The entry and business flow have been repaired. The former NFT placeholders and mint flow are removed. A development-only local EIP-1193 harness under dapp/test is excluded from the production build.

The planned Web3 paths are:

- Read: React -> Ethers JsonRpcProvider -> Sepolia, without requesting a wallet signature.
- Write: React -> MetaMask/BrowserProvider -> current signer -> existing contract -> transaction receipt/event -> refresh affected state.
- Metadata: React -> actual public JSON bytes -> compare keccak256 with the on-chain hash -> display verified content or an explicit failure state.

The contract enforces permissions and state transitions. UI role checks improve usability but cannot replace authorization on-chain. One wallet can have multiple roles.

## 3. Configuration and prerequisites

Use the lockfile with `npm ci`. Vite 7 requires Node 20.19+ or 22.12+; Node 24.19.0 was used for the initial inspection. The local default Node 20.11.0 does not satisfy that range.

Existing `.env.example` lists address, chain ID/name, explorer and `VITE_READ_RPC_URL`. Public defaults support the observed Sepolia deployment without a local .env. Use .env only to override the final deployment or public endpoint. All VITE variables are public browser configuration. Do not put secrets there.

The Sepolia network/address/getters have been read from the RPC and browser; the snapshot is in test/acceptance/sepolia-proof.json. The local ABI matches the artifact ABI; build-info source matches the Solidity source. Executable bytecode also matches after excluding immutable slots and compiler metadata, whose full hash differs. This does not recover the deployment transaction or constitute explorer source verification. Artifacts record Solidity 0.8.34, EVM osaka, optimizer disabled; the actual deployment transaction/settings remain to be confirmed.

## 4. Development order and responsibility

Use execution_plan as the single detailed plan: G0 integration prerequisites, G1 runnable shell, G2 read/identity, G3 main workflow, G4 remaining state transitions, G5 acceptance, G6 report/video, G7 final submission. Register actual progress in integration_status. Do not duplicate progress claims in this guide.

Frontend work normally changes App, entry, styles, feature components and small shared helpers. Preserve the existing contract/ABI unless a confirmed defect requires coordinated contract repair and redeployment. Reuse current dependencies; no database, indexer, token or payment system is needed for the agreed demo.

Do not create an additional nested Git repository under dapp. The team repository is phpw0929/COMP7610; use simple scoped changes and preserve existing work. Commits/pushes are separate authorized actions, not a consequence of updating this guide.

## 5. Generated files and delivery

`node_modules`, Vite caches and build output are generated locally. `.env` is created locally, not generated by Vite. Exclude these from the source submission; retain package-lock and required tracked ABI/build information. Check existing ignore rules before adding new generated or evidence files, because artifacts are globally ignored even though existing artifact files are already tracked.

Final delivery includes runnable source and detailed README, a PDF report, and an English high-resolution MP4/MOV demo within 15 minutes. Slides are conditional; individual Peer assignment 04 is separate. Report PDF and English narrated evidence video drafts now exist; final team contribution information and signed Sepolia live-demo footage remain outstanding. See the requirements review and confirm the live course portal before submitting.


## 6. Test and media tooling

Ganache and solc are development-only dependencies for real local-EVM tests; runtime dependencies are unchanged. dapp/scripts/local-chain.mjs deploys unchanged source to an ephemeral local chain and writes ignored test state; npm run dev:local exposes the explicitly labeled test harness on port 5184. Test outputs are not proof of new Sepolia signing.

submission/build_report.py uses Python/reportlab to regenerate the delivered PDF. build_demo.py uses macOS say and FFmpeg to build the narrated captured-screen draft; playback is portable, but regeneration requires those tools. Temporary render/media folders are ignored. Complete commands, test results and team handoff are in README and merge_protocol.
