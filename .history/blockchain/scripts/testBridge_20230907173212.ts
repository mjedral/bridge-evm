import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contract with the account:", deployer.address);

  // Adresy admina i tokena, które chcesz przekazać do konstruktora
  const adminAddress = "0xA7e1BDD2EFa42Ab8662858e0de7cf051B5ed3421";
  const tokenAddress = "0x8F0AE08A8c1d87cd1FA46AaEcF008edA70101077";

  const contractFactory = await ethers.getContractFactory("Bridge");

  // Deploy kontraktu
  const bridge = await contractFactory.deploy(adminAddress, tokenAddress);

  console.log("Bridge contract address:", await bridge.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
