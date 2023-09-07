
export async function deploy(_args: any, { ethers, upgrades }: any) {
  let targetToken: any = {};
  const TargetToken = await ethers.getContractFactory("TargetToken");
  targetToken = await upgrades.deployProxy(TargetToken, { initializer: "initialize" });
  await targetToken.waitForDeployment();

  // don't remove this is used by core/entrypoint.sh
  console.log(targetToken.address);
  console.log(await targetToken.getAddress())
}

export async function upgrade(
  args: { proxyAddress: string | undefined },
  { ethers, upgrades }: any
) {
  const TargetToken = await ethers.getContractFactory("TargetToken");
  await upgrades.upgradeProxy(args.proxyAddress, TargetToken);

  // don't remove this is used by core/entrypoint.sh
  console.log(args.proxyAddress);
}

export async function deployOrUpgrade(
  args: { proxyAddress?: string },
  { ethers, upgrades }: any
) {
  if (args.proxyAddress !== null && args.proxyAddress !== undefined && args.proxyAddress !== "") {
    await upgrade({ proxyAddress: args.proxyAddress }, { ethers, upgrades });
  } else {
    await deploy(args, { ethers, upgrades });
  }
}
