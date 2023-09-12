import { getAbiFromJsonFile } from "../helpers/helpers";

const ethers = require("ethers");

async function main() {
    const CONTRACT_PATHS = {
        BesuBridge: '../../json/bridge.json',
        GoerliBridge: '../../json/bridge.json',
        TargetToken: '../../json/targetToken.json',
        SourceToken: '../../../json/sourceToken.json'
    }
    const besu_provider = process.env.PROVIDER_BESU;
    const key = process.env.PRIVATE_KEY;

    const besuProvider = new ethers.providers.JsonRpcProvider(besu_provider);

    const besuWallet = new ethers.Wallet(String(key), besuProvider);

    console.log('Getting the token contract...');

    let besuToken = new ethers.Contract('0x43ca3D2C94be00692D207C6A1e60D8B325c6f12f', getAbiFromJsonFile(CONTRACT_PATHS.SourceToken), besuWallet);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });