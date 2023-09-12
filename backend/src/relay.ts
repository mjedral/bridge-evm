import { getAbiFromJsonFile } from "./helpers/helpers";

const ethers = require("ethers");
require("dotenv").config();

const CONTRACT_PATHS = {
 BesuBridge: '../../json/bridge.json',
 GoerliBridge: '../../json/bridge.json',
 TargetToken: '../../json/targetToken.json',
 SourceToken: '../../json/sourceToken.json'
}

// CONNECT TO BLOCKCHAIN
const goerli_provider = process.env.PROVIDER_GOERLI;
const besu_provider = process.env.PROVIDER_BESU;
const key = process.env.PRIVATE_KEY;

console.log(besu_provider)

// BRIDGE SMART CONTRACTS
const besuAddress = process.env.BESU_SC;
const goerliAddress = process.env.GOERLI_SC;

// TOKEN ADDRESSES
const tokenBesu = process.env.TOKEN_BESU;
const tokenGoerli = process.env.TOKEN_GOERLI;

// THE MAIN FUNCTION
const main = async () => {
  // CONNECT TO Besu admin
  console.log("Connecting to Besu...");
  const besuProvider = new ethers.providers.JsonRpcProvider(besu_provider);
  const besuWallet = new ethers.Wallet(String(key), besuProvider);
  console.log("Connected! \n");

  console.log("Connecting to Goerli testnet...");
  const goerliProvider = new ethers.providers.JsonRpcProvider(goerli_provider);
  const goerliWallet = new ethers.Wallet(String(key), goerliProvider);
  console.log("Connected! \n");

  // CONNECT TO THE BRIDGE SMART CONTRACT ON EACH NETWORK
  console.log("Connecting to Besu bridge...");
  let besuBridge = new ethers.Contract(besuAddress, getAbiFromJsonFile(CONTRACT_PATHS.BesuBridge), besuWallet);
  console.log("Connected! \n");

  console.log("Connecting to Goerli bridge...");
  let goerliBridge = new ethers.Contract(
    goerliAddress,
    getAbiFromJsonFile(CONTRACT_PATHS.GoerliBridge),
    goerliWallet
  );
  console.log("Connected! \n");

  // CONNECT TO THE TOKEN SMART CONTRACT ON EACH NETWORK
  console.log("Connecting to Besu erc-20 token...");
  let besuToken = new ethers.Contract(tokenBesu, getAbiFromJsonFile(CONTRACT_PATHS.SourceToken), besuWallet);
  console.log("Connected! \n");

  console.log("Connecting to Goerli erc-20 token...");
  let goerliToken = new ethers.Contract(
    tokenGoerli,
    getAbiFromJsonFile(CONTRACT_PATHS.TargetToken),
    goerliWallet
  );
  console.log("Connected! \n");

  // SEND TOKENS FROM BESU BRIDGE
  const sendTokensFromBesu = async (address: string, amount: string) => {
    try {
      console.log("Sending from Besu bridge...");
      console.log("To: " + address);
      console.log("Amount: " + amount);

      // Estimate gas limit
      let gasLimit = await besuBridge.estimateGas.sendTokens(address, amount, {
        from: besuWallet.address,
      });

      let tx = await besuBridge.sendTokens(address, amount, {
        from: besuWallet.address,
        gasLimit: gasLimit.toString(),
      });

      tx.wait();

      console.log("Sent!");
    } catch (error) {
      console.log("Error: " + error);
    }
  };

  // SEND TOKENS FROM GOERLI BRIDGE
  const sendTokensFromGoerli = async (address: string, amount: string) => {
    try {
      console.log("Sending from Goerli bridge...");
      console.log("To: " + address);
      console.log("Amount: " + amount);

      // Estimate gas limit
      let gasLimit = await goerliBridge.estimateGas.sendTokens(
        address,
        amount,
        { from: goerliWallet.address }
      );

      let tx = await goerliBridge.sendTokens(address, amount, {
        from: goerliWallet.address,
        gasLimit: gasLimit.toString(),
      });

      tx.wait();

      console.log("Sent!");
    } catch (error) {
      console.log("Error: " + error);
    }
  };

  // LISTEN FOR TRANSFER EVENTS ON BESU
  besuToken.on("Transfer", (from: any, to: any, value: any) => {
    let info = {
      from: from,
      to: to,
      value: value,
    };

    if (String(to) === besuAddress) {
      try {
        sendTokensFromBesu(String(info.from), String(info.value));
      } catch (error) {
        console.log("Error on transfer from besu bridge: " + error);
      }
    }
  });

  // LISTEN FOR TRANSFER EVENTS ON GOERLI
  goerliToken.on("Transfer", (from: any, to: any, value: any) => {
    let info = {
      from: from,
      to: to,
      value: value,
    };

    if (String(to) === goerliAddress) {
      try {
        sendTokensFromGoerli(String(info.from), String(info.value));
      } catch (error) {
        console.log("Error on transfer from besu bridge: " + error);
      }
    }
  });
};

main();
