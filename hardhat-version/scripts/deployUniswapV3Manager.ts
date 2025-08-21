import { ethers } from 'hardhat'
import config from '../config';
async function deployUniswapV3Manager() {
    console.log('Deploying UniswapV3Manager Contract...');
    const FactoryContractName = 'UniswapV3Manager';
    const factoryContract = await ethers.deployContract(FactoryContractName, [config.factoryAddress]);
    await factoryContract.waitForDeployment()
    console.log('Deployed UniswapV3Manager Contract:', await factoryContract.getAddress())
}

async function main() {
    await deployUniswapV3Manager()
}

main().catch((error) => {
    console.error(error)
    process.exit(1)
})