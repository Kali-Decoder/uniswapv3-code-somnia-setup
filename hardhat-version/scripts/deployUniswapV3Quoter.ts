import { ethers } from 'hardhat'
import config from '../config';
async function deployUniswapV3Quoter() {
    console.log('Deploying UniswapV3Quoter Contract...');
    const FactoryContractName = 'UniswapV3Quoter';
    const factoryContract = await ethers.deployContract(FactoryContractName, [config.factoryAddress]);
    await factoryContract.waitForDeployment()
    console.log('Deployed UniswapV3Quoter Contract:', await factoryContract.getAddress())
}

async function main() {
    await deployUniswapV3Quoter()
}

main().catch((error) => {
    console.error(error)
    process.exit(1)
})