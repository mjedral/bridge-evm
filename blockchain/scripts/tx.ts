import { ethers } from "ethers";
import { SourceToken, SourceToken__factory } from "../typechain-types";

const { ALCHEMY_GOERLI_PRIVATE_KEY, TOKEN_GOERLI, PROVIDER_GOERLI } =
  process.env;

const contract = require("../artifacts/contracts/SourceToken/SourceToken.sol/SourceToken.json");

// provider - Alchemy
const alchemyProvider = new ethers.providers.AlchemyProvider(
  "goerli",
  PROVIDER_GOERLI
);

// signer - you
const signer = new ethers.Wallet(ALCHEMY_GOERLI_PRIVATE_KEY!, alchemyProvider);

// contract instance
const sourceTokenContract = new ethers.Contract(
  TOKEN_GOERLI!,
  contract.abi,
  signer
);

async function main() {
  // get the contract instance
  //   const contract: SourceToken = await ethers.getContractAt(
  //     "SourceToken", // name of the contract
  //     "0xC469e7aE4aD962c30c7111dc580B4adbc7E914DD" // deployed contract address
  //   );

  // call a simple view function `name` on the contract (no tx required)
  //   const name = await contract.decimals();
  //   console.log("Name:", name);
  //   await sourceTokenContract.mint(
  //     "0xA7e1BDD2EFa42Ab8662858e0de7cf051B5ed3421",
  //     100,
  //     {
  //       maxFeePerGas: 1000000,
  //       maxPriorityFeePerGas: 100000,
  //     }
  //   );

  await sourceTokenContract.initialize();

  console.log(await sourceTokenContract.owner());

  //   const receipt = await sourceTokenContract.wait();

  //   console.log(receipt);

  // send a tx from acc1, calling the `mint` function on the contract
  // with the to address = acc1.address and amount to be minted = 1
  //   const tx = await sourceTokenContract.connect(
  //     "0x8F0AE08A8c1d87cd1FA46AaEcF008edA70101077"
  //   );

  //   // wait for the tx to be processed, then log the receipt
  //   const receipt = await tx.wait();
  //   console.log("Tx receipt:", receipt);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
