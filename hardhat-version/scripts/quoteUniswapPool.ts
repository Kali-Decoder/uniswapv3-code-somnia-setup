import { ethers } from "hardhat";
import config from "../config";

async function addLiquidityPool() {
  const CONTRACT_NAME = "UniswapV3Quoter";
  const FactoryContractName = 'UniswapV3Factory';
  const TokenName = "MockToken";
  const UTILS_CONTRACT_NAME = "TestUtils";

  const token0 = config.usdtg;
  const token1 = config.wstt;



  const quoteAddress = config.quoterAddress;
  const sender = new ethers.Wallet(
    process.env.DEPLOYER_ACCOUNT_PRIV_KEY as any,
    ethers.provider
  );

  console.log("Deployer address:", sender.address);



  // Get token contracts
  const usdtg = await ethers.getContractAt(TokenName, config.usdtg, sender);
  const wstt = await ethers.getContractAt(TokenName, config.wstt, sender);


  const quoteContract = await ethers.getContractAt(
    CONTRACT_NAME,
    quoteAddress,
    sender
  );


  const utilsContract = await ethers.getContractAt(
    UTILS_CONTRACT_NAME,
    config.testutils,
    sender
  );

  let pool = await utilsContract.deployPool(
    config.factoryAddress,
    token0,token1,3000,5000
  );

  console.log(pool);


 


  
}

async function main() {
  await addLiquidityPool();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
