//  Importing the Uniswap SDK and ethers library with necessary Uniswap packages
const { ChainId, Fetcher, WETH, Route, Trade, TokenAmount, TradeType } = require ('@uniswap/sdk');
const ethers = require('ethers');  

//  Setting our Ethereum node URL.
const url = 'https://eth-mainnet.g.alchemy.com/v2/X6ZbuunfiCSmLDfVARGxggzu5KAbwy35';

// Instantiating an ethers JsonRpcProvider instance.
const customHttpProvider = new ethers.providers.JsonRpcProvider(url);

// Defining chain id to mainnet.
const chainId = ChainId.MAINNET;

// Specifying token address to DAI
//You can get the address of any ERC20 token from https://etherscan.io/tokens.
const tokenAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F'

//Defining the init variable as an async function.
const init = async () => {
    //  Creating a pointer to the DAI token and fetching the token data using the Fetcher object 
    //by passing chain id, token address, and customHttpProvider as arguments.
	const dai = await Fetcher.fetchTokenData(chainId, tokenAddress, customHttpProvider);

    // Defining our other token Wrapped ether.
	const weth = WETH[chainId];

    //  Instantiating the pair object, 
    //the pair object allows interaction with a specific market, 
    //fetching the pair data of WETH and DAI pair.
	const pair = await Fetcher.fetchPairData(dai, weth, customHttpProvider);

    //  Instantiating the route object and passing pair array and WETH as the input token.
	const route = new Route([pair], weth);

    // Creating a new trade to get the execution price of WETH in DAI, Providing 100 WETH in input with 15 zeros and specifying trade type
	const trade = new Trade(route, new TokenAmount(weth, '100000000000000000'), TradeType.EXACT_INPUT);

    // Getting midprice of WETH in DAI.
    // midprice in the context of Uniswap is the price that reflects the ratio of reserves in one or more pairs. 
    //It also represents the price at which you could theoretically trade
    // a tiny amount (ε) of one token for the other.
	console.log("Mid Price WETH --> DAI:", route.midPrice.toSignificant(6));

    // Getting midprice of DAI in WETH.
	console.log("Mid Price DAI --> WETH:", route.midPrice.invert().toSignificant(6));

    // Printing a dashed line for better output representation.
	console.log("-".repeat(45));

    // Getting the exact execution price of WETH in DAI.

    // Execution price is the ratio of assets sent/received. 
    //The Uniswap swapping of pairs is based on execution price rather than Mid-price.
	console.log("Execution Price WETH --> DAI:", trade.executionPrice.toSignificant(6));

    // Getting midprice of WETH in DAI after the trade.
	console.log("Mid Price after trade WETH --> DAI:", trade.nextMidPrice.toSignificant(6));
}

//  Calling the init function.
init();