# Positive Sepolia Demo Test

This runbook uses four fresh MetaMask accounts and one newly deployed contract. It covers the main positive workflow. It deliberately skips claim rejection and all negative tests.

## Accounts

| Account | Demo role | Use |
|---|---|---|
| Account 1 | Administrator | Deploys the contract and registers the organization |
| Account 2 | Organization | Creates activities, approves claims, corrects and revokes records |
| Account 3 | Volunteer | Submits claims and views personal history |
| Account 4 | Verifier | Reads a public record |

Use Sepolia for every account. Accounts 1, 2, and 3 need Sepolia ETH for transactions. Account 4 only reads data and does not need ETH.

## Prepare before Step 0

Prepare these items before deploying:

1. Four fresh MetaMask accounts on Sepolia. Record the full address of each account:
   - Account 1: administrator/deployer
   - Account 2: organization
   - Account 3: volunteer
   - Account 4: verifier
2. Sepolia test ETH in Accounts 1, 2, and 3. Account 1 pays deployment gas; Account 2 pays organization transactions; Account 3 pays the claim transaction.
3. The contract source file: `dapp/contracts/VolunteerHoursRegistry.sol`.
4. The frontend dependencies installed from the `dapp` folder:

```powershell
npm ci
```

5. Two public HTTPS metadata URLs. Verify each URL in a normal browser before using it. The response must be the exact JSON bytes, without a login page or HTML wrapper:

```text
https://raw.githubusercontent.com/phpw0929/COMP7610/main/final%20project/dapp/public/metadata/organization-demo.json
https://raw.githubusercontent.com/phpw0929/COMP7610/main/final%20project/dapp/public/metadata/activity-demo.json
```

The organization JSON must contain `schemaVersion: 1`, `type: "organization"`, `name`, and `description`. The activity JSON must contain `schemaVersion: 1`, `type: "activity"`, `title`, `description`, and `location`. If the raw URLs are unavailable, publish the exact files at another public HTTPS location and use those replacement URLs.

6. The new contract address is not known until Step 0 is deployed. Do not use the old address in `dapp/.env`; replace it after deployment and restart Vite.

## Before opening the DApp

1. In Remix, connect MetaMask to Sepolia and select **Account 1**.
2. Compile `VolunteerHoursRegistry.sol` with the compiler version used by the deployed source.
3. Deploy `VolunteerHoursRegistry` with no constructor inputs.
4. Copy the deployed address and put it in `dapp/.env`:

```env
VITE_CONTRACT_ADDRESS=0xYourNewContractAddress
VITE_CHAIN_ID=0xaa36a7
VITE_NETWORK_NAME=Sepolia
VITE_EXPLORER_URL=https://sepolia.etherscan.io
VITE_READ_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
```

5. Restart Vite after changing `.env`:

```powershell
npm run dev
```

### Step 0: Save deployment output

**Wallet:** Account 1  
**Inputs:** No constructor inputs.  
**Expected output:** Deployment succeeds; `administrator()` equals Account 1; all four counters are `0`.

**Save:** contract address, deployment transaction hash, Account 1 address, and the DApp URL.

## Step 1: Register the organization

**Wallet:** Account 1  
**UI:** Connect wallet → **Administration** → **Register organization**  
**Inputs:**

| Field                     | Value                                                                                                                                                                      |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Organization wallet       | Account 2 address                                                                                                                                                          |
| Public HTTPS metadata URL | Raw HTTPS URL for `organization-demo.json`<br>i.e., `https://raw.githubusercontent.com/phpw0929/COMP7610/main/final%20project/dapp/public/metadata/organization-demo.json` |

The metadata must be accessible in a browser and must contain the organization demo JSON.

**Expected output:** MetaMask confirms the transaction. The DApp shows `OrganizationRegistered`, organization ID `1`, and active status.

**Save:** Account 2 address and organization ID `1`.

## Step 2: Create an activity

**Wallet:** Switch MetaMask to Account 2, then click **Connect wallet** again.  
**UI:** **Organization** → **Create activity**  
**Inputs:**

