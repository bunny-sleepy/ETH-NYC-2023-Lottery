// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { parseUnits, concat } = require("ethers/lib/utils");
const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
    // 1. Get deployer
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deployer address: ", deployer.address);
    // 2. Deploy the mock USDC
    const MockToken = await hre.ethers.getContractFactory("MockToken");
    let USDC = await MockToken.deploy("USDC", "USDC", 18);
    await USDC.deployed();
    console.log("USDC Address: ", USDC.address);
    // 3. Deploy the randomness oracle
    const RandomnessOracle = await hre.ethers.getContractFactory("RandomnessOracle");
    let oracle = await RandomnessOracle.deploy();
    await oracle.deployed();
    console.log("Oracle Address: ", oracle.address);
    // 4. Deploy the worldid
    const WorldID = await hre.ethers.getContractFactory("MockWorldID");
    let worldId = await WorldID.deploy();
    await worldId.deployed();
    console.log("worldId Address: ", oracle.address);
    // 5. Deploy the lottery
    const Lottery = await hre.ethers.getContractFactory("Lottery");
    let lottery = await Lottery.deploy(USDC.address, oracle.address, worldId.address, "12345", "1");
    await lottery.deployed();
    console.log("Lottery address: ", lottery.address);
    // 6. Deploy a pool
    await lottery.open(5, parseUnits("1", 22));
    await oracle.requestRandomness();
    await oracle.fulfillRandomness("0x06f5010d30d8a51fc7ab9b0e5dd28a439370b3387cec90fc1dddef86dc20d2ae");

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });