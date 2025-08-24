import { ethers } from "hardhat";
import config from "../config";

async function createPool() {
  const CONTRACT_NAME = "UniswapV3Factory";
  const UTILS_CONTRACT_NAME = "TestUtils";
  const token0 = config.usdtg;
  const token1 = config.wstt;
  const factoryAddress = config.factoryAddress;
  const fee = 3000;

  const sender = new ethers.Wallet(
    process.env.DEPLOYER_ACCOUNT_PRIV_KEY as string,
    ethers.provider
  );

  console.log("Deployer address:", sender.address);
  console.log("Checking Pool on Somnia...");

  const factoryContract = await ethers.getContractAt(
    CONTRACT_NAME,
    factoryAddress,
    sender
  );

  const utilsContract = await ethers.getContractAt(UTILS_CONTRACT_NAME, config.testutils, sender);

  // check if pool exists first
  const existingPool = await factoryContract.pools(token0, token1, fee);
  if (existingPool !== ethers.ZeroAddress) {
    console.log(`✅ Pool already exists at: ${existingPool}`);
    const poolInstance = await ethers.getContractAt(
      "UniswapV3Pool",
      existingPool,
      sender
    );
    let sqrtPrice = await utilsContract.sqrtP(5000);
    console.log("Initializing pool with sqrtPrice:", sqrtPrice.toString());
    let tx = await poolInstance.initialize(sqrtPrice);
    await tx.wait();
    console.log("Transaction sent:", tx.hash);
    return;
  }

  console.log("⏳ Pool not found, creating new pool...");

  // create the pool
  const tx = await factoryContract.createPool(token0, token1, fee);
  console.log("Transaction sent:", tx.hash);

  const receipt = await tx.wait();
  console.log("📦 Tx confirmed in block:", receipt.blockNumber);

  // confirm pool address from mapping
  const poolAddress = await factoryContract.pools(token0, token1, fee);
  console.log("🎉 New Pool Address:", poolAddress);

  const poolInstance = await ethers.getContractAt(
    "UniswapV3Pool",
    existingPool,
    sender
  );
  let sqrtPrice = await utilsContract.sqrtP(5000);
  console.log("Initializing pool with sqrtPrice:", sqrtPrice.toString());
  let poolTx = await poolInstance.initialize(sqrtPrice);
  await poolTx.wait();
}

async function main() {
  await createPool();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
