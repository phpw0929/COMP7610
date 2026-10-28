import { useEffect, useRef, useState } from "react";
import { BrowserProvider, Contract, FetchRequest, JsonRpcProvider, isAddress } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS, NETWORK_NAME, READ_RPC_URL, SEPOLIA_CHAIN_ID } from "./contract.js";
import { errorMessage } from "./utils.js";

export function useRegistry() {
  const [reader, setReader] = useState(null);
  const [readError, setReadError] = useState("");
  const [retry, setRetry] = useState(0);
  const [wallet, setWallet] = useState("");
  const [walletError, setWalletError] = useState("");
  const [admin, setAdmin] = useState("");
  const [org, setOrg] = useState(null);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [tx, setTx] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [session, setSession] = useState(0);
  const lock = useRef(false);
  const generation = useRef(0);
  let chainId;
  try { chainId = BigInt(SEPOLIA_CHAIN_ID); } catch { chainId = null; }

  useEffect(() => {
    let active = true;
    let provider;
    setReader(null); setReadError("");
    async function start() {
      try {
        if (!chainId || chainId <= 0n) throw new Error("Invalid chain ID in configuration.");
        if (!isAddress(CONTRACT_ADDRESS)) throw new Error("Invalid contract address in configuration.");
        if (!READ_RPC_URL) throw new Error("Configure a public read-only RPC endpoint.");
        const request = new FetchRequest(READ_RPC_URL);
        request.timeout = 15000;
        provider = new JsonRpcProvider(request, undefined, { batchMaxCount: 1 });
        const network = await provider.getNetwork();
        if (network.chainId !== chainId) throw new Error(`Read RPC must use ${NETWORK_NAME} (chain ${chainId}).`);
        const code = await provider.getCode(CONTRACT_ADDRESS);
        if (code === "0x") throw new Error("No contract code exists at the configured address.");
        const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
        const address = await contract.administrator();
        if (active) { setAdmin(address); setReader(contract); }
      } catch (error) { if (active) setReadError(errorMessage(error)); }
    }
    start();
    return () => { active = false; provider?.destroy(); };
  }, [retry]);

  useEffect(() => {
    const ethereum = window.ethereum;
    if (!ethereum?.on) return;
    function clear() {
      generation.current += 1;
      setSession(generation.current);
      setWallet(""); setOrg(null); setWalletError("Account or network changed. Reconnect before writing.");
    }
    ethereum.on("accountsChanged", clear);
    ethereum.on("chainChanged", clear);
    return () => {
      ethereum.removeListener("accountsChanged", clear);
      ethereum.removeListener("chainChanged", clear);
    };
  }, []);

  useEffect(() => {
    let active = true;
    setOrg(null);
    if (!reader || !wallet) { setRolesLoading(false); return; }
    setRolesLoading(true);
    reader.getOrganization(wallet).then((result) => { if (active) setOrg(result); })
      .catch((error) => {
        if (active && !errorMessage(error).includes("Organization not registered")) setWalletError(`Unable to determine organization role: ${errorMessage(error)}`);
      }).finally(() => { if (active) setRolesLoading(false); });
    return () => { active = false; };
  }, [reader, wallet, refresh]);

  async function connect() {
    setWalletError("");
    try {
      if (!chainId) throw new Error("Invalid chain ID in configuration.");
      if (!window.ethereum) throw new Error("Install MetaMask to submit or manage records. Public verification works without a wallet.");
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const selectedChain = await window.ethereum.request({ method: "eth_chainId" });
      if (BigInt(selectedChain) !== chainId) {
        await window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: SEPOLIA_CHAIN_ID }] });
      }
      const confirmed = await window.ethereum.request({ method: "eth_accounts" });
      if (!confirmed[0] || !accounts[0]) throw new Error("No wallet account was selected.");
      if (BigInt(await window.ethereum.request({ method: "eth_chainId" })) !== chainId) throw new Error(`Switch your wallet to ${NETWORK_NAME}.`);
      generation.current += 1; setSession(generation.current);
      setWallet(confirmed[0]);
    } catch (error) { setWalletError(errorMessage(error)); }
  }

  function confirmed(receipt, contract, originalWallet, originalGeneration) {
    if (receipt.status !== 1) throw new Error("Transaction failed on-chain.");
    const events = receipt.logs.flatMap((log) => {
      if (log.address.toLowerCase() !== CONTRACT_ADDRESS.toLowerCase()) return [];
      try { const parsed = contract.interface.parseLog(log); return parsed ? [parsed] : []; } catch { return []; }
    });
    const results = events.filter((e) => ["OrganizationRegistered", "ActivityCreated", "ServiceClaimSubmitted", "ServiceRecordIssued", "ServiceRecordCorrected", "ServiceRecordRevoked"].includes(e.name))
      .map((e) => `${e.name}: #${e.args[0]}${e.name === "ServiceRecordCorrected" ? ` → #${e.args[1]}` : ""}`);
    setTx((current) => ({ ...current, hash: receipt.hash, status: "confirmed", results,
      message: originalGeneration === generation.current ? `Confirmed on ${NETWORK_NAME}.` : `Confirmed for earlier wallet ${originalWallet}. Reconnect to refresh current account data.` }));
    if (originalGeneration === generation.current) setRefresh((value) => value + 1);
  }

  async function send(method, prepare) {
    if (lock.current || tx?.status === "pending") return;
    lock.current = true; setBusy(true);
    const originalGeneration = generation.current;
    const originalWallet = wallet;
    let provider;
    setTx({ status: "preparing", message: "Checking input and preparing wallet request…", wallet });
    try {
      if (!reader) throw new Error(readError || "Read connection is unavailable.");
      if (!wallet || !window.ethereum) throw new Error("Connect your wallet first.");
      const args = typeof prepare === "function" ? await prepare() : prepare;
      if (generation.current !== originalGeneration) throw new Error("Wallet changed while preparing the request. Submit again with the current account.");
      provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();
      const account = await signer.getAddress();
      if (account.toLowerCase() !== originalWallet.toLowerCase() || network.chainId !== chainId || generation.current !== originalGeneration) {
        throw new Error("Wallet account or network changed. Reconnect first.");
      }
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      setTx({ status: "signing", message: "Approve the request in your wallet.", wallet: originalWallet });
      const response = await contract[method](...args);
      setTx({ status: "pending", message: "Submitted. Waiting for a block confirmation…", hash: response.hash, wallet: originalWallet, generation: originalGeneration });
      let receipt;
      try { receipt = await response.wait(1, 90000); }
      catch (error) {
        if (error.code === "TRANSACTION_REPLACED") {
          if (error.cancelled) { setTx({ status: "cancelled", hash: error.replacement?.hash || response.hash, message: "Transaction cancelled or replaced with another operation.", wallet: originalWallet }); return; }
          receipt = error.receipt;
        } else if (error.code === "TIMEOUT") {
          setTx((current) => ({ ...current, status: "pending", message: "Still pending. Check the receipt before submitting again." })); return;
        } else throw error;
      }
      if (!receipt) throw new Error("No transaction receipt was returned.");
      confirmed(receipt, contract, originalWallet, originalGeneration);
    } catch (error) {
      setTx((current) => ({ ...current, status: current?.hash && error.code !== "CALL_EXCEPTION" && !error.receipt ? "pending" : "error", message: errorMessage(error) }));
    } finally { provider?.destroy(); lock.current = false; setBusy(false); }
  }

  async function checkPending() {
    if (!tx?.hash || !reader) return;
    try {
      const receipt = await reader.runner.getTransactionReceipt(tx.hash);
      if (!receipt) { setTx((current) => ({ ...current, message: "No receipt yet. Transaction remains pending." })); return; }
      if (receipt.status !== 1) { setTx((current) => ({ ...current, status: "error", message: "Transaction failed on-chain. No successful change was confirmed." })); return; }
      confirmed(receipt, reader, tx.wallet, tx.generation);
    } catch (error) { setTx((current) => ({ ...current, message: errorMessage(error) })); }
  }

  return { reader, readError, wallet, walletError, admin, org, rolesLoading, busy: busy || tx?.status === "pending", tx, refresh, session,
    isAdmin: !!wallet && wallet.toLowerCase() === admin.toLowerCase(), isOrg: org?.active === true,
    connect, send, checkPending, retry: () => setRetry((value) => value + 1) };
}
