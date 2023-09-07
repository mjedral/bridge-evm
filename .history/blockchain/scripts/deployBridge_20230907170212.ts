import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const contract = await ethers.getContractFactory("Bridge");

  const bridge = await contract.deploy(
    "0x6bf310d63b6b8ea41369414bc4f69c290c73c3c8772691e89f447e08410d4ff7",
    "0x8F0AE08A8c1d87cd1FA46AaEcF008edA70101077"
  );

  console.log("Token address:", await bridge.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
