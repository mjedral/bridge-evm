import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contract with the account:", deployer.address);

  // Adresy admina i tokena, które chcesz przekazać do konstruktora
  const adminAddress =
    "0x6bf310d63b6b8ea41369414bc4f69c290c73c3c8772691e89f447e08410d4ff7";
  const tokenAddress = "0x8F0AE08A8c1d87cd1FA46AaEcF008edA70101077";

  const contractFactory = await ethers.getContractFactory("Bridge");

  // Deploy kontraktu
  const bridge = await contractFactory.deploy(adminAddress, tokenAddress);

  console.log("Bridge contract address:", bridge.token);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
