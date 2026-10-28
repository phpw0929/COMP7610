# Volunteer Service-Hour Verification DApp

An organization reviews volunteer service claims and issues verifiable records. Corrections and revocations preserve history. The app uses React, Vite, Ethers and the existing VolunteerHoursRegistry Solidity contract.

## Current delivery status

Updated 28 October 2026. The frontend implements all eight agreed MVP functions. A clean installation passed **15 automated tests** and the production build. Ordinary browser operation completed **14 successful transactions on a local EVM**, including the entire claim, approval, correction, rejection and lifecycle workflow. Wallet-free **real Sepolia reads** also succeeded.

These are separate evidence scopes. No new Sepolia wallet transaction was signed in this session. Member identities, the contract owner's deployment transaction, published demo metadata, a fresh signed Sepolia UI demonstration and live course-platform submission remain outstanding. The supplied report and English video are clearly marked **drafts**.

- [Document index](../DOCUMENT_INDEX.md)
- [Product scope](doc/plan.md) and [execution plan](doc/execution_plan.md)
- [Acceptance results](test/acceptance/browser_acceptance.md), [integration status](handoff/integration_status.md)
- [Contract interface](handoff/frontend_handoff.md) and [two-person merge protocol](handoff/merge_protocol.md)
- [Code handoff](handoff/frontend_code_handoff.md): run, maintain, integrate and accept the frontend
- [Report source](submission/project_report_draft.md), PDF draft and video assets under `submission/`

## Run

Use **Node 24** (tested with 24.19.0). Vite 7 accepts Node `^20.19.0 || >=22.12.0`; this machine's older default 20.11.0 is insufficient. From `final project/dapp`:

```sh
npm ci
npm run dev
```

Open the URL printed by Vite. Defaults already point to the observed Sepolia deployment and a public read-only RPC. No wallet is needed to verify a record. Optional overrides can be set by copying `.env.example` to `.env` before starting Vite:

```env
VITE_CONTRACT_ADDRESS=0xf1a55E316439a99Cd904E131e0f889E4D36D7DEe
VITE_CHAIN_ID=0xaa36a7
VITE_NETWORK_NAME=Sepolia
VITE_EXPLORER_URL=https://sepolia.etherscan.io
VITE_READ_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
```

All VITE variables are public browser configuration. Never put private keys, seed phrases or server secrets here. If an RPC fails, replace the endpoint with one supporting the intended network and browser CORS, then restart/rebuild. A failed RPC means unavailable verification, not an invalid record.

Production build and local preview:

```sh
npm run build
npm run preview
```

If hosting under a subpath, set the Vite base during build, e.g. `npm run build -- --base=/COMP7610/`. Verify the final origin's RPC/CORS and metadata access. Public website hosting is optional for the course; the required source must be runnable.

## Use the workspaces

1. **Public verification:** enter record ID, read on-chain status, issuer, volunteer, minutes/date and linked replacements. Check last lookup time or use Refresh record. Unverified metadata does not hide independently read facts.
2. **My service:** connect MetaMask, switch to Sepolia, inspect an activity ID, submit whole minutes and a UTC service date, then load personal claims and records.
3. **Organization:** an active registered issuer creates activities, loads its activity/claim history, approves or rejects pending claims and manages valid records. Approval automatically issues a record. Inactive issuers retain history access but cannot perform new actions.
4. **Administration:** only the actual administrator registers/activates/deactivates organizations and handles exceptional record correction/revocation.

The wallet may have multiple roles. UI checks do not replace contract authorization. Account/network changes invalidate previous permissions. Every write requires the wallet holder's signature and test ETH for gas; the app has no production role selector, embedded private key, fake record fallback, NFT mint or payment flow.

Minutes are positive uint32 integers. IDs retain bigint precision. Dates are Unix seconds mapped from UTC date-only inputs. Claimed and approved durations remain separate. A claim can remain Approved while an associated record is Corrected/Revoked.

## Metadata

`dapp/public/metadata/organization-demo.json` and `activity-demo.json` are explicitly fictional demo assets. Publish their exact bytes at accessible HTTPS URLs (a pinned public-repository raw URL is suitable), then supply those URLs in the registration/activity forms. The form validates schema and calculates keccak256 from the downloaded bytes. Reads compare exact bytes to the on-chain hash, without reserializing JSON.

Organization schema: `schemaVersion:1`, `type:"organization"`, nonempty `name` and `description`. Activity schema: `schemaVersion:1`, `type:"activity"`, nonempty `title`, `description`, `location`. Category/date windows are authoritative contract fields. A public URL alone does not prove truth or integrity. Hashes are not encryption.

The legacy Sepolia records use example.org placeholder metadata, so the UI correctly marks it unavailable/unverified. These historic objects are not silently relabeled with the new demo assets.

## Automated and local UI tests

```sh
npm test
```

The suite executes real Solidity on a fresh Ganache chain and tests input/date/hash/query behavior. Ganache and solc are **development-only** dependencies; the production dependency set remains React, React DOM and Ethers. On Node 24, Ganache can warn that its native uWS binding is unavailable and use a JavaScript fallback; the verified suite still passes. Latest automatic run evidence is local under ignored `.local-test/`; archived acceptance evidence is under `test/acceptance/`.

For the explicit local UI harness, use two terminals:

```sh
# Terminal 1: compiles/deploys unchanged source and creates ephemeral local test wallets
npm run test:local

# Terminal 2: reads the generated local-test environment
npm run dev:local
```

Open **http://127.0.0.1:5184/test/wallet.html**. The yellow toolbar/banner clearly identifies local EVM chain 31337. Select a local test role and reconnect after changing it. Use local metadata URLs such as `http://127.0.0.1:5184/metadata/organization-demo.json`; loopback HTTP is accepted only in local-test mode. The harness supports simulated wallet refusal. No personal wallet keys are used. The normal production build excludes the harness.

The local compiler uses Solidity 0.8.34 with Shanghai target for Ganache compatibility. Existing Sepolia artifacts use Osaka and are not overwritten. Restarting the local chain generates fresh wallets/address/IDs; start the frontend only after the chain script writes its state/environment. Stop the local services with Ctrl+C. Test helpers are not a substitute for the final Sepolia live demonstration.

Original Remix procedure: [test_procedure.md](test/test_procedure.md). [Historical coverage marks](test/test_overview.md) remain distinct from the new [actual acceptance results](test/acceptance/browser_acceptance.md). T11 delayed/cancelled transactions and every provider outage combination are not fully exercised; lint/typecheck tools are not configured.

## Sepolia deployment snapshot

- Chain: `11155111` / `0xaa36a7`
- Address: `0xf1a55E316439a99Cd904E131e0f889E4D36D7DEe`
- [Explorer](https://sepolia.etherscan.io/address/0xf1a55E316439a99Cd904E131e0f889E4D36D7DEe)
- ABI: `dapp/artifacts/VolunteerHoursRegistry.json` and matching `src/contract.js`
- Observed administrator: `0xb3B9ABeF11709509E6cd2424f9A9f744394adc25`
- Observed issuer: `0xff4e2bAA091080a9b45E3d66D6816FEd65e94599`, inactive
- Snapshot: one activity, three claims, four records, historic records corrected/revoked; see `test/acceptance/sepolia-proof.json` for block/time and exact fields.

Executable runtime matches the artifact excluding immutable ranges and compiler metadata; the compiler metadata hash differs. Deployment tx/source verification are not claimed. Historical log retrieval encountered pruned history on the public RPC. Run `node scripts/read-sepolia.mjs` from dapp to refresh the read-only snapshot; it never signs a transaction.

The contract teammate must provide final deployment provenance and controllable demo roles. They can reactivate the issuer and create a new activity or supply a new deployment. Do not assume old activity/record ID 1 is usable for the successful workflow. Do not share private keys.

## Delivery and remaining coursework

`submission/` contains the English report Markdown, editable Word and its matching 7-page A4 PDF draft, a captured-screen walkthrough with Karen female narration at 145 words/minute (about 247 seconds), media probes/build scripts and manifest. [Frontend code handoff](handoff/frontend_code_handoff.md) explains setup, source entry points, business invariants, contract integration, merging and remaining final acceptance. The video is 1920×1080 output; source browser captures retain their original detail and are visibly marked as draft evidence. It is not the final signed testnet live-demo recording. Member names/IDs and real contribution attribution are deliberately left for the team.

Final course delivery still needs the signed testnet demonstration, final report/contribution table, any slides actually made, detailed runnable source, latest portal checks and submission receipts. Each student separately completes Peer assignment 04. The original PDF lists November 8 at 23:59, but live course pages could not be verified here. No course submission occurred.
