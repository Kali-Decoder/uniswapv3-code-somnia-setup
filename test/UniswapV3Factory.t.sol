// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;
import "forge-std/console.sol";
import "forge-std/Test.sol";
import "./TestUtils.sol";

import "../src/interfaces/IERC20.sol";
import "../src/interfaces/IUniswapV3Pool.sol";
import "../src/UniswapV3Factory.sol";

contract UniswapV3FactoryTest is Test, TestUtils {
    IERC20 usdtg;
    IERC20 wstt;
    UniswapV3Factory factory;

    // === Replace with your deployed addresses ===
    address constant USDTG = 0xDa4FDE38bE7a2b959BF46E032ECfA21e64019b76;
    address constant WSTT  = 0xF22eF0085f6511f70b01a68F360dCc56261F768a;
    address constant FACTORY = 0x04Be6308eFA4631Fb9d2609B915Ae8770D8D25F6;

    function setUp() public {
        usdtg = IERC20(USDTG);
        wstt  = IERC20(WSTT);
        factory = UniswapV3Factory(FACTORY); 
    }

    function testCreatePool() public {
        // Deploy pool with real tokens
        address poolAddress = factory.createPool(address(usdtg), address(wstt), 3000);
        IUniswapV3Pool pool = IUniswapV3Pool(poolAddress);
        console.log(poolAddress);
        // ✅ Factory registry checks
        assertEq(factory.pools(address(usdtg), address(wstt), 3000), poolAddress, "invalid pool address registry");
        assertEq(factory.pools(address(wstt), address(usdtg), 3000), poolAddress, "invalid pool address registry reverse");

        // ✅ Pool properties
        assertEq(pool.factory(), address(factory), "invalid factory");
        assertEq(pool.fee(), 3000, "invalid fee");
    }

    function testCreateAlreadyExists() public {
        factory.createPool(address(usdtg), address(wstt), 3000);

        vm.expectRevert(encodeError("PoolAlreadyExists()"));
        factory.createPool(address(usdtg), address(wstt), 3000);
    }

    // You can remove or comment these if you’re only testing with real tokens
    function testCreatePoolUnsupportedFee() public {
        vm.expectRevert(encodeError("UnsupportedFee()"));
        factory.createPool(address(usdtg), address(wstt), 123);
    }

    function testCreateIdenticalTokens() public {
        vm.expectRevert(encodeError("TokensMustBeDifferent()"));
        factory.createPool(address(usdtg), address(usdtg), 3000);
    }

    function testCreateZeroTokenAddress() public {
        vm.expectRevert(encodeError("ZeroAddressNotAllowed()"));
        factory.createPool(address(usdtg), address(0), 3000);
    }
}
