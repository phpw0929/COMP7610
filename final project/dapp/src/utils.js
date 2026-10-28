import { keccak256, toUtf8Bytes } from "ethers";
import { ZERO_HASH } from "./contract.js";

export function positiveId(value) {
  const text = String(value).trim();
  if (!/^[1-9]\d*$/.test(text)) throw new Error("Enter a positive whole-number ID.");
  const result = BigInt(text);
  if (result > (1n << 256n) - 1n) throw new Error("ID exceeds the contract limit.");
  return result;
}

export function minutes(value) {
  const result = positiveId(value);
  if (result > 4294967295n) throw new Error("Minutes exceed the contract limit.");
  return result;
}

export function utcDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error("Enter a date in YYYY-MM-DD format.");
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value || date.getTime() < 0) {
    throw new Error("Enter a valid UTC date on or after 1970-01-01.");
  }
  return BigInt(date.getTime() / 1000);
}

export function dateLabel(seconds) {
  if (seconds === undefined || seconds === null) return "Not available";
  const value = Number(seconds) * 1000;
  if (!Number.isFinite(value) || value < 0 || value > 8640000000000000) return "Timestamp outside display range";
  return `${new Date(value).toISOString().slice(0, 10)} (UTC)`;
}

export function reasonHash(value, required = true) {
  const reason = String(value ?? "").trim();
  if (!reason) {
    if (required) throw new Error("Enter a short, non-sensitive reason.");
    return ZERO_HASH;
  }
  return keccak256(toUtf8Bytes(reason));
}

export async function metadataAt(uri, expectedHash, expectedType, allowLocal = false) {
  let url;
  try { url = new URL(uri); } catch { throw new Error("Enter a valid public HTTPS metadata URL."); }
  const local = allowLocal && url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname);
  if (url.protocol !== "https:" && !local) throw new Error("Metadata URL must use HTTPS.");
  if (url.username || url.password) throw new Error("Metadata URL must not contain credentials.");
  const response = await fetch(url.href, { cache: "no-store", signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error(`Metadata request failed (${response.status}).`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.length > 1048576) throw new Error("Metadata exceeds the 1 MiB display limit.");
  const hash = keccak256(bytes);
  if (expectedHash && hash.toLowerCase() !== expectedHash.toLowerCase()) {
    throw new Error("Metadata hash does not match the on-chain value.");
  }
  let data;
  try { data = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)); }
  catch { throw new Error("Metadata is not valid UTF-8 JSON."); }
  if (!data || data.schemaVersion !== 1 || data.type !== expectedType) {
    throw new Error(`Metadata must use schemaVersion 1 and type ${expectedType}.`);
  }
  const fields = expectedType === "organization" ? ["name", "description"] : ["title", "description", "location"];
  if (fields.some((field) => typeof data[field] !== "string" || !data[field].trim())) {
    throw new Error(`Metadata must contain ${fields.join(", ")}.`);
  }
  return { data, hash };
}

export function errorMessage(error) {
  if (error?.code === "ACTION_REJECTED" || error?.code === 4001) return "Wallet request declined. No new transaction was confirmed.";
  if (error?.code === "INSUFFICIENT_FUNDS") return "Insufficient test ETH to pay transaction gas.";
  return error?.reason || error?.shortMessage || error?.message || String(error);
}

export async function readItems(ids, read) {
  const items = [], failed = [];
  for (let i = 0; i < ids.length; i += 4) {
    const batch = ids.slice(i, i + 4);
    const results = await Promise.allSettled(batch.map(read));
    results.forEach((result, index) => {
      if (result.status === "fulfilled") items.push(result.value);
      else failed.push({ id: String(batch[index]), message: errorMessage(result.reason) });
    });
  }
  return { items, failed };
}
