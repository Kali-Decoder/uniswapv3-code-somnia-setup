// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;

import "forge-std/console.sol";
import "forge-std/Script.sol";
import "../src/interfaces/IERC20.sol";
import "../src/interfaces/IUniswapV3Manager.sol";
import "../src/lib/FixedPoint96.sol";
import "../src/lib/Math.sol";
import "../src/UniswapV3Factory.sol";
import "../src/UniswapV3Manager.sol";
import "../src/UniswapV3Pool.sol";
import "../src/UniswapV3Quoter.sol";
import "../test/TestUtils.sol";

contract DeployDevelopment is Script, TestUtils {
    function run() public {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerKey);

        console.log("Deployer",msg.sender);

        // === USE EXISTING TOKENS VIA IERC20 ===
        IERC20 usdtg  = IERC20(0xDa4FDE38bE7a2b959BF46E032ECfA21e64019b76);
        IERC20 wstt   = IERC20(0xF22eF0085f6511f70b01a68F360dCc56261F768a);
        IERC20 pumpaz = IERC20(0x4eF3C7cd01a7d2FB9E34d6116DdcB9578E8f5d58);
        IERC20 nia    = IERC20(0xF2F773753cEbEFaF9b68b841d80C083b18C69311);
        IERC20 check  = IERC20(0xA356306eEd1Ec9b1b9cdAed37bb7715787ae08A8);

        // === DEPLOY UNISWAP CONTRACTS ===
        UniswapV3Factory factory = new UniswapV3Factory();
        UniswapV3Manager manager = new UniswapV3Manager(address(factory));
        UniswapV3Quoter quoter = new UniswapV3Quoter(address(factory));

        // === CREATE POOLS WITH EXISTING TOKENS ===
        // Example pools (you can adjust fee tier + sqrtPriceX96 init)
        UniswapV3Pool poolUsdtgWstt = deployPool(
            factory,
            address(usdtg),
            address(wstt),
            3000, // fee
            1     // sqrtPriceX96 (initial price)
        );

        UniswapV3Pool poolPumpazNia = deployPool(
            factory,
            address(pumpaz),
            address(nia),
            3000,
            1
        );

        UniswapV3Pool poolCheckUsdtg = deployPool(
            factory,
            address(check),
            address(usdtg),
            3000,
            1
        );

        vm.stopBroadcast();

        // === LOG ADDRESSES ===
        console.log("Factory address", address(factory));
        console.log("Manager address", address(manager));
        console.log("Quoter address", address(quoter));

        console.log("USDTG/WSTT pool:", address(poolUsdtgWstt));
        console.log("PUMPAZ/NIA pool:", address(poolPumpazNia));
        console.log("CHECK/USDTG pool:", address(poolCheckUsdtg));
    }
}