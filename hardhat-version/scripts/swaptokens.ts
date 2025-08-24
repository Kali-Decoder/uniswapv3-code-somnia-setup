import { ethers } from "hardhat";
import config from "../config";

async function swapTokens(tokenIn: string, tokenOut: string, amountIn: bigint) {
    const QUOTER_NAME = "UniswapV3Quoter";
    const UTILS_CONTRACT_NAME = "TestUtils";
    const fee = 3000; // 0.3% pool fee
    const testAddress = config.testutils;

    const sender = new ethers.Wallet(
        process.env.DEPLOYER_ACCOUNT_PRIV_KEY as string,
        ethers.provider
    );

    console.log("Deployer address:", sender.address);

    // Attach contracts
    const utilsContract = await ethers.getContractAt(UTILS_CONTRACT_NAME, testAddress, sender);
    const poolInstance = await ethers.getContractAt(
        "UniswapV3Pool",
        config.pools[0]["usdtg/wstt"],
        sender
    );

    // Calculate initial sqrtPrice (example: pool with 5000 price)
    const sqrtPrice = await utilsContract.sqrtP(5000);

    // Build params
    const swapParams = {
        receiver: sender.address,
        zeroForOne: false,
        amountSpecified: amountIn,
        sqrtPriceLimitX96: sqrtPrice,
        data: ""
    };

    console.log(`Swap from ${tokenIn} -> ${tokenOut}:`, swapParams);
    const data = await utilsContract.encodeExtra(tokenIn,tokenOut,sender.address);
    console.log("Encoded data:", data);
    let tx = await poolInstance.swap(
        swapParams.receiver,
        swapParams.zeroForOne,
        swapParams.amountSpecified,
        swapParams.sqrtPriceLimitX96,
        data
    );
    await tx.wait();
    console.log("Transaction sent:", tx.hash);
}

async function main() {
    const tokenA = config.usdtg;
    const tokenB = config.wstt;
    const amount = ethers.parseEther("1"); // 1 token

    console.log("=== TokenA -> TokenB ===");
    await swapTokens(tokenA, tokenB, amount);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
