// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;

import "forge-std/console.sol";
import "forge-std/Script.sol";
import "../src/interfaces/IERC20.sol";
import "../src/interfaces/IUniswapV3Manager.sol";
import "../src/interfaces/IUniswapV3Pool.sol";
import "../src/lib/FixedPoint96.sol";
import "../src/lib/Math.sol";
import "../src/UniswapV3Factory.sol";
import "../src/UniswapV3Manager.sol";
import "../src/UniswapV3Pool.sol";
import "../src/UniswapV3Quoter.sol";
import "../test/TestUtils.sol";



contract PoolDeployer is Script, TestUtils {
    address public factoryaddress = 0x04Be6308eFA4631Fb9d2609B915Ae8770D8D25F6; 
    address constant USDTG  = 0xDa4FDE38bE7a2b959BF46E032ECfA21e64019b76;
    address constant WSTT   = 0xF22eF0085f6511f70b01a68F360dCc56261F768a;
    address constant PUMPAZ = 0x4eF3C7cd01a7d2FB9E34d6116DdcB9578E8f5d58;
    address constant NIA    = 0xF2F773753cEbEFaF9b68b841d80C083b18C69311;
    address constant CHECK  = 0xA356306eEd1Ec9b1b9cdAed37bb7715787ae08A8;   
    function run() public {
       uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerKey);
        console.log("Deployer:", msg.sender);
        UniswapV3Factory factory = UniswapV3Factory(factoryaddress);
        UniswapV3Pool poolUsdtgWstt = deployPool(
            factory,
            USDTG,
            WSTT,
            3000, // fee
            1     // sqrtPriceX96 (initial price)
        );

               vm.stopBroadcast();

          console.log("USDTG/WSTT pool:", address(poolUsdtgWstt));
    }
    
}