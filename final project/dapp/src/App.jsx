import React, { useEffect, useRef, useState } from "react";
import { isAddress, ZeroAddress } from "ethers";
import { useRegistry } from "./useRegistry.js";
import {
  CLAIM_STATUS, CONTRACT_ADDRESS,
  RECORD_STATUS, SEPOLIA_EXPLORER_URL, NETWORK_NAME, LOCAL_TEST,
} from "./contract.js";
import {
  dateLabel, errorMessage, metadataAt, minutes, positiveId, reasonHash, utcDate, readItems,
} from "./utils.js";

const valueOf = (event) => Object.fromEntries(new FormData(event.currentTarget));
const fmt = (value) => String(value ?? "");

function Form({ title, inputs, submit, onSubmit, busy, disabled }) {
  return <form aria-label={title} onSubmit={onSubmit}>
    <h3>{title}</h3>
    {inputs.map(({ name, label, type = "text", optional = false, options }) =>
      <label className="field" key={name}>{label}
        {options ? <select name={name} required={!optional}>{options.map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select> : <input name={name} type={type} required={!optional} inputMode={type === "number" ? "numeric" : undefined} /> }
      </label>)}
    <button disabled={busy || disabled}>{busy ? "Waiting…" : submit}</button>
  </form>;
}

function Info({ label, children }) {
  return <div className="info"><span>{label}</span><strong>{children}</strong></div>;
}

export default function App() {
  const registry = useRegistry();
  const { reader, readError, wallet, walletError, org, rolesLoading, busy, tx, refresh, session, isAdmin, isOrg, connect, send } = registry;
  const [tab, setTab] = useState("verify");
  const [activities, setActivities] = useState([]);
  const [issued, setIssued] = useState([]);
  const [history, setHistory] = useState(null);
  const [record, setRecord] = useState(null);
  const [listError, setListError] = useState("");
  const [verifyError, setVerifyError] = useState("");
  const [verifyBusy, setVerifyBusy] = useState(false);
  const [listBusy, setListBusy] = useState(false);
  const [preview, setPreview] = useState(null);
  const [previewError, setPreviewError] = useState("");
  const epoch = useRef(0);
  const lookup = useRef(0);
  const verifiedId = useRef(null);
  const listRequest = useRef(0);
  const previewRequest = useRef(0);
  const metadata = (uri, hash, type) => metadataAt(uri, hash, type, LOCAL_TEST);

  useEffect(() => {
    epoch.current += 1;
    listRequest.current += 1;
    previewRequest.current += 1;
    setActivities([]); setIssued([]); setHistory(null); setListError(""); setPreview(null); setPreviewError(""); setListBusy(false);
    if (reader && wallet && refresh > 0) {
      if (tab === "organization") loadActivities();
      if (tab === "volunteer") loadHistory();
    }
  }, [session, refresh]);

  useEffect(() => {
    if (reader && verifiedId.current) verifyId(verifiedId.current);
    else { lookup.current += 1; setRecord(null); setVerifyBusy(false); }
  }, [reader, refresh]);

  function submit(method, build) {
    return (event) => {
      event.preventDefault();
      const values = valueOf(event);
      send(method, () => build(values));
    };
  }

  async function loadActivities() {
    const current = epoch.current;
    const request = ++listRequest.current;
    setListBusy(true); setListError("");
    try {
      if (!reader || !wallet) throw new Error("Connect a wallet and wait for read access.");
      const ids = await reader.getOrganizationActivityIds(wallet);
      const result = await readItems(ids, async (id) => {
        const activity = await reader.getActivity(id);
        const claims = await readItems(await reader.getActivityClaimIds(id), (claimId) => reader.getClaim(claimId));
        return { activity, claims: claims.items, failed: claims.failed };
      });
      const records = await readItems(await reader.getIssuerRecordIds(wallet), (id) => reader.getServiceRecord(id));
      if (current !== epoch.current || request !== listRequest.current) return;
      setActivities(result.items); setIssued(records.items);
      const failures = [...result.failed, ...records.failed, ...result.items.flatMap((x) => x.failed)];
      if (failures.length) setListError(`Some data could not be loaded: ${failures.map((x) => `#${x.id}: ${x.message}`).join("; ")}`);
    } catch (error) { if (current === epoch.current && request === listRequest.current) setListError(errorMessage(error)); }
    finally { if (current === epoch.current && request === listRequest.current) setListBusy(false); }
  }

  async function loadHistory() {
    const current = epoch.current;
    const request = ++listRequest.current;
    setListBusy(true); setListError("");
    try {
      if (!reader || !wallet) throw new Error("Connect a wallet and wait for read access.");
      const [claimIds, recordIds] = await reader.getVolunteerHistory(wallet);
      const [claims, records] = await Promise.all([
        readItems(claimIds, (id) => reader.getClaim(id)), readItems(recordIds, (id) => reader.getServiceRecord(id)),
      ]);
      if (current !== epoch.current || request !== listRequest.current) return;
      setHistory({ claims: claims.items, records: records.items });
      if (claims.failed.length || records.failed.length) setListError("Some history entries could not be loaded. Refresh to retry.");
    } catch (error) { if (current === epoch.current && request === listRequest.current) setListError(errorMessage(error)); }
    finally { if (current === epoch.current && request === listRequest.current) setListBusy(false); }
  }

  async function verifyId(id) {
    const request = ++lookup.current;
    verifiedId.current = null;
    setVerifyError(""); setRecord(null); setVerifyBusy(true);
    try {
      if (!reader) throw new Error(readError || "Read connection is still connecting. Try again shortly.");
      const item = await reader.getServiceRecord(positiveId(id));
      const [activity, organization] = await Promise.all([reader.getActivity(item.activityId), reader.getOrganization(item.issuer)]);
      if (request !== lookup.current) return;
      verifiedId.current = item.id;
      const checkedAt = new Date().toISOString();
      setRecord({ item, activity, organization, checkedAt, metadata: ["Checking metadata…", "Checking metadata…"] });
      setVerifyBusy(false);
      const names = await Promise.all([[activity, "activity"], [organization, "organization"]].map(async ([object, type]) => {
        try { const checked = await metadata(object.metadataURI, object.metadataHash, type); return `Verified: ${type === "activity" ? checked.data.title : checked.data.name}`; }
        catch (error) { return `Unverified metadata: ${errorMessage(error)}`; }
      }));
      if (request === lookup.current) setRecord({ item, activity, organization, checkedAt, metadata: names });
    } catch (error) { if (request === lookup.current) setVerifyError(errorMessage(error)); }
    finally { if (request === lookup.current) setVerifyBusy(false); }
  }

  function verify(event) { event.preventDefault(); verifyId(valueOf(event).recordId); }
  function openRecord(id) { setTab("verify"); verifyId(id); document.getElementById("public-verify")?.scrollIntoView({ behavior: "smooth" }); }

  async function previewActivity(event) {
    event.preventDefault();
    const request = ++previewRequest.current;
    const current = epoch.current;
    const id = valueOf(event).activityId;
    setPreview(null); setPreviewError("");
    try {
      if (!reader) throw new Error("Wait for the read connection.");
      const item = await reader.getActivity(positiveId(id));
      const issuer = await reader.getOrganization(item.issuer);
      if (request === previewRequest.current && current === epoch.current) setPreview({ item, issuer });
    } catch (error) { if (request === previewRequest.current && current === epoch.current) setPreviewError(errorMessage(error)); }
  }

  return <main className="shell" id="main" key={session}>
    <a className="skip" href="#public-verify">Skip to verification</a>
    <div className="brand"><span className="brand-mark" aria-hidden="true">V</span><span>Volunteer registry</span><span className="network-label">{NETWORK_NAME}</span></div>
    <header className="hero">
      <div><p className="eyebrow">SERVICE RECORDS · PUBLIC VERIFICATION</p>
      <h1>Every hour.<br />A traceable record.</h1>
      <p>Organizations approve service. Volunteers keep their history.<br className="desktop-break" /> Anyone can check the current record.</p></div>
      <aside className="connection-box">
        <span className={`connection-state ${reader ? "ready" : ""}`}>{reader ? `Reading ${NETWORK_NAME}` : readError ? "Connection unavailable" : "Connecting to the network…"}</span>
        <p className="small-label">REGISTRY CONTRACT</p>
        {LOCAL_TEST ? <span className="mono">{CONTRACT_ADDRESS}</span> : <a className="mono" href={`${SEPOLIA_EXPLORER_URL}/address/${CONTRACT_ADDRESS}`} target="_blank" rel="noreferrer">{CONTRACT_ADDRESS}</a>}
        <p className="muted">Public reads never ask for a signature.</p>
        {readError && <><p className="error" role="alert">{readError}</p><button type="button" className="secondary" onClick={registry.retry}>Retry connection</button></>}
      </aside>
    </header>
    {LOCAL_TEST && <p className="test-banner">LOCAL INTEGRATION TEST · These transactions use a local EVM, not Sepolia.</p>}
    <nav className="tabs" aria-label="Workspace">
      {[["verify", "Public verification"], ["volunteer", "My service"], ["organization", "Organization"], ["admin", "Administration"]].map(([id, label]) =>
        <button type="button" key={id} aria-current={tab === id ? "page" : undefined} onClick={() => { setTab(id); setListError(""); }}>{label}</button>)}
    </nav>
    <section className="panel wallet-panel">
      <div className="head"><h2>Wallet access</h2><button type="button" onClick={connect}>Connect wallet</button></div>
      <Info label="Account">{wallet || "Not connected"}</Info>
      <Info label="Role">{rolesLoading ? "Checking permissions…" : wallet ? [isAdmin && "Administrator", org && (org.active ? "Active organization" : "Inactive organization"), "Volunteer"].filter(Boolean).join(" · ") : "Public verifier"}</Info>
      {walletError && <p className="error" role="alert">{walletError}</p>}
      {tx && <div className={`transaction ${tx.status === "error" ? "error" : ""}`} role={tx.status === "error" ? "alert" : "status"}>
        <strong>{tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}</strong><p>{tx.message}</p>
        {tx.wallet && <p className="mono">Submitted by {tx.wallet}</p>}
        {tx.hash && (LOCAL_TEST ? <p className="mono">Local transaction {tx.hash}</p> : <a className="mono" href={`${SEPOLIA_EXPLORER_URL}/tx/${tx.hash}`} target="_blank" rel="noreferrer">View transaction {tx.hash}</a>)}
        {tx.results?.map((text) => <p key={text}>{text}</p>)}
        {tx.status === "pending" && <button type="button" className="secondary" onClick={registry.checkPending}>Check receipt</button>}
      </div>}
    </section>

    <section className="panel" id="public-verify" hidden={tab !== "verify"}>
      <div className="section-number">01 / VERIFY</div><h2>Check a service record</h2>
      <p>Enter a record ID. This only reads the blockchain and does not ask for a signature.</p>
      <Form title="Look up record" inputs={[{ name: "recordId", label: "Record ID" }]}
        submit={verifyBusy ? "Reading record…" : "Verify record"} busy={verifyBusy} onSubmit={verify} />
      {verifyError && <p className="error" role="alert">{verifyError}</p>}
      {record && <div className="card">
        <div className="head"><h3>Record #{fmt(record.item.id)}</h3><button type="button" className="secondary" onClick={() => verifyId(record.item.id)}>Refresh record</button></div>
        <p className="muted">Last checked: {record.checkedAt.replace("T", " ").slice(0, 19)} UTC</p>
        <Info label="Current status"><span className={`badge status-${Number(record.item.status)}`}>{RECORD_STATUS[Number(record.item.status)]}</span></Info>
        <p className="record-summary">{Number(record.item.status) === 1 ? "This record is valid on-chain. The issuing organization is responsible for verifying attendance." : "This record is no longer valid. Follow its replacement link if one exists."}</p>
        <Info label="Volunteer">{record.item.volunteer}</Info>
        <Info label="Issuer">{record.item.issuer}</Info>
        <Info label="Organization metadata">{record.metadata[1]}</Info>
        <Info label="Organization active now">{record.organization.active ? "Yes" : "No; past records are separate"}</Info>
        <Info label="Activity ID">{fmt(record.activity.id)}</Info>
        <Info label="Activity metadata">{record.metadata[0]}</Info>
        <Info label="Category">{record.activity.category}</Info>
        <Info label="Approved minutes">{fmt(record.item.approvedMinutes)}</Info>
        <Info label="Service date">{dateLabel(record.item.serviceDate)}</Info>
        <Info label="Issued">{dateLabel(record.item.issuedAt)}</Info>
        <Info label="Claim ID">{fmt(record.item.claimId)}</Info>
        <Info label="Replaces record">{record.item.replacesRecordId > 0n ? <button type="button" className="text-button" onClick={() => verifyId(record.item.replacesRecordId)}>View record #{fmt(record.item.replacesRecordId)}</button> : "Original record"}</Info>
        <Info label="Replacement record">{record.item.replacementRecordId > 0n ? <button type="button" className="text-button" onClick={() => verifyId(record.item.replacementRecordId)}>View record #{fmt(record.item.replacementRecordId)}</button> : "No replacement"}</Info>
        <Info label="Reason hash">{record.item.reasonHash}</Info>
      </div>}
    </section>

    {tab === "admin" && isAdmin && <section className="panel">
      <div className="section-number">04 / ADMINISTRATION</div><h2>Recognized organizations</h2>
      <div className="grid">
        <Form title="Register organization" busy={busy} submit="Register"
          inputs={[{ name: "wallet", label: "Organization wallet" }, { name: "uri", label: "Public HTTPS metadata URL", type: "url" }]}
          onSubmit={submit("registerOrganization", async (f) => {
            if (!isAddress(f.wallet) || f.wallet === ZeroAddress) throw new Error("Invalid organization wallet.");
            const checked = await metadata(f.uri, null, "organization");
            return [f.wallet, f.uri, checked.hash];
          }, "OrganizationRegistered")} />
        <Form title="Change organization status" busy={busy} submit="Update status"
          inputs={[{ name: "wallet", label: "Organization wallet" }, { name: "active", label: "Organization status", options: [["yes", "Active"], ["no", "Inactive"]] }]}
          onSubmit={submit("setOrganizationActive", (f) => {
            if (!isAddress(f.wallet) || !["yes", "no"].includes(f.active.toLowerCase()))
              throw new Error("Enter a valid wallet and yes or no.");
            return [f.wallet, f.active.toLowerCase() === "yes"];
          }, "OrganizationStatusChanged")} />
      </div>
    </section>}

    {tab === "organization" && org && <section className="panel">
      <div className="section-number">03 / ORGANIZATION</div><h2>Organization workspace</h2>
      {!isOrg && <p className="error">This organization is inactive. Existing history remains readable, but new actions are blocked.</p>}
      <Form title="Create activity" busy={busy} disabled={!isOrg} submit="Create activity"
        inputs={[{ name: "uri", label: "Public HTTPS metadata URL", type: "url" },
          { name: "category", label: "Category" }, { name: "start", label: "Start date (UTC)", type: "date" },
          { name: "end", label: "End date (UTC)", type: "date" }]}
        onSubmit={submit("createActivity", async (f) => {
          const start = utcDate(f.start), end = utcDate(f.end);
          if (start > end) throw new Error("Start date is later than end date.");
          if (!f.category.trim()) throw new Error("Enter an activity category.");
          const checked = await metadata(f.uri, null, "activity");
          return [f.uri, checked.hash, f.category.trim(), start, end];
        }, "ActivityCreated")} />
      <div className="head"><h3>My activities and claims</h3><button type="button" onClick={loadActivities} disabled={listBusy}>{listBusy ? "Loading…" : "Load organization history"}</button></div>
      {activities.length === 0 && <p>No activities loaded.</p>}
      {activities.map(({ activity, claims }) => <div className="card" key={fmt(activity.id)}>
        <h3>Activity #{fmt(activity.id)} · {activity.open ? "Open" : "Closed"}</h3>
        <Info label="Category">{activity.category}</Info>
        <Info label="Date window">{dateLabel(activity.serviceStartDate)} to {dateLabel(activity.serviceEndDate)}</Info>
        {activity.open && <button type="button" disabled={busy || !isOrg} onClick={() => send("closeActivity", [activity.id], "ActivityClosed")}>Close activity</button>}
        {claims.length === 0 && <p>No claims.</p>}
        {claims.map((claim) => <div className="claim" key={fmt(claim.id)}>
          <strong>Claim #{fmt(claim.id)} · {CLAIM_STATUS[Number(claim.status)]}</strong>
          <p>{claim.volunteer} · {fmt(claim.claimedMinutes)} requested minutes · {dateLabel(claim.serviceDate)}</p>
          {Number(claim.status) === 1 && <div className="grid">
            <Form title="Approve" busy={busy} disabled={!isOrg} submit="Approve and issue record"
              inputs={[{ name: "approved", label: "Approved minutes", type: "number" }, { name: "note", label: "Non-sensitive review note", optional: true }]}
              onSubmit={submit("approveClaim", (f) => [claim.id, minutes(f.approved), reasonHash(f.note, false)], "ServiceRecordIssued")} />
            <Form title="Reject" busy={busy} disabled={!isOrg} submit="Reject"
              inputs={[{ name: "reason", label: "Non-sensitive reason" }]}
              onSubmit={submit("rejectClaim", (f) => [claim.id, reasonHash(f.reason)], "ServiceClaimReviewed")} />
          </div>}
          {Number(claim.status) === 2 && <p>Approved {fmt(claim.approvedMinutes)} minutes · record #{fmt(claim.recordId)}</p>}
        </div>)}
      </div>)}
      <h3>Issued records</h3>{issued.map((item) => <p key={fmt(item.id)}><button type="button" className="text-button" onClick={() => openRecord(item.id)}>Record #{fmt(item.id)}</button> · {RECORD_STATUS[Number(item.status)]} · {fmt(item.approvedMinutes)} minutes</p>)}
    </section>}

    {tab === "volunteer" && wallet && <section className="panel">
      <div className="section-number">02 / MY SERVICE</div><h2>Your service, recorded</h2>
      <Form title="Check activity" inputs={[{ name: "activityId", label: "Activity ID to inspect" }]} submit="Read activity" onSubmit={previewActivity} />
      {previewError && <p className="error" role="alert">{previewError}</p>}
      {preview && <div className="card"><h3>Activity #{fmt(preview.item.id)}</h3><Info label="Category">{preview.item.category}</Info><Info label="Submissions">{preview.item.open && preview.issuer.active ? "Open" : "Closed or issuer inactive"}</Info><Info label="Date window">{dateLabel(preview.item.serviceStartDate)} to {dateLabel(preview.item.serviceEndDate)}</Info></div>}
      <Form title="Submit service claim" busy={busy} submit="Submit claim transaction"
        inputs={[{ name: "activity", label: "Activity ID" }, { name: "duration", label: "Minutes served", type: "number" },
          { name: "date", label: "Service date (UTC)", type: "date" }, { name: "note", label: "Non-sensitive supporting note", optional: true }]}
        onSubmit={submit("submitServiceClaim", async (f) => {
          const id = positiveId(f.activity), duration = minutes(f.duration), date = utcDate(f.date);
          const activity = await reader.getActivity(id);
          const issuer = await reader.getOrganization(activity.issuer);
          if (!issuer.active) throw new Error("The issuing organization is inactive.");
          if (!activity.open || date < activity.serviceStartDate || date > activity.serviceEndDate ||
              date > BigInt(Math.floor(Date.now() / 1000))) throw new Error("Activity is closed or service date is outside its window.");
          return [id, duration, date, reasonHash(f.note, false)];
        }, "ServiceClaimSubmitted")} />
      <div className="head"><h3>My history</h3><button type="button" onClick={loadHistory} disabled={listBusy}>{listBusy ? "Loading…" : "Load my history"}</button></div>
      {history && <div className="grid">
        <div><h4>Claims</h4>{history.claims.length === 0 ? <p>None</p> : history.claims.map((claim) =>
          <p key={fmt(claim.id)}>#{fmt(claim.id)} · {CLAIM_STATUS[Number(claim.status)]} · {fmt(claim.claimedMinutes)} requested / {fmt(claim.approvedMinutes)} approved minutes{claim.recordId > 0n ? ` · record #${claim.recordId}` : " · no record issued"}</p>)}</div>
        <div><h4>Records</h4>{history.records.length === 0 ? <p>None</p> : history.records.map((item) =>
          <p key={fmt(item.id)}><button type="button" className="text-button" onClick={() => openRecord(item.id)}>Record #{fmt(item.id)}</button> · {RECORD_STATUS[Number(item.status)]} · {fmt(item.approvedMinutes)} minutes · {dateLabel(item.serviceDate)} · replaces #{fmt(item.replacesRecordId)} / replaced by #{fmt(item.replacementRecordId)}</p>)}</div>
      </div>}
    </section>}

    {((tab === "admin" && isAdmin) || (tab === "organization" && isOrg)) && <section className="panel">
      <h2>Manage records</h2>
      <p>Only an active issuer or administrator can manage a valid record. Old records remain readable.</p>
      <div className="grid">
        <Form title="Correct a record" busy={busy} submit="Create linked correction"
          inputs={[{ name: "id", label: "Valid record ID" }, { name: "duration", label: "Corrected minutes", type: "number" },
            { name: "date", label: "Corrected service date (UTC)", type: "date" }, { name: "reason", label: "Non-sensitive reason" }]}
          onSubmit={submit("correctRecord", (f) => [positiveId(f.id), minutes(f.duration), utcDate(f.date), reasonHash(f.reason)], "ServiceRecordCorrected")} />
        <Form title="Revoke a record" busy={busy} submit="Revoke"
          inputs={[{ name: "id", label: "Valid record ID" }, { name: "reason", label: "Non-sensitive reason" }]}
          onSubmit={submit("revokeRecord", (f) => [positiveId(f.id), reasonHash(f.reason)], "ServiceRecordRevoked")} />
      </div>
    </section>}
    {tab !== "verify" && !wallet && <section className="panel empty"><h2>Connect to continue</h2><p>Connect a wallet to submit claims or access your organization's workspace. Public verification stays available without a wallet.</p><button type="button" onClick={connect}>Connect wallet</button></section>}
    {wallet && !rolesLoading && ((tab === "admin" && !isAdmin) || (tab === "organization" && !org)) && <section className="panel empty"><h2>No access for this wallet</h2><p>{tab === "admin" ? "Only the contract administrator can register or deactivate organizations." : "This wallet is not a registered organization. You can still submit claims in My service."}</p></section>}
    {listError && <p className="error" role="alert">{listError}</p>}
    <footer><span>Volunteer Hours Registry · COMP7610</span><p>Records prove issuer wallet actions. Organizations remain responsible for attendance and identity.</p></footer>
  </main>;
}
