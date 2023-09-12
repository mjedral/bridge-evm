const ethers = require("hardhat");

async function main() {
    console.log('Getting the token contract...');
    const contractAddress = '0x43ca3D2C94be00692D207C6A1e60D8B325c6f12f';
    const sourceToken = await ethers.getContractAt('SourceToken', contractAddress);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });