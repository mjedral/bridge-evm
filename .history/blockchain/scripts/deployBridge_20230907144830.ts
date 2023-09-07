import { ethers } from "hardhat";
import "dotenv/config";

const { PRIVATE_KEY } = process.env;

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const contract = await ethers.getContractFactory("Bridge");

  const bridge = await contract.deploy(
    PRIVATE_KEY,
    0xef11d1c2aa48826d4c41e54ab82d1ff5ad8a64ca
  );

  console.log("Token address:", await bridge.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
