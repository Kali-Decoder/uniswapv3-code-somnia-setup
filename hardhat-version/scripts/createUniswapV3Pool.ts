import { ethers } from "hardhat";
import config from "../config";
async function createPool() {
  const CONTRACT_NAME = "UniswapV3Factory";
  const token0 = config.nia;
  const token1 = config.wstt;
  const factory_address = config.factoryAddress
  const sender = new ethers.Wallet(
    process.env.DEPLOYER_ACCOUNT_PRIV_KEY as any,
    ethers.provider
  );

  console.log("Deployer address:", sender.address);
  console.log("Deploy Pool on somnia");
  const factoryContract = await ethers.getContractAt(
    CONTRACT_NAME,
    factory_address,
    sender
  );
  const tx = await factoryContract.createPool(
    token0,
    token1,
    3000
  );
  await tx.wait();
  console.log("Pool Created Successfully:", tx.hash);
}

async function main() {
  await createPool();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});