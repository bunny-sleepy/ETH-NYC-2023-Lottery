require("@nomicfoundation/hardhat-toolbox")

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {

    },
    localhost: {
      url: "http://0.0.0.0:8545",
    }
  },
  solidity: "0.8.13",
}
