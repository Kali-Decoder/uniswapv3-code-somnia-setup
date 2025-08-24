import { ethers } from "hardhat";
import config from "../config";

async function quoteSwap() {
  const QUOTER_NAME = "UniswapV3Quoter";
  const TokenName = "MockToken";
  const UTILS_CONTRACT_NAME = "TestUtils";

  const tokenIn = config.usdtg;   // input token
  const tokenOut = config.wstt;   // output token
  const fee = 3000;               // 0.3% pool fee
  const amountIn = ethers.parseEther("1"); // amount of tokenIn

  const quoterAddress = config.quoterAddress;
  const testAddress = config.testutils;

  const sender = new ethers.Wallet(
    process.env.DEPLOYER_ACCOUNT_PRIV_KEY as string,
    ethers.provider
  );

  console.log("Deployer address:", sender.address);

  // Attach contracts
  const utilsContract = await ethers.getContractAt(UTILS_CONTRACT_NAME, testAddress, sender);
  const quoter = await ethers.getContractAt(QUOTER_NAME, quoterAddress, sender);

  // Calculate initial sqrtPrice
  const sqrtPrice = await utilsContract.sqrtP(5000);

  // Build params
  const params = {
    tokenIn:tokenOut,
    tokenOut:tokenIn,
    fee,
    amountIn,
    sqrtPriceLimitX96: sqrtPrice,
  };

  console.log("Quote params:", params);

  // === Run quote ===
  try {
    // Because it's not view, we use callStatic to simulate
    const result = await quoter.quoteSingle.staticCall(params);
    console.log("Quote result:", result);
  } catch (error) {
    // If revert contains encoded result
    if (error?.data) {
      const [amountOut, sqrtPriceX96After, tickAfter] = ethers.AbiCoder.defaultAbiCoder().decode(
        ["uint256", "uint160", "int24"],
        error?.data
      );
      console.log("Decoded result:");
      console.log("AmountOut:", amountOut.toString());
      console.log("SqrtPriceX96After:", sqrtPriceX96After.toString());
      console.log("TickAfter:", tickAfter.toString());
    } else {
      console.error("Unexpected error:", error);
    }
  }
}

async function main() {
  await quoteSwap();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
