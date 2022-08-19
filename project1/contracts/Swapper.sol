// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "./interfaces/IERC20.sol";
import "./interfaces/Uniswap.sol";

contract Swapper {
    uint256 deadline;
    //address of the uniswap v2 router
    address private constant UNISWAP_V2_ROUTER =
        0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;


    // swap function
    function swap(
        address _tokenIn, // _tokenIn is the address of the token that we are trading in for
        address _tokenOut, // _tokenOut is the address of the token we want out of this trade
        uint256 _amountIn, // _amountIn is the amount of tokens we are trading
        address _to,  // _to is the address where we are sending the output token
        uint256 _deadline //_deadline is the time during which the transaction should be executed. The transaction will be expired if the deadline time exceeds.
    ) external {
        // transfer the amount in tokens from msg.sender to this contract
        // _tokenIn address would have the amount present inside _amountIn.
        IERC20(_tokenIn).transferFrom(msg.sender, address(this), _amountIn);

        //by calling IERC20 approve you allow the uniswap contract to spend the tokens in this contract
        IERC20(_tokenIn).approve(UNISWAP_V2_ROUTER, _amountIn);
        address[] memory path;
        path = new address[](2);
        path[0] = _tokenIn; 
        path[1] = _tokenOut; 

        // getAmountsOut is useful for calculating the amount of tokens we should be expecting on doing a swap.
        // It takes an input amount and an array of token addresses.  
        uint256[] memory amountsExpected = IUniswapV2Router(UNISWAP_V2_ROUTER).getAmountsOut(
            _amountIn,
            path
        );
        IUniswapV2Router(UNISWAP_V2_ROUTER).swapExactTokensForTokens(
            amountsExpected[0],
            (amountsExpected[1]*997)/1000, // accpeting a slippage of 1%
            path,
            _to,
            _deadline
        );
    }
}
