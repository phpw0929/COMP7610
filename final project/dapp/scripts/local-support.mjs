import fs from "node:fs";
import ganache from "ganache";
import solc from "solc";
import { ContractFactory, JsonRpcProvider } from "ethers";

export function compileLocal() {
  const source = fs.readFileSync(new URL("../contracts/VolunteerHoursRegistry.sol", import.meta.url), "utf8");
  const input = { language: "Solidity", sources: { "VolunteerHoursRegistry.sol": { content: source } },
    settings: { evmVersion: "shanghai", optimizer: { enabled: false }, outputSelection: { "*": { "*": ["abi", "evm.bytecode"] } } } };
  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  const errors = output.errors?.filter((error) => error.severity === "error") || [];
  if (errors.length) throw new Error(errors.map((error) => error.formattedMessage).join("\n"));
  return { ...output.contracts["VolunteerHoursRegistry.sol"].VolunteerHoursRegistry, compiler: solc.version() };
}

export async function startLocal(port = 0) {
  const server = ganache.server({ logging: { quiet: true }, wallet: { totalAccounts: 4, defaultBalance: 100 }, chain: { chainId: 31337, hardfork: "shanghai" } });
  await server.listen(port, "127.0.0.1");
  const rpc = `http://127.0.0.1:${server.address().port}`;
  const provider = new JsonRpcProvider(rpc, undefined, { batchMaxCount: 1 });
  provider.pollingInterval = 50;
  const signers = await Promise.all([0, 1, 2, 3].map((i) => provider.getSigner(i)));
  const accounts = await Promise.all(signers.map((signer) => signer.getAddress()));
  const compiled = compileLocal();
  const contract = await new ContractFactory(compiled.abi, compiled.evm.bytecode.object, signers[0]).deploy();
  const deployment = await contract.deploymentTransaction().wait();
  return { server, provider, signers, accounts, contract, deployment, compiler: compiled.compiler, rpc,
    async close() { provider.destroy(); await server.close(); } };
}
