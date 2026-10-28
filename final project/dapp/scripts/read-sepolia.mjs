import fs from "node:fs";
import { Contract, FetchRequest, JsonRpcProvider } from "ethers";
const address = "0xf1a55E316439a99Cd904E131e0f889E4D36D7DEe";
const artifact = JSON.parse(fs.readFileSync("artifacts/VolunteerHoursRegistry.json"));
const info = JSON.parse(fs.readFileSync("artifacts/build-info/b00404ed0897ce6d8022a3b8c2157d90.json"));
const compiled = info.output.contracts["dapp/contracts/VolunteerHoursRegistry.sol"].VolunteerHoursRegistry.evm.deployedBytecode;
const request = new FetchRequest("https://ethereum-sepolia-rpc.publicnode.com"); request.timeout = 20000;
request.setHeader("User-Agent", "Mozilla/5.0");
const provider = new JsonRpcProvider(request, undefined, { batchMaxCount: 1 });
try {
  const c = new Contract(address, artifact.abi, provider);
  const network = await provider.getNetwork();
  if (network.chainId !== 11155111n) throw new Error("Wrong network");
  const code = await provider.getCode(address);
  let actual = code.slice(2), expected = compiled.object;
  const maskedRanges = Object.values(compiled.immutableReferences).flat();
  for (const { start, length } of maskedRanges) {
    const from = start * 2, to = from + length * 2;
    actual = actual.slice(0, from) + "0".repeat(length * 2) + actual.slice(to);
    expected = expected.slice(0, from) + "0".repeat(length * 2) + expected.slice(to);
  }
  const stripMetadata = (hex) => hex.slice(0, -(parseInt(hex.slice(-4), 16) + 2) * 2);
  const proof = { runtimeExecutableMatchesArtifactExcludingImmutablesAndMetadata: stripMetadata(actual).toLowerCase() === stripMetadata(expected).toLowerCase(), network: "Sepolia", chainId: "11155111", address, observedAt: new Date().toISOString(), block: await provider.getBlockNumber(), runtimeBytecodeMatchesArtifactExcludingImmutables: actual.toLowerCase() === expected.toLowerCase(), maskedImmutableRanges: maskedRanges, administrator: await c.administrator(), organizations: [], activities: [], claims: [], records: [] };
  for (const [counter, getter, field] of [["organizationCount", "getOrganizationById", "organizations"], ["activityCount", "getActivity", "activities"], ["claimCount", "getClaim", "claims"], ["recordCount", "getServiceRecord", "records"]]) {
    const count = await c[counter]();
    for (let id = 1n; id <= count && id <= 20n; id++) proof[field].push((await c[getter](id)).toObject());
  }
  try {
    const logs = [];
    for (let to = proof.block; to > proof.block - 15000; to -= 1000) {
      logs.push(...await provider.getLogs({ address, fromBlock: Math.max(0, to - 999), toBlock: to }));
    }
    logs.sort((a, b) => a.blockNumber - b.blockNumber || a.index - b.index);
    proof.events = logs.map((log) => { const event = c.interface.parseLog(log); return { block: log.blockNumber, tx: log.transactionHash, name: event.name, args: event.args.toArray() }; });
  } catch (error) { proof.eventReadError = error.info?.error?.message || error.error?.message || error.shortMessage || error.message; }
  fs.mkdirSync("../test/acceptance", { recursive: true });
  fs.writeFileSync("../test/acceptance/sepolia-proof.json", JSON.stringify(proof, (_, value) => typeof value === "bigint" ? String(value) : value, 2) + "\n");
  console.log(JSON.stringify({ observedAt: proof.observedAt, block: proof.block, runtimeMatch: proof.runtimeBytecodeMatchesArtifactExcludingImmutables, executableMatch: proof.runtimeExecutableMatchesArtifactExcludingImmutablesAndMetadata, counts: [proof.organizations.length, proof.activities.length, proof.claims.length, proof.records.length], events: proof.events?.length, eventError: proof.eventReadError }, null, 2));
} finally { provider.destroy(); }
