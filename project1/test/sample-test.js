const { BigNumber } = require("@ethersproject/bignumber");
const { expect } = require("chai");
const { ethers } = require("hardhat");

// const IERC20ABI = ("../artifacts/contracts/interfaces/IERC20.sol/IERC20.json");
const ERC20ABI = require("@uniswap/v2-core/build/ERC20.json").abi;

describe("Test Swapper", function () {

    // DAIAddress and WETHAddress are the addresses for Dai Contract and WETH Contract,
    // respectively, which will be used in the trading
    const DAIAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    const WETHAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

    // MyAddress is the address in which the amount will be traded
    // DAIHolder is the address which we are going to impersonate.
    const MyAddress = "0x20497F37a8169c8C9fA09411F8c2CFB7c90dE5d1";
    const DAIHolder = "0x5d38b4e4783e34e2301a2a36c39a03c45798c4dd";

    // before writing the test script, we will deploy the letUsSwap smart contract. 
    let TestSwapContract;

    beforeEach(async () => {
        const TestSwapFactory = await ethers.getContractFactory("Swapper");
        TestSwapContract = await TestSwapFactory.deploy();
        await TestSwapContract.deployed();
    })

    it("should swap", async () => {
        // impersonate acc
        await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [DAIHolder],
        });
        const impersonateSigner = await ethers.getSigner(DAIHolder);

        // DAI contract
        const DAIContract = new ethers.Contract(DAIAddress, ERC20ABI, impersonateSigner)
        const DAIHolderBalance = await DAIContract.balanceOf(impersonateSigner.address)
        await DAIContract.approve(TestSwapContract.address, DAIHolderBalance)

        // getting my initial DAI balance
        const WETHContract = new ethers.Contract(WETHAddress, ERC20ABI, impersonateSigner)
        const myBalance = await WETHContract.balanceOf(MyAddress);
        console.log("Initial Balance:", ethers.utils.formatUnits(myBalance.toString()));

        // getting current timestamp
        const latestBlock = await ethers.provider.getBlockNumber();
        const timestamp = (await ethers.provider.getBlock(latestBlock)).timestamp;

        await TestSwapContract.connect(impersonateSigner).swap(
            DAIAddress,
            WETHAddress,
            DAIHolderBalance,
            MyAddress,
            timestamp + 200 // adding 200 seconds to the current blocktime
        )



        //check the balance of our account after the execution of the swap function.
        const myBalance_updated = await WETHContract.balanceOf(MyAddress);
        console.log("Balance after Swap:", ethers.utils.formatUnits(myBalance_updated.toString()));
        const DAIHolderBalance_updated = await DAIContract.balanceOf(impersonateSigner.address);
        // check whether the transaction was true or not!
        expect(DAIHolderBalance_updated.eq(BigNumber.from(0))).to.be.true
        expect(myBalance_updated.gt(myBalance)).to.be.true;
    })
})
