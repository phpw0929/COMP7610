import test from "node:test";
import assert from "node:assert/strict";
import { keccak256, toUtf8Bytes } from "ethers";
import { dateLabel, errorMessage, metadataAt, minutes, positiveId, readItems, reasonHash, utcDate } from "../src/utils.js";

test("IDs retain precision and reject invalid uint256 values", () => {
  assert.equal(positiveId("9007199254740993"), 9007199254740993n);
  for (const value of ["0", "-1", "1.1", "1e3", "01", "", (1n << 256n).toString()]) assert.throws(() => positiveId(value));
  assert.equal(positiveId(` ${(1n << 256n) - 1n} `), (1n << 256n) - 1n);
});
test("minutes enforce the contract uint32 range without rounding", () => {
  assert.equal(minutes("4294967295"), 4294967295n);
  for (const value of ["0", "2.5", "4294967296", "-1"]) assert.throws(() => minutes(value));
});
test("UTC dates round-trip including leap-day and epoch", () => {
  assert.equal(utcDate("1970-01-01"), 0n);
  assert.equal(utcDate("2024-02-29"), 1709164800n);
  assert.equal(dateLabel(1709164800n), "2024-02-29 (UTC)");
  for (const value of ["2023-02-29", "2026-04-31", "1969-12-31", "2026-1-1"]) assert.throws(() => utcDate(value));
  assert.equal(dateLabel(2n ** 64n - 1n), "Timestamp outside display range");
});
test("required reasons and optional notes have different zero-hash rules", () => {
  assert.throws(() => reasonHash(" "));
  assert.equal(reasonHash("", false), `0x${"0".repeat(64)}`);
  assert.equal(reasonHash(" Correction "), keccak256(toUtf8Bytes("Correction")));
});
test("metadata hashes raw bytes, distinguishes schema/hash/transport errors", async (t) => {
  const realFetch = global.fetch;
  t.after(() => { global.fetch = realFetch; });
  const text = '{ "schemaVersion":1,"type":"organization","name":"Demo","description":"Test" }\n';
  const hash = keccak256(toUtf8Bytes(text));
  global.fetch = async () => new Response(text);
  assert.equal((await metadataAt("https://demo.invalid/org.json", hash, "organization")).data.name, "Demo");
  await assert.rejects(metadataAt("https://demo.invalid/org.json", keccak256(toUtf8Bytes(text.trim())), "organization"), /hash does not match/);
  await assert.rejects(metadataAt("http://demo.invalid/org.json", null, "organization"), /HTTPS/);
  await assert.rejects(metadataAt("https://user:pass@demo.invalid/org.json", null, "organization"), /credentials/);
  await assert.rejects(metadataAt("https://demo.invalid/org.json", null, "activity"), /schemaVersion/);
  global.fetch = async () => new Response("null");
  await assert.rejects(metadataAt("https://demo.invalid/org.json", null, "organization"), /schemaVersion/);
  global.fetch = async () => new Response(new Uint8Array([255]));
  await assert.rejects(metadataAt("https://demo.invalid/org.json", null, "organization"), /valid UTF-8 JSON/);
  global.fetch = async () => new Response("not json");
  await assert.rejects(metadataAt("https://demo.invalid/org.json", null, "organization"), /valid UTF-8 JSON/);
  global.fetch = async () => new Response("missing", { status: 404 });
  await assert.rejects(metadataAt("https://demo.invalid/org.json", null, "organization"), /404/);
});
test("metadata permits loopback HTTP only with explicit local-test permission", async (t) => {
  const realFetch = global.fetch; t.after(() => { global.fetch = realFetch; });
  global.fetch = async () => new Response('{"schemaVersion":1,"type":"activity","title":"Test","description":"Demo","location":"Local"}');
  await assert.rejects(metadataAt("http://127.0.0.1/test.json", null, "activity"), /HTTPS/);
  assert.equal((await metadataAt("http://127.0.0.1/test.json", null, "activity", true)).data.title, "Test");
  await assert.rejects(metadataAt("http://example.org/test.json", null, "activity", true), /HTTPS/);
});
test("list reads preserve successes and identify partial failures", async () => {
  const result = await readItems([1n, 2n, 3n], async (id) => { if (id === 2n) throw new Error("RPC limit"); return id * 2n; });
  assert.deepEqual(result.items, [2n, 6n]);
  assert.deepEqual(result.failed, [{ id: "2", message: "RPC limit" }]);
});
test("wallet cancellation and contract errors remain meaningful", () => {
  assert.match(errorMessage({ code: 4001 }), /declined/);
  assert.equal(errorMessage({ reason: "Only administrator", shortMessage: "reverted" }), "Only administrator");
});
