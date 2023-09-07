import { ethers } from "hardhat";
import "dotenv/config";
const {
  PROVIDER_GOERLI,
  ALCHEMY_GOERLI_PRIVATE_KEY,
  PROVIDER_BESU,
  PRIVATE_KEY,
  TOKEN_GOERLI,
} = process.env;

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const contract = await ethers.getContractFactory("Bridge");

  const bridge = await contract.deploy(
    ALCHEMY_GOERLI_PRIVATE_KEY!,
    TOKEN_GOERLI!
  );

  console.log("Token address:", await bridge.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
