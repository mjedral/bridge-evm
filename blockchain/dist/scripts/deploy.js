"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployOrUpgrade = exports.upgrade = exports.deploy = void 0;
async function deploy(_args, { ethers, upgrades }) {
    let sourceToken = {};
    const SourceToken = await ethers.getContractFactory("SourceToken");
    sourceToken = await upgrades.deployProxy(SourceToken, { initializer: "initialize" });
    await sourceToken.waitForDeployment();
    // don't remove this is used by core/entrypoint.sh
    console.log(sourceToken.address);
    console.log(await sourceToken.getAddress());
}
exports.deploy = deploy;
async function upgrade(args, { ethers, upgrades }) {
    const SourceToken = await ethers.getContractFactory("SourceToken");
    await upgrades.upgradeProxy(args.proxyAddress, SourceToken);
    // don't remove this is used by core/entrypoint.sh
    console.log(args.proxyAddress);
}
exports.upgrade = upgrade;
async function deployOrUpgrade(args, { ethers, upgrades }) {
    if (args.proxyAddress !== null && args.proxyAddress !== undefined && args.proxyAddress !== "") {
        await upgrade({ proxyAddress: args.proxyAddress }, { ethers, upgrades });
    }
    else {
        await deploy(args, { ethers, upgrades });
    }
}
exports.deployOrUpgrade = deployOrUpgrade;
