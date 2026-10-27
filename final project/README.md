# Volunteer Service-Hour Verification DApp

This DApp lets recognized service organizations approve volunteer service hours and lets volunteers and third parties verify the resulting records on the Sepolia testnet.

## Main workflow

1. The administrator registers an organization.
2. The organization creates an activity.
3. A volunteer submits a service-hour claim.
4. The organization approves or rejects the claim.
5. Approval creates a verified service record.
6. A volunteer or verifier reads the record by its ID.
7. The organization or administrator can revoke or correct a record while preserving its history.

## Roles

- **Administrator:** registers and deactivates organizations.
- **Organization:** creates activities, reviews claims, and manages issued records.
- **Volunteer:** submits claims and views personal history.
- **Verifier:** reads public records without sending a transaction.

## Contract

- Contract: `VolunteerHoursRegistry`
- Network: Sepolia
- Chain ID: `0xaa36a7`
- Deployed address: `0xf1a55E316439a99Cd904E131e0f889E4D36D7DEe`
- Explorer: [Sepolia Etherscan](https://sepolia.etherscan.io/address/0xf1a55E316439a99Cd904E131e0f889E4D36D7DEe)
- ABI: [`dapp/artifacts/VolunteerHoursRegistry.json`](dapp/artifacts/VolunteerHoursRegistry.json)
- Frontend function reference: [`handoff/frontend_handoff.md`](handoff/frontend_handoff.md)

Durations use whole minutes. Dates use Unix timestamps in seconds. Claim statuses are `Pending`, `Approved`, and `Rejected`. Record statuses are `Valid`, `Revoked`, and `Corrected`.

## Run the frontend

From the `dapp` folder:

```powershell
npm install
npm run dev
```

Create `dapp/.env` locally:

```env
VITE_CONTRACT_ADDRESS=0xf1a55E316439a99Cd904E131e0f889E4D36D7DEe
VITE_CHAIN_ID=0xaa36a7
VITE_EXPLORER_URL=https://sepolia.etherscan.io
```

The `.env` file is local and ignored by Git. Use `.env.example` as the template. Never store private keys or seed phrases in frontend files.

## Test the contract

The contract can be tested in Remix with four Sepolia accounts:

- Account 1: administrator and deployer
- Account 2: recognized organization
- Account 3: volunteer
- Account 4: verifier or unauthorized tester

Detailed test steps and expected results are in [`test/test_procedure.md`](test/test_procedure.md). The feature checklist is in [`test/test_overview.md`](test/test_overview.md).

## Project folders

```text
dapp/       Solidity contract, ABI artifacts, and React/Vite frontend
doc/        Project plan, guide, and coursework references
handoff/    Frontend integration summary for the team
test/       Contract test procedure and feature checklist
```

Personal information should remain off-chain. The blockchain records wallet addresses, activity data, claims, service records, statuses, and hashes. A hash verifies matching content; it does not prove that the underlying real-world information is true.
