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
  console.log("AL", ALCHEMY_GOERLI_PRIVATE_KEY);
  console.log("TOKEN", TOKEN_GOERLI);

  const contract = await ethers.getContractFactory("Bridge");

  const bridge = await contract.deploy(
    `0x${ALCHEMY_GOERLI_PRIVATE_KEY!}`,
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
