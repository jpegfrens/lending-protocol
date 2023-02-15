import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.4.18", // for the WETH9 contract
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    "bsc-testnet": {
      url: "https://rpc.ankr.com/bsc_testnet_chapel",
      ...(process.env.BSC_TESTNET_MNEMONIC && {
        accounts: {
          mnemonic: `${process.env.BSC_TESTNET_MNEMONIC}`,
        },
      }),
    },
  },
};

export default config;
