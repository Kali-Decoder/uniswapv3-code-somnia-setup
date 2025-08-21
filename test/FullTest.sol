// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;
import "forge-std/console.sol";
import "forge-std/Test.sol";
import "./ERC20Mintable.sol";
import "./TestUtils.sol";
import "forge-std/console.sol";
import "../src/interfaces/IUniswapV3Pool.sol";
import "../src/UniswapV3Factory.sol";
import "../src/UniswapV3Pool.sol";
import "../src/UniswapV3Manager.sol";
import "../src/UniswapV3Quoter.sol";

contract FullTest is Test, TestUtils {
    ERC20Mintable weth;
    ERC20Mintable usdc;
    ERC20Mintable uni;
    UniswapV3Factory factory;
    UniswapV3Manager manager;
    UniswapV3Quoter quoter;
    UniswapV3Pool wethUSDC;
    address deployer;
    bytes extra;

    function setUp() public {
        uint256 privateKey = vm.envUint("PRIVATE_KEY"); 
        deployer = vm.addr(privateKey);

        weth = new ERC20Mintable("Ether", "ETH", 18);
        usdc = new ERC20Mintable("USDC", "USDC", 18);
        uni  = new ERC20Mintable("Uniswap Coin", "UNI", 18);

        // Mint tokens
        weth.mint(deployer, 100 ether);
        usdc.mint(deployer, 100 ether);
        uni.mint(deployer, 100 ether);

        // Deploy infra
        factory = new UniswapV3Factory();
        manager = new UniswapV3Manager(address(factory));
        quoter = new UniswapV3Quoter(address(factory));

        // Deploy pool initialized near price ~5000
        wethUSDC = deployPool(factory, address(weth), address(usdc), 3000, 5000);
        console.log(address(wethUSDC));

        // Approvals
        vm.startPrank(deployer);
        weth.approve(address(manager), 100 ether);
        usdc.approve(address(manager), 100 ether);
        uni.approve(address(manager), 100 ether);
        extra = encodeExtra(address(weth), address(usdc), deployer);
        vm.stopPrank();
    }

    function testFullScript() public {
        vm.startPrank(deployer);

        // Get current tick from pool
        (
            uint160 sqrtPriceX96,
            int24 tick,
            uint16 observationIndex,
            uint16 observationCardinality,
            uint16 observationCardinalityNext
        ) = wethUSDC.slot0();

     
       

        // Mint liquidity +/- 1000 ticks around current price
        manager.mint(
            IUniswapV3Manager.MintParams({
                tokenA: address(weth),
                tokenB: address(usdc),
                fee: 3000,
                lowerTick: 84120,
                upperTick: 86220,
                amount0Desired: 10 ether,
                amount1Desired: 10 ether,
                amount0Min: 0,
                amount1Min: 0
            })
        );

      

        uint bal0 = weth.balanceOf(address(wethUSDC));
        uint bal1 = usdc.balanceOf(address(wethUSDC));


        // Quote swap
        (uint256 amountOut, uint160 sqrtPriceX96After, int24 tickAfter) = quoter
            .quoteSingle(
                UniswapV3Quoter.QuoteSingleParams({
                    tokenIn: address(weth),
                    tokenOut: address(usdc),
                    fee: 3000,
                    amountIn: 1 ether,
                    sqrtPriceLimitX96: 0
                })
            );
        uint256 swapAmount = 1 ether;
        (int256 amount0Delta, int256 amount1Delta) = wethUSDC.swap(
            deployer,
            false,
            swapAmount,
            sqrtP(5000),
            extra
        );

        vm.stopPrank();
        // console.log("Quote amountOut:", amountOut);
        // console.log("Next sqrtPriceX96:", sqrtPriceX96After);
        // console.log("Next tick:", tickAfter);
    }
}
