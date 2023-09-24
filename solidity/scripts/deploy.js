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
    console.log("WorldId Address: ", worldId.address);
    // 5. Deploy the VDF
    const VDF = await hre.ethers.getContractFactory("VDFVerifier");
    let vdf = await VDF.deploy();
    await vdf.deployed();
    console.log("VDF Address: ", vdf.address);
    // 6. Deploy the lottery
    const Lottery = await hre.ethers.getContractFactory("Lottery");
    let appId = "app_staging_4173bcfe98a46030397ddd567db456b5";
    let appAction = "register";
    let lottery = await Lottery.deploy(USDC.address, oracle.address, vdf.address, worldId.address, appId, appAction, deployer.address);
    await lottery.deployed();
    console.log("Lottery address: ", lottery.address);
    // 6. Deploy a pool
    await USDC.approve(lottery.address, parseUnits("1", 25));
    await lottery.open(5, parseUnits("1", 22));
    await oracle.requestRandomness();
    await oracle.fulfillRandomness("0x06f5010d30d8a51fc7ab9b0e5dd28a439370b3387cec90fc1dddef86dc20d2ae");
    // TEST: register
    // let worldIdInputs = [deployer.address, 0, 0, [0, 0, 0, 0, 0, 0, 0, 0]];
    // let vdfInputs = [
    //   // input random / g
    //   '0x194B4753D92469B4EC1C01AD36C38D53C75F32701B148D215D49A292284D9046',
    //   // y
    //   '0x30D364E0C51908B61E5CCBD924A27D1CE16B286038F5FD2052AAA9D29E146A3BE2261E64F487A063F9152DFE67259BF6B083AA08620FBD96D21F06AAF22BA3BF3CAB3AC4C95C3C10D440DFEF38DA3231E25FAEA7094BEA2E6ED28FA7C6EB16B88E5B16E17B876ABA9A397A18D01AA8A53144E0A47F442AE5A2074420CF5CF2C8C79343FF1ABF17F0AB24D77C428923781CDD08320DC269A2D9817F057BC0424A81C9CF0342D65895767541DC4F658074B78E48AB9B62B4AF6C676B1A0B6B197703838D99E41502010FD7A60D7E66447CF2EFC88F9ED57A3CC048860713D11DBE260DDF8A8BCB397B06C898CA90871481AB1713439021D78B19E4B0D26DDB88DC',
    //   // pi
    //   '0x4EA5F2F9B56E43F79F52199F6E01195E48844600D4CEA0215B78982702091462B70D9601D6F5EBF78EF2EDE8814F8F3D5C36C718559F658ADE8B3BBF37E7D2FA23A96F2E7F9EACC70C8C3678ED7C36E419F58A1E77EDA6BCF6A811D5CF021E24870FDD027351A93861BD69AA12CEF59AAF4CAD912733E5D84F292BF062E2530F24602A314FA7CE20D77843FD7CE02F43A721EA7245395CB25F99980DF6A64CCD2B2FF92CC96F93FEE9BB2F7FC1F0F11E39F3706CFF772008129A9601421BBB6F4FED13AB2F7CC401959C5EA6AC7E47B230C66E1730521AD8BDF68C9822F4970925A42A74797EED58CC845FD77DB63517368011982D424DABC07D211890D41124',
    //   // iterations / t
    //   20000000000,
    //   // prime / l
    //   '0xBD63097802DC383264E04E795B649A4B50F10B7D9A6023EAC74B6DA9D49CB42D'
    // ];
    // await lottery.register(0, worldIdInputs, vdfInputs);
    // TEST: draw
    // await lottery.draw(0);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });