require('@nomiclabs/hardhat-ethers');  
require('dotenv').config();

module.exports = {
  solidity: "0.8.28",  
  networks: {
    hardhat: {
      chainId: 1337
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 1337
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      accounts: [`0x${process.env.PRIVATE_KEY}`], 
    },
  },
  paths: {
    artifacts: "../backend/artifacts",
    sources: "./contracts",
  },
};
