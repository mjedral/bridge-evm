
export async function deploy(_args: any, { ethers, upgrades }: any) {
  let sourceToken: any = {};
  const SourceToken = await ethers.getContractFactory("SourceToken");
  sourceToken = await upgrades.deployProxy(SourceToken, { initializer: "initialize" });
  await sourceToken.waitForDeployment();

  // don't remove this is used by core/entrypoint.sh
  console.log(sourceToken.address);
  console.log(await sourceToken.getAddress())
}

export async function upgrade(
  args: { proxyAddress: string | undefined },
  { ethers, upgrades }: any
) {
  const SourceToken = await ethers.getContractFactory("SourceToken");
  await upgrades.upgradeProxy(args.proxyAddress, SourceToken);

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
