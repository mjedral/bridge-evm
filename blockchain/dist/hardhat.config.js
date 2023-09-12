"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("hardhat/config");
const task_names_1 = require("hardhat/builtin-tasks/task-names");
const path_1 = require("path");
require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");
const deploy_1 = require("./scripts/deploy");
require("dotenv/config");
const SOLC_VERSION = "0.8.17";
const { PROVIDER_GOERLI, ALCHEMY_GOERLI_PRIVATE_KEY, PROVIDER_BESU } = process.env;
console.log("provider goerli", PROVIDER_GOERLI);
(0, config_1.task)("deploy", "Deploy plcoin smart contract with proxy").setAction(deploy_1.deploy);
(0, config_1.task)("upgrade", "Upgrade plcoin smart contract implementation")
    .addParam("proxyAddress", "Address of proxy contract")
    .setAction(deploy_1.upgrade);
(0, config_1.task)("deploy-or-upgrade", "Upgrade contract if proxyAddress is passed, else update contract")
    .addOptionalPositionalParam("proxyAddress", "Address of proxy contract")
    .setAction(deploy_1.deployOrUpgrade);
(0, config_1.task)("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();
    for (const account of accounts) {
        console.log(account.address);
    }
});
(0, config_1.subtask)(task_names_1.TASK_COMPILE_SOLIDITY_GET_SOLC_BUILD, async (args, _env, runSuper) => {
    if (args.solcVersion === SOLC_VERSION) {
        const compilerPath = (0, path_1.resolve)(__dirname, "node_modules/solc/soljson.js");
        return {
            compilerPath,
            isSolcJs: true,
            version: args.solcVersion,
            longVersion: "0.8.17+commit.8df45f5f.Emscripten.clang",
        };
    }
    return runSuper();
});
function getAdminSk() {
    const sk = process.env["TEST_ADMIN_SK"];
    // default hard hat node admin address
    return (sk ?? "0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e");
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
const config = {
    solidity: SOLC_VERSION,
    networks: {
        localhost: {
            url: PROVIDER_BESU,
            accounts: [getAdminSk()],
        },
        goerli: {
            url: PROVIDER_GOERLI,
            accounts: [ALCHEMY_GOERLI_PRIVATE_KEY],
        },
        besu: getBesuDevNetwork(),
        // hardhat: {
        //   forking: {
        //     url: PROVIDER_BESU!,
        //   },
        // },
    },
};
exports.default = config;
