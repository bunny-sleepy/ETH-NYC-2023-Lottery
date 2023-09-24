require("@nomicfoundation/hardhat-toolbox")

const privKey = ""

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {

    },
    localhost: {
      url: "http://0.0.0.0:8545",
    },
    arbitrumTest: {
      url: "https://goerli-rollup.arbitrum.io/rpc",
      accounts: [privKey]
    },
    lineaTest: {
      url: "https://rpc.goerli.linea.build",
      accounts: [privKey]
    },
    gnosisTest: {
      url: "https://rpc.chiadochain.net",
      accounts: [privKey],
      gasPrice: 8000000000
    },
    scrollTest: {
      url: "https://scroll-testnet-public.unifra.io",
      accounts: [privKey],
    },
    mantleTest: {
      url: "https://rpc.testnet.mantle.xyz",
      accounts: [privKey],
    },
  },
  solidity: "0.8.13",
}
