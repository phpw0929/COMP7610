# Volunteer Service-Hour Verification DApp

This DApp helps recognized organizations approve volunteer service hours and issue records that anyone can verify on the Sepolia testnet. It keeps the approval history visible, including later corrections and revocations. Preview the DApp [here](https://volunteer-service-hour-verification.pages.dev/).

The blockchain records wallet actions and service details. It does not independently prove that attendance happened, and a wallet is not legal identity verification.

## Project structure

```text
final project/
├── dapp/
│   ├── artifacts/
│   ├── contracts/
│   ├── public/
│   │   └── metadata/
│   ├── scripts/
│   ├── src/
│   └── test/
├── doc/
├── handoff/
├── submission/
│   └── figures/
├── test/
│   └── acceptance/
│       └── recording/
├── AGENTS.md
└── README.md
```

- `dapp/` contains the Solidity contract, compiled contract data, React frontend, local-chain scripts, and frontend tests.
- `dapp/public/metadata/` contains the fictional organization and activity JSON used by the demo.
- `doc/` contains the product plan, implementation plan, guide, and coursework references.
- `handoff/` contains frontend integration and contract-use notes for the team.
- `submission/` contains draft report, figures, media, and delivery materials.
- `test/acceptance/` contains browser-acceptance evidence and test records.

## Setup

### Development run

Install Node.js 24 or another version accepted by the project, then run these commands from `final project/dapp`:

```powershell
npm ci
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

The frontend reads the configured Sepolia contract. Public verification does not need a wallet. Connecting MetaMask is required for actions that change blockchain state. Use Sepolia and keep private keys and seed phrases out of all frontend files.

### Production preview

Build and preview the optimized frontend with:

```powershell
npm run build
npm run preview
```

`npm run build` creates the production files in `dapp/dist/`. `npm run preview` serves those files locally. This previews the website; it does not deploy the contract or publish the site.

## Usage

The app has four workspaces. Select a tab, then connect MetaMask when the workspace asks for a wallet.

| Tab                     | Supported Features                                                                                        | What it does                                                                                                                                                       |
| ----------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Public verification** | <ul><li>Publicly verify an individual record</li></ul>                                                                     | Enter a record ID to read its issuer, volunteer wallet, activity, minutes, date, current status, and correction links. No wallet or transaction is required.       |
| **My service**          | <ul><li>Submit a service-hour claim;</li> <li>view volunteer history</li></ul>                                                       | Inspect an activity, submit completed minutes, and load your claims and issued records.                                                                            |
| **Organization**        | <ul><li>Create an activity;</li> <li>approve or reject claims;</li> <li>create verified records;</li> <li>manage corrections and revocations</li></ul> | An active registered organization publishes activities, reviews claims, and corrects or revokes its own records. Approval automatically creates a verified record. |
| **Administration**      | <ul><li>Register and manage recognized organizations</li></ul>                                                              | The administrator registers organization wallets and activates or deactivates them.                                                                                |

### Typical workflow

1. The administrator registers an organization.
2. The organization creates an activity.
3. A volunteer submits a claim for service hour done.
4. The organization approves the claim; approval creates a record.
5. The volunteer loads their history.
6. Anyone can verify the record by ID.
7. The organization can create a linked correction or revoke a valid record without deleting its history.

Every write requires MetaMask approval, Sepolia ETH for gas, and a wallet with the correct role. After changing MetaMask accounts or networks, reconnect the wallet in the app.

Durations use whole minutes. Date fields represent UTC dates. Claim statuses are `Pending`, `Approved`, and `Rejected`. Record statuses are `Valid`, `Revoked`, and `Corrected`.

For contract functions, inputs, outputs, and permissions, see [`handoff/frontend_handoff.md`](handoff/frontend_handoff.md).

## Examples and demos

Example commands:

```powershell
cd "final project/dapp"
npm ci
npm run dev
```

Demo video and screenshots: **to be added**.

For a step-by-step DApp test demo, see `test/test_for_demo.md`.

## Development

### Metadata

The demo metadata files are [`organization-demo.json`](dapp/public/metadata/organization-demo.json) and [`activity-demo.json`](dapp/public/metadata/activity-demo.json). They are fictional and contain no personal data.

Publish the organization and activity JSON details at an accessible HTTPS URLs before using them in the organization or activity forms. The frontend checks the JSON schema and calculates a `keccak256` hash from the downloaded bytes. A URL or hash does not prove that the underlying real-world information is true.

Required JSON fields for organization:

```json
{"schemaVersion":1,"type":"organization","name":"...","description":"..."}
```

Required JSON fields for activity:

```json
{"schemaVersion":1,"type":"activity","title":"...","description":"...","location":"..."}
```

The activity category and date window are stored in the contract. Existing legacy Sepolia records use placeholder `example.org` metadata and may appear as unverified; the app does not replace those old URLs silently.

### Sepolia deployment snapshot

- Chain: `11155111` / `0xaa36a7`
- Contract: `VolunteerHoursRegistry`
- Address: `0x2c5ff98D1a6c68a91769Ab82B37cD9B2faA534E0`
- [Open the contract in Sepolia Etherscan](https://sepolia.etherscan.io/address/0x2c5ff98D1a6c68a91769Ab82B37cD9B2faA534E0)
- ABI: [`dapp/artifacts/VolunteerHoursRegistry.json`](dapp/artifacts/VolunteerHoursRegistry.json) and [`dapp/src/contract.js`](dapp/src/contract.js)
- Observed administrator: `0x4b452a45611EF1CB4Bb4c96324B6677410E85B37`
- Observed issuer: `0x40afC0D58b2fd1f7b5B23C1C66D333d0D9B72ef6`

The snapshot is read-only evidence. It does not replace a fresh signed Sepolia demonstration. Do not assume the old activity or record IDs are suitable for a new demo.

### Test

Run the automated contract and domain tests with:

```powershell
npm test
```

These tests use a fresh local Ganache chain and do not change Sepolia.

For the local browser harness, use two terminals:

```powershell
# Terminal 1: start a fresh local EVM and deploy a temporary contract
npm run test:local

# Terminal 2: start the local test UI
npm run dev:local
```

Open `http://127.0.0.1:5184/test/wallet.html`. The harness provides temporary Administrator, Organization, Volunteer, and Unauthorized roles. It uses local chain `31337`, not Sepolia, and its wallets are discarded when the local chain stops.

The full acceptance evidence is in [`test/acceptance/browser_acceptance.md`](test/acceptance/browser_acceptance.md). The original Remix procedure is in [`test/test_procedure.md`](test/test_procedure.md).

### Current stage and remaining

The frontend implements the eight agreed MVP functions. A clean installation passed 15 automated tests and the production build. Local browser testing completed the claim, approval, correction, rejection, and lifecycle workflows. Wallet-free Sepolia reads also succeeded.

These results cover different environments. The remaining work is to:

- prepare a fresh signed Sepolia UI demonstration with controllable demo wallets;
- publish accessible demo metadata;
- confirm final deployment provenance and team identities/contributions;
- update the report and video from draft to final;
- verify current course-platform requirements and record submission receipts.

The report, video, and delivery files are under [`submission/`](submission/). The frontend integration notes are in [`handoff/frontend_code_handoff.md`](handoff/frontend_code_handoff.md). Product scope is documented in [`doc/plan.md`](doc/plan.md).
