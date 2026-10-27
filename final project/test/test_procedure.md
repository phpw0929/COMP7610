The contract is ready at [VolunteerHoursRegistry.sol](../dapp/contracts/VolunteerHoursRegistry.sol).

Use Remix with four Sepolia accounts:

| Account   | Role                         |
| --------- | ---------------------------- |
| Account 1 | Administrator and deployer   |
| Account 2 | Recognized organization      |
| Account 3 | Volunteer                    |
| Account 4 | Unauthorized tester/verifier |

Each account that sends transactions needs Sepolia ETH. Account 4 only performs read calls, so it does not need ETH.

## **1. Deploy the contract**

1. Open [Remix](https://remix.ethereum.org/).
2. In **File Explorers**, create `VolunteerHoursRegistry.sol`.
3. Paste the complete contract source into the file.
4. Open **Solidity Compiler**.
5. Select compiler version **0.8.30**.
6. Click **Compile VolunteerHoursRegistry.sol**.
7. Open **Deploy & Run Transactions**.
8. Set **Environment** to **Injected Provider - MetaMask**.
9. Confirm MetaMask is connected to **Sepolia**.
10. Select Account 1.
11. Select `VolunteerHoursRegistry` in the contract dropdown.
12. Click **Deploy**.

The constructor has no parameters. Confirm the deployment transaction in MetaMask.

After deployment:

- Copy the deployed contract address.
- Check `administrator`; it should equal Account 1.
- Check `organizationCount`, `activityCount`, `claimCount`, and `recordCount`; all should be `0`.

If the deployed contract disappears after switching accounts, paste the address into **At Address** and click **At Address**.

Remix uses:

- Blue buttons for transactions that require gas.
- Orange buttons for read-only calls that do not require gas.
- Account switching through the Remix account dropdown and MetaMask.

### **Status values**

Claim status:

| Value | Meaning  |
| ----- | -------- |
| 0     | None     |
| 1     | Pending  |
| 2     | Approved |
| 3     | Rejected |

### Record status:

| Value | Meaning   |
| ----- | --------- |
| 0     | None      |
| 1     | Valid     |
| 2     | Revoked   |
| 3     | Corrected |

### **Useful test values**

Use these timestamps:

| Meaning    | Unix timestamp |
| ---------- | -------------- |
| 2026-01-01 | `1767225600`   |
| 2026-10-25 | `1792886400`   |
| 2027-01-01 | `1798761600`   |

Use these hashes:

```
Organization metadata:
0xff2fe0d0dc64081fffddf3e4c0c648abb0befa3800208b4d439b5eb83c15aec3

Activity metadata:
0xc0beb42b64cbcef4eb970b35b7b018da5594dfff7c49736e9c82c34b9f88f5f4

Rejection reason:
0x069955195629628a9ef57ede9852ac8d50435c65047088b268781c86d7bb4c41

Correction reason:
0x7382716f496e79c796e3dece3423f7d0a0f4c743bd6a3d3d8dc0aff39fcb2cc4

Revocation reason:
0x22cbf7fc9c7ed7e24fa87a802c449c808d8964201dbf152069aaf47cb6993df0
```

For optional hash inputs, use:

```
0x0000000000000000000000000000000000000000000000000000000000000000
```

### Output of functions

`registerOrganization(...)`: 

| Position | Field                  | Example                        |
| -------- | ---------------------- | ------------------------------ |
| 1        | Organization ID        | `1`                            |
| 2        | Organization wallet    | `0xff4e...e94599`              |
| 3        | Metadata URI           | `https://example.org/org.json` |
| 4        | Metadata hash          | `0xff2fe0...15aec3`            |
| 5        | Active status          | `true`                         |
| 6        | Registration timestamp | `1793118672`                   |

`getActivity(...)`: 

| Position | Field              | Example                               | Meaning                            |
| -------- | ------------------ | ------------------------------------- | ---------------------------------- |
| 1        | `id`               | `1`                                   | Activity ID is `1`                 |
| 2        | `issuer`           | `0xff4e...e94599`                     | Account 2 created the activity     |
| 3        | `metadataURI`      | `https://example.org/activity-1.json` | Activity metadata location         |
| 4        | `metadataHash`     | `0xc0beb4...f88f5f4`                  | Metadata content hash              |
| 5        | `category`         | `Community service`                   | Activity category                  |
| 6        | `serviceStartDate` | `1767225600`                          | 2026-01-01 00:00 UTC               |
| 7        | `serviceEndDate`   | `1798761600`                          | 2027-01-01 00:00 UTC               |
| 8        | `open`             | `true`                                | Volunteers can submit claims       |
| 9        | `createdAt`        | `1793119320`                          | Approximately 2026-10-27 16:42 UTC |

`getClaim(...)`:

| Position | Field                | Example           | Meaning                                     |
| -------- | -------------------- | ----------------- | ------------------------------------------- |
| 1        | `id`                 | `1`               | Claim ID is `1`                             |
| 2        | `activityId`         | `1`               | Claim refers to activity `1`                |
| 3        | `volunteer`          | `0xAf58...7c01B3` | Account 3 submitted the claim               |
| 4        | `claimedMinutes`     | `120`             | Volunteer claimed 120 minutes, or 2 hours   |
| 5        | `serviceDate`        | `1792886400`      | 2026-10-25 00:00 UTC                        |
| 6        | `supportingInfoHash` | All zeros         | No supporting-information hash was provided |
| 7        | `status`             | `1`               | `Pending`                                   |
| 8        | `submittedAt`        | `1793119620`      | Approximately 2026-10-27 16:47 UTC          |
| 9        | `reviewedAt`         | `0`               | Not reviewed yet                            |
| 10       | `reviewer`           | Zero address      | No reviewer yet                             |
| 11       | `approvedMinutes`    | `0`               | No approved duration yet                    |
| 12       | `reviewNoteHash`     | All zeros         | No review note yet                          |
| 13       | `recordId`           | `0`               | No service record has been created yet      |

`getServiceRecord(...)`:

| Position | Field                 | Example           | Meaning                            |
| -------- | --------------------- | ----------------- | ---------------------------------- |
| 1        | `id`                  | `1`               | Service record ID is `1`           |
| 2        | `claimId`             | `1`               | Created from claim `1`             |
| 3        | `volunteer`           | `0xAf58...7c01B3` | Account 3                          |
| 4        | `issuer`              | `0xff4e...e94599` | Account 2                          |
| 5        | `activityId`          | `1`               | Related to activity `1`            |
| 6        | `approvedMinutes`     | `90`              | Organization approved 90 minutes   |
| 7        | `serviceDate`         | `1792886400`      | 2026-10-25 00:00 UTC               |
| 8        | `issuedAt`            | `1793120100`      | Approximately 2026-10-27 16:55 UTC |
| 9        | `status`              | `1`               | `Valid`                            |
| 10       | `replacesRecordId`    | `0`               | This is not a replacement record   |
| 11       | `replacementRecordId` | `0`               | No correction exists yet           |
| 12       | `statusChangedAt`     | `0`               | No later status change             |
| 13       | `reasonHash`          | All zeros         | No revocation or correction reason |
| 14       | `supportingInfoHash`  | All zeros         | No supporting-information hash     |
| 15       | `reviewNoteHash`      | All zeros         | No review-note hash                |

## **2. Test organization registration**

Switch to Account 1.

Call:

```
registerOrganization(
    Account2Address,
    https://example.org/org.json,
    0xff2fe0d0dc64081fffddf3e4c0c648abb0befa3800208b4d439b5eb83c15aec3
)
```

Expected result:

- `organizationCount()` returns `1`.
- `getOrganization(Account2Address)` shows `active = true`.
- The organization ID is `1`.

Negative test:

1. Switch to Account 2.
2. Try to call `registerOrganization`.

Expected result:

```
Only administrator
```

**Feature tested:** recognized organization registration and administrator access control.

## **3. Test activity creation**

Switch to Account 2.

Call:

```
createActivity(
    https://example.org/activity-1.json,
    0xc0beb42b64cbcef4eb970b35b7b018da5594dfff7c49736e9c82c34b9f88f5f4,
    Community service,
    1767225600,
    1798761600
)
```

Expected result:

- `activityCount()` returns `1`.

- ```
  getActivity(1)
  ```

   shows:

  - issuer = Account 2
  - `open = true`
  - category = `Community service`

Negative test:

- Switch to Account 4 and try `createActivity`.

Expected result:

```
Organization not registered
```

**Feature tested:** service activity creation.

## **4. Test volunteer claim submission**

Switch to Account 3.

Call:

```
submitServiceClaim(
    1,
    120,
    1792886400,
    0x0000000000000000000000000000000000000000000000000000000000000000
)
```

Here, `120` means 120 minutes, or 2 hours.

Expected result:

- `claimCount()` returns `1`.

- ```
  getClaim(1)
  ```

   shows:

  - volunteer = Account 3
  - claimed minutes = `120`
  - status = `1`, meaning `Pending`
  - record ID = `0`

Negative tests:

- Submit with `claimedMinutes = 0`.
- Submit with a date before `1767225600`.
- Submit with a future date.

Each should revert.

**Feature tested:** volunteer service-hour claim submission and validation.

## **5. Test unauthorized review**

Keep Account 4 selected.

Try:

```
approveClaim(
    1,
    90,
    0x0000000000000000000000000000000000000000000000000000000000000000
)
```

Expected result:

```
Only activity issuer may review
```

**Feature tested:** organization-only claim review.

## **6. Approve a claim and create a record**

Switch to Account 2.

Call:

```
approveClaim(
    1,
    90,
    0x0000000000000000000000000000000000000000000000000000000000000000
)
```

Expected result:

- `getClaim(1)` returns status `2`, meaning `Approved`.
- `claimedMinutes = 120`.
- `approvedMinutes = 90`.
- `recordId = 1`.
- `getServiceRecord(1)` returns status `1`, meaning `Valid`.
- The record contains Account 3 as volunteer and Account 2 as issuer.

Try approving claim 1 a second time. It should revert because claims can only be reviewed once.

**Features tested:** approval, record creation, immutable approved facts, and status transition.

## **7. Test rejection**

Switch to Account 3 and submit another claim:

```
submitServiceClaim(
    1,
    60,
    1792886400,
    0x0000000000000000000000000000000000000000000000000000000000000000
)
```

This creates claim `2`.

Switch to Account 2 and call:

```
rejectClaim(
    2,
    0x069955195629628a9ef57ede9852ac8d50435c65047088b268781c86d7bb4c41
)
```

Expected result:

- `getClaim(2)` shows status `3`, meaning `Rejected`.
- `recordCount()` remains `1`.
- `recordId()` remains `0`.
- No verified service record is created for claim 2.

**Feature tested:** claim rejection.

## **8. Test volunteer history and public verification**

Switch to any account and call:

```
getVolunteerHistory(Account3Address)
```

Expected result:

- Claim IDs include `1` and `2`.
- Record IDs include `1`.

Call:

```
getIssuerRecordIds(Account2Address)
```

Expected result:

```
[1]
```

From Account 4, call:

```
getServiceRecord(1)
```

This is read-only and should work without a transaction or gas.

**Features tested:** volunteer service history and public verification.

## **9. Test corrected record history**

Switch to Account 2.

Call:

```
correctRecord(
    1,
    120,
    1792886400,
    0x7382716f496e79c796e3dece3423f7d0a0f4c743bd6a3d3d8dc0aff39fcb2cc4
)
```

Expected result:

- Record 1 status becomes `3`, meaning `Corrected`.
- Record 1 has `replacementRecordId = 2`.
- Record 2 has `replacesRecordId = 1`.
- Record 2 is `Valid`.
- Record 2 has `approvedMinutes = 120`.

Both records remain queryable.

**Feature tested:** corrected-record history.

## **10. Test revocation**

Call:

```
revokeRecord(
    2,
    0x22cbf7fc9c7ed7e24fa87a802c449c808d8964201dbf152069aaf47cb6993df0
)
```

Expected result:

- Record 2 status becomes `2`, meaning `Revoked`.
- `getServiceRecord(2)` still returns the record.
- The record is not deleted.

Try correcting or revoking record 2 again. It should revert because only valid records can be changed.

**Feature tested:** record revocation and history preservation.

## **11. Test closing an activity**

Before deactivating Account 2, use Account 3 create and approve one more claim so that record 3 exists:

```
submitServiceClaim(
    1,
    60,
    1792886400,
    0x0000000000000000000000000000000000000000000000000000000000000000
)
```

Then, from Account 2:

```
approveClaim(
    3,
    60,
    0x0000000000000000000000000000000000000000000000000000000000000000
)
```

Now close the activity:

```
closeActivity(1)
```

Expected result:

- `getActivity(1)` shows `open = false`.
- New claims for activity 1 using `submitServiceClaim(...)` revert with:

```
Activity is closed
```

Existing claims and records remain readable.

**Feature tested:** activity lifecycle management.

## **12. Test organization deactivation and administrator intervention**

Switch to Account 1.

Call:

```
setOrganizationActive(Account2Address, false)
```

Expected result:

- `getOrganization(Account2Address)` shows `active = false`.
- Existing record 3 remains `Valid`.
- Account 2 cannot create new activities or modify records.

The administrator can still correct record 3:

```
correctRecord(
    3,
    75,
    1792886400,
    0x7382716f496e79c796e3dece3423f7d0a0f4c743bd6a3d3d8dc0aff39fcb2cc4
)
```

This creates record 4 and marks record 3 as `Corrected`.

Then revoke record 4:

```
revokeRecord(
    4,
    0x22cbf7fc9c7ed7e24fa87a802c449c808d8964201dbf152069aaf47cb6993df0
)
```

Expected result:

- Record 3 is still queryable and links to record 4, `replacementRecordId = 4`.
- Record 4 is `Revoked`.
- No previous record is deleted.

This completes the full planned workflow:

```
Administrator registers organization
        ↓
Organization creates activity
        ↓
Volunteer submits claim
        ↓
Organization approves or rejects
        ↓
Approval creates verified record
        ↓
Volunteer and verifier read history
        ↓
Organization or administrator corrects/revokes record
```

When deploying to Sepolia, save the deployed contract address. The frontend will later need that address and the compiled ABI in `src/contract.js`.