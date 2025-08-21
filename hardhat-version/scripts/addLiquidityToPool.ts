import { ethers } from "hardhat";
import config from "../config";

async function addLiquidityPool() {
  const CONTRACT_NAME = "UniswapV3Manager";
  const TokenName = "MockToken";
  const UTILS_CONTRACT_NAME = "TestUtils";

  const token1 = config.usdtg;
  const token0 = config.wstt;

  const mintConfig = {
    tokenA: token0,
    tokenB: token1,
    fee: 3000,
    lowerTick: 4545,
    upperTick: 5500,
    amount0Desired: ethers.parseEther("2"),
    amount1Desired: ethers.parseEther("1"),
    amount0Min: 0,
    amount1Min: 0,
  };

  const managerAddress = config.managerAddress;

  const sender = new ethers.Wallet(
    process.env.DEPLOYER_ACCOUNT_PRIV_KEY as any,
    ethers.provider
  );

  console.log("Deployer address:", sender.address);

  // Get token contracts
  const usdtg = await ethers.getContractAt(TokenName, config.usdtg, sender);
  const wstt = await ethers.getContractAt(TokenName, config.wstt, sender);

  // Get manager contract
  const managerContract = await ethers.getContractAt(
    CONTRACT_NAME,
    managerAddress,
    sender
  );

  // Get utils contract
  const utilsContract = await ethers.getContractAt(
    UTILS_CONTRACT_NAME,
    config.testutils,
    sender
  );

  // Check balances before
  const balance0Before = await usdtg.balanceOf(sender.address);
  const balance1Before = await wstt.balanceOf(sender.address);
  console.log("Balances before mint:");
  console.log("USDTG:", ethers.formatEther(balance0Before));
  console.log("WSTT :", ethers.formatEther(balance1Before));

  // Approve tokens
  await (await usdtg.approve(managerAddress, mintConfig.amount0Desired)).wait();
  await (await wstt.approve(managerAddress, mintConfig.amount1Desired)).wait();
  console.log("Approved manager to spend tokens.");

  // Build mint params using utils
  let mintParams = await utilsContract.mintParams(
    mintConfig.tokenA,
    mintConfig.tokenB,
    mintConfig.lowerTick,
    mintConfig.upperTick,
    mintConfig.amount0Desired,
    mintConfig.amount1Desired
  );

  // Call mint with struct
  const tx = await managerContract.mint({
    tokenA: mintParams[0],
    tokenB: mintParams[1],
    fee: mintParams[2],
    lowerTick: mintParams[3],
    upperTick: mintParams[4],
    amount0Desired: mintParams[5],
    amount1Desired: mintParams[6],
    amount0Min: mintParams[7],
    amount1Min: mintParams[8],
  });

  const receipt = await tx.wait();
  console.log("Mint transaction hash:", receipt.hash);

  // Check balances after
  const balance0After = await usdtg.balanceOf(sender.address);
  const balance1After = await wstt.balanceOf(sender.address);

  // Pool Balance 

  const balance0Pool = await usdtg.balanceOf(config.pools[0]["usdtg/wstt"]);
  const balance1Pool = await wstt.balanceOf(config.pools[0]["usdtg/wstt"]);
  console.log("Balances after mint:");
  console.log("USDTG:", ethers.formatEther(balance0After));
  console.log("WSTT :", ethers.formatEther(balance1After));

  console.log("Pool USDTG:", ethers.formatEther(balance0Pool));
  console.log("Pool WSTT :", ethers.formatEther(balance1Pool));
  
}

async function main() {
  await addLiquidityPool();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
