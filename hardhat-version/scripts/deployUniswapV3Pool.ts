import { ethers } from 'hardhat'
import config from '../config';
async function deployUniswapV3Pool() {
    console.log('Deploying UniswapV3Pool Contract...');
    const FactoryContractName = 'UniswapV3Pool';
    const factoryContract = await ethers.deployContract(FactoryContractName, [config.factoryAddress]);
    await factoryContract.waitForDeployment()
    console.log('Deployed UniswapV3Pool Contract:', await factoryContract.getAddress())
}

async function main() {
    await deployUniswapV3Pool()
}

main().catch((error) => {
    console.error(error)
    process.exit(1)
})