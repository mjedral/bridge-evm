import { ethers } from "hardhat";
import "dotenv/config";
const {
  TOKEN_BESU,
  TOKEN_GOERLI,
  HARDHAT_ADDRESS
} = process.env;

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("TOKEN", TOKEN_BESU);

  const contract = await ethers.getContractFactory("Bridge");

  const bridge = await contract.deploy(
    HARDHAT_ADDRESS!,
    TOKEN_BESU!
  );

  console.log("Token address:", await bridge.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
