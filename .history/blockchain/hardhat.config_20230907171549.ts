import { HardhatUserConfig, subtask, task } from "hardhat/config";
import { TASK_COMPILE_SOLIDITY_GET_SOLC_BUILD } from "hardhat/builtin-tasks/task-names";
import { resolve } from "path";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import { deploy, upgrade, deployOrUpgrade } from "./scripts/deploy";
import "dotenv/config";

const SOLC_VERSION = "0.8.17";
const { PROVIDER_GOERLI, ALCHEMY_GOERLI_PRIVATE_KEY, PROVIDER_BESU } =
  process.env;

console.log("provider goerli", PROVIDER_GOERLI);

task("deploy", "Deploy plcoin smart contract with proxy").setAction(deploy);

task("upgrade", "Upgrade plcoin smart contract implementation")
  .addParam("proxyAddress", "Address of proxy contract")
  .setAction(upgrade);

task(
  "deploy-or-upgrade",
  "Upgrade contract if proxyAddress is passed, else update contract"
)
  .addOptionalPositionalParam("proxyAddress", "Address of proxy contract")
  .setAction(deployOrUpgrade);

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

subtask(
  TASK_COMPILE_SOLIDITY_GET_SOLC_BUILD,
  async (args: Record<string, string>, _env, runSuper) => {
    if (args.solcVersion === SOLC_VERSION) {
      const compilerPath = resolve(__dirname, "node_modules/solc/soljson.js");

      return {
        compilerPath,
        isSolcJs: true,
        version: args.solcVersion,
        longVersion: "0.8.17+commit.8df45f5f.Emscripten.clang",
      };
    }

    return runSuper();
  }
);

function getAdminSk(): string {
  const sk = process.env["PLCOIN_ADMIN_SK"];
  // default hard hat node admin address
  return (
    sk ?? "0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e"
  );
}

function getBesuDevNetwork() {
  const accounts = [getAdminSk()];
  const url = process.env["BESU_NODE_URL"] ?? "http://example.com";

  return {
    url: url,
    accounts: accounts,
    httpHeaders: { Authorization: `Bearer ${process.env.BESU_JWT}` },
    chainId: 1337,
    gasPrice: 0,
  };
}

const config: HardhatUserConfig = {
  solidity: SOLC_VERSION,
  networks: {
    localhost: {
      url: PROVIDER_BESU,
      accounts: [getAdminSk()],
    },
    goerli: {
      url: PROVIDER_GOERLI,
      accounts: [ALCHEMY_GOERLI_PRIVATE_KEY!],
    },
    besu: getBesuDevNetwork(),
    hardhat: {
      forking: {
        url: PROVIDER_BESU!,
      },
    },
  },
};

export default config;