| Field                     | Value                                                                                                                                                              |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Public HTTPS metadata URL | Raw HTTPS URL for `activity-demo.json`<br>i.e., `https://raw.githubusercontent.com/phpw0929/COMP7610/main/final%20project/dapp/public/metadata/activity-demo.json` |
| Category                  | `Community service`                                                                                                                                                |
| Start date (UTC)          | `2026-01-01`                                                                                                                                                       |
| End date (UTC)            | `2027-01-01`                                                                                                                                                       |

**Expected output:** MetaMask confirms the transaction. The DApp shows `ActivityCreated`, a new activity ID, and an open activity.

**Save:** Activity ID, normally `1` for a **fresh** deployment.

## Step 3: Submit a service claim

**Wallet:** Switch MetaMask to Account 3, then reconnect.  
**UI:** **My service** → **Submit service claim**  
**Inputs:**

| Field | Value |
|---|---|
| Activity ID | Saved activity ID |
| Minutes served | `120` |
| Service date (UTC) | `2026-10-25` |
| Supporting note | Leave empty or enter a non-sensitive note |

**Expected output:** MetaMask confirms the transaction. The DApp shows `ServiceClaimSubmitted`, a claim ID, and status `Pending`.

**Save:** Claim ID and the transaction hash.

## Step 4: Approve the claim and create a record

**Wallet:** Switch MetaMask to Account 2, then reconnect.  
**UI:** **Organization** → **Load organization history** → find the pending claim → **Approve and issue record**  
**Inputs:**

| Field | Value |
|---|---|
| Approved minutes | `90` |
| Review note | Leave empty or enter a non-sensitive note |

**Expected output:** One transaction emits `ServiceClaimReviewed` and `ServiceRecordIssued`. The claim becomes `Approved`, approved minutes are `90`, and a new record is created with status `Valid`.

**Save:** Record ID and transaction hash. This record ID is the main ID used for public verification.

## Step 5: View volunteer history

**Wallet:** Switch MetaMask to Account 3, then reconnect.  
**UI:** **My service** → **Load my history**  
**Inputs:** None beyond the connected wallet.

**Expected output:** The claims list contains the saved claim with status `Approved`, showing `120` claimed minutes and `90` approved minutes. The records list contains the saved record ID with status `Valid`.

**Save:** A screenshot or the displayed claim and record IDs for the demo script.

## Step 6: Verify the record publicly

**Wallet:** Account 4, or no wallet in a private browser window.  
**UI:** **Public verification** → enter the saved record ID → **Verify record**  
**Inputs:** Saved record ID.

**Expected output:** No transaction or signature is requested. The DApp displays the volunteer wallet, issuer wallet, activity, approved minutes `90`, service date, issue date, and status `Valid`.

**Save:** The record ID and a screenshot showing wallet-free verification.

## Step 7: Correct the record

**Wallet:** Switch MetaMask to Account 2, then reconnect.  
**UI:** **Organization** → **Manage records** → **Create linked correction**  
**Inputs:**

| Field | Value |
|---|---|
| Valid record ID | Saved original record ID |
| Corrected minutes | `100` |
| Corrected service date (UTC) | `2026-10-25` |
| Reason | `Demo correction` |

**Expected output:** The transaction emits `ServiceRecordCorrected`. The original record becomes `Corrected` and contains a replacement record ID. The new record is `Valid` and points back to the original through `replacesRecordId`.

**Save:** Replacement record ID and transaction hash.

## Step 8: Revoke the replacement

**Wallet:** Keep Account 2 connected.  
**UI:** **Organization** → **Manage records** → **Revoke**  
**Inputs:**

| Field | Value |
|---|---|
| Valid record ID | Saved replacement record ID |
| Reason | `Demo revocation` |

**Expected output:** The transaction emits `ServiceRecordRevoked`. The replacement record becomes `Revoked` but remains readable. The original corrected record also remains readable and linked to the replacement.

**Save:** Revocation transaction hash and a final public-verification screenshot.

## Demo result

The demo has shown organization registration, activity creation, claim submission, approval and record creation, volunteer history, public verification, correction history, and revocation history. Claim rejection and negative tests are intentionally excluded from this short demo.
