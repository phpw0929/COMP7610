import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { keccak256, toUtf8Bytes, ZeroHash } from "ethers";
import { startLocal } from "../scripts/local-support.mjs";

test("real Solidity local-EVM workflow, permissions and immutable correction history", async (t) => {
  const local = await startLocal();
  t.after(() => local.close());
  const [admin, issuer, volunteer, outsider] = local.signers;
  const [adminAddress, issuerAddress, volunteerAddress] = local.accounts;
  const c = local.contract;
  const hash = keccak256(toUtf8Bytes("Test metadata"));
  const now = BigInt((await local.provider.getBlock("latest")).timestamp);
  const evidence = { environment: "LOCAL EVM (not Sepolia)", chainId: 31337, contract: await c.getAddress(), compiler: local.compiler, evmTarget: "shanghai", source: "unchanged VolunteerHoursRegistry.sol", cases: [], transactions: [] };
  async function write(label, fn) { const tx = await fn(); const receipt = await tx.wait(); assert.equal(receipt.status, 1); evidence.transactions.push({ label, hash: tx.hash, block: receipt.blockNumber, status: receipt.status }); }
  async function group(name, fn) { await t.test(name, fn); evidence.cases.push(name); }
  await group("M1: only administrator registers a nonzero-hash organization", async () => {
    assert.equal(await c.administrator(), adminAddress);
    await assert.rejects(() => c.connect(issuer).registerOrganization.staticCall(issuerAddress, "https://demo.invalid/org", hash), /Only administrator/);
    await assert.rejects(() => c.registerOrganization.staticCall(issuerAddress, "https://demo.invalid/org", ZeroHash), /Metadata hash is empty/);
    await write("registerOrganization", () => c.registerOrganization(issuerAddress, "https://demo.invalid/org", hash));
    assert.equal((await c.getOrganization(issuerAddress)).active, true);
  });
  await group("M2/M3: active issuer creates activity; volunteer submits positive, in-window minutes", async () => {
    await assert.rejects(() => c.connect(outsider).createActivity.staticCall("https://demo.invalid/activity", hash, "Community", now - 1000n, now + 1000n), /Organization not registered/);
    await write("createActivity", () => c.connect(issuer).createActivity("https://demo.invalid/activity", hash, "Community", now - 1000n, now + 1000n));
    await assert.rejects(() => c.connect(volunteer).submitServiceClaim.staticCall(1n, 0, now, ZeroHash), /positive/);
    await assert.rejects(() => c.connect(volunteer).submitServiceClaim.staticCall(1n, 60, now - 1001n, ZeroHash), /before activity/);
    await assert.rejects(() => c.connect(volunteer).submitServiceClaim.staticCall(1n, 60, now + 500n, ZeroHash), /future/);
    await write("submit claim A", () => c.connect(volunteer).submitServiceClaim(1n, 120, now, ZeroHash));
    assert.equal((await c.getClaim(1n)).status, 1n);
  });
  await group("M4/M5: only issuer reviews once; approval issues a real record with adjusted minutes", async () => {
    await assert.rejects(() => c.connect(outsider).approveClaim.staticCall(1n, 90, ZeroHash), /Only activity issuer/);
    await write("approve claim A", () => c.connect(issuer).approveClaim(1n, 90, ZeroHash));
    const claim = await c.getClaim(1n), record = await c.getServiceRecord(1n);
    assert.equal(claim.status, 2n); assert.equal(claim.claimedMinutes, 120n); assert.equal(claim.approvedMinutes, 90n);
    assert.equal(claim.recordId, record.id); assert.equal(record.status, 1n);
    await assert.rejects(() => c.connect(issuer).approveClaim.staticCall(1n, 90, ZeroHash), /not pending/);
  });
  await group("M4/M6/M7: rejection creates no record; public history and verification require no signer", async () => {
    await write("submit claim B", () => c.connect(volunteer).submitServiceClaim(1n, 60, now, ZeroHash));
    await assert.rejects(() => c.connect(issuer).rejectClaim.staticCall(2n, ZeroHash), /reason hash is required/);
    await write("reject claim B", () => c.connect(issuer).rejectClaim(2n, hash));
    assert.equal((await c.getClaim(2n)).status, 3n); assert.equal((await c.getClaim(2n)).recordId, 0n);
    assert.equal(await c.recordCount(), 1n);
    const readOnly = c.connect(local.provider);
    const [claims, records] = await readOnly.getVolunteerHistory(volunteerAddress);
    assert.deepEqual(Array.from(claims), [1n, 2n]); assert.deepEqual(Array.from(records), [1n]);
    assert.equal((await readOnly.getServiceRecord(1n)).issuer, issuerAddress);
  });
  await group("M8: multi-step corrections retain facts and backlinks; revocation preserves old records", async () => {
    await write("correct record 1", () => c.connect(issuer).correctRecord(1n, 120, now, hash));
    await write("correct record 2", () => c.connect(issuer).correctRecord(2n, 125, now, hash));
    assert.equal((await c.getServiceRecord(1n)).status, 3n);
    assert.equal((await c.getServiceRecord(1n)).replacementRecordId, 2n);
    assert.equal((await c.getServiceRecord(2n)).replacementRecordId, 3n);
    assert.equal((await c.getServiceRecord(3n)).replacesRecordId, 2n);
    assert.equal((await c.getServiceRecord(3n)).volunteer, volunteerAddress);
    await write("revoke record 3", () => c.connect(issuer).revokeRecord(3n, hash));
    assert.equal((await c.getServiceRecord(3n)).status, 2n);
    await assert.rejects(() => c.connect(issuer).revokeRecord.staticCall(3n, hash), /not valid/);
  });
  await group("closed activity permits existing pending review; deactivated issuer cannot act; admin can correct", async () => {
    await write("submit claim C", () => c.connect(volunteer).submitServiceClaim(1n, 60, now, ZeroHash));
    await write("close activity", () => c.connect(issuer).closeActivity(1n));
    await assert.rejects(() => c.connect(volunteer).submitServiceClaim.staticCall(1n, 60, now, ZeroHash), /closed/);
    await write("approve pending claim C after closure", () => c.connect(issuer).approveClaim(3n, 60, ZeroHash));
    await write("deactivate issuer", () => c.setOrganizationActive(issuerAddress, false));
    assert.equal((await c.getServiceRecord(4n)).status, 1n);
    await assert.rejects(() => c.connect(issuer).correctRecord.staticCall(4n, 75, now, hash), /inactive/);
    await write("administrator correction", () => c.connect(admin).correctRecord(4n, 75, now, hash));
    assert.equal((await c.getServiceRecord(4n)).replacementRecordId, 5n);
    assert.equal((await c.getServiceRecord(5n)).status, 1n);
  });
  evidence.completedAt = new Date().toISOString();
  fs.mkdirSync(".local-test", { recursive: true });
  fs.writeFileSync(".local-test/automated-evidence.json", JSON.stringify(evidence, null, 2) + "\n");
});
