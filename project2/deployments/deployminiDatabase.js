const main = async () => {

    const [deployer] = await ethers.getSigners();
    console.log(`Address deploying the contract --> ${deployer.address}`);

    const helloFactory = await ethers.getContractFactory("miniDatabase");
    const contract = await helloFactory.deploy();

    console.log(`Hello contract address --> ${contract.address}`);
}
// 0x65b4744E5eA68A92B04507C82F52b9028fcfb191
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });