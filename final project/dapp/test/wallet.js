// Development-only EIP-1193 test wallet. This file is never a production entry.
if (!import.meta.env.DEV || import.meta.env.MODE !== "local-test" || !["127.0.0.1", "localhost"].includes(location.hostname)) {
  throw new Error("The local integration wallet is restricted to local-test development mode.");
}
const state = await (await fetch("/test/state.json")).json();
let selected = state.accounts[0], rejectNext = false, id = 0;
const handlers = new Map();
window.ethereum = {
  async request({ method, params = [] }) {
    if (method === "eth_accounts" || method === "eth_requestAccounts") return [selected];
    if (method === "wallet_switchEthereumChain") return null;
    if (method === "eth_sendTransaction" && rejectNext) { rejectNext = false; document.querySelector("#test-toolbar button").textContent = "Decline next test transaction"; throw Object.assign(new Error("User rejected test request"), { code: 4001 }); }
    const response = await fetch(state.rpc, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jsonrpc: "2.0", id: ++id, method, params }) });
    const body = await response.json();
    if (body.error) throw Object.assign(new Error(body.error.message), body.error);
    return body.result;
  },
  on(event, fn) { if (!handlers.has(event)) handlers.set(event, new Set()); handlers.get(event).add(fn); },
  removeListener(event, fn) { handlers.get(event)?.delete(fn); },
};
const bar = document.getElementById("test-toolbar");
bar.style.cssText = "background:#f4e5b9;padding:12px 24px;font:14px system-ui;color:#493a18;display:flex;align-items:center;gap:16px;flex-wrap:wrap";
const label = document.createElement("label"); label.textContent = "Local test wallet ";
const select = document.createElement("select"); select.setAttribute("aria-label", "Local test role");
["Administrator", "Organization", "Volunteer", "Unauthorized"].forEach((role, index) => {
  const option = document.createElement("option"); option.value = String(index); option.textContent = role; select.append(option);
});
select.addEventListener("change", () => { selected = state.accounts[Number(select.value)]; handlers.get("accountsChanged")?.forEach((fn) => fn([selected])); });
label.append(select); bar.append(label);
const reject = document.createElement("button"); reject.textContent = "Decline next test transaction"; reject.onclick = () => { rejectNext = true; reject.textContent = "Next test transaction will be declined"; }; bar.append(reject);
const note = document.createElement("span"); note.textContent = "Local EVM only · No MetaMask keys · Not Sepolia evidence"; bar.append(note);
await import("/src/main.jsx");
