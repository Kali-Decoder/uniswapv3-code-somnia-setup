import { ethers } from 'hardhat'

async function deployUniswapV3Factory() {
    console.log('Deploying Factory Contract...');
    const FactoryContractName = 'UniswapV3Factory';
    const factoryContract = await ethers.deployContract(FactoryContractName, [])
    await factoryContract.waitForDeployment()
    console.log('Deployed Factory Contract:', await factoryContract.getAddress())
}

async function main() {
    await deployUniswapV3Factory()
}

main().catch((error) => {
    console.error(error)
    process.exit(1)
})