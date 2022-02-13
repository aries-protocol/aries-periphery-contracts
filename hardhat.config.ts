import * as fs from "fs";
import * as path from "path";
import { config as configDotenv } from "dotenv";
import type { HardhatUserConfig, SolcUserConfig } from "hardhat/types";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-truffle5";
import { removeConsoleLog } from "hardhat-preprocessor";
import "hardhat-abi-exporter";

const dotenvFile = process.env.NODE_ENV === "mainnet" ? ".mainnet.env" : ".testnet.env";

configDotenv({ path: path.resolve(__dirname, dotenvFile) });

const compilerOverridePath = "test/Contracts/aries-core/interfaces/";
const compilerOverrides: Record<string, SolcUserConfig> = {};

fs.readdirSync(path.join(__dirname, compilerOverridePath)).forEach((file) => {
    compilerOverrides[`${compilerOverridePath}${file}`] = {
        version: "0.5.17",
        settings: {
            optimizer: {
                enabled: true,
                runs: 10000,
            },
        },
    };
});

const config: HardhatUserConfig = {
    solidity: {
        compilers: [
            {
                version: "0.6.12",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 10000,
                    },
                },
            },
            {
                version: "0.5.17",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 10000,
                    },
                },
            },
        ],
        overrides: {
            // TODO: update DEX
            ...compilerOverrides,
            "test/Contracts/sushi/MasterChef.sol": {
                version: "0.6.12",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
            "test/Contracts/sushi/UniswapV2Factory.sol": {
                version: "0.6.12",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
            "test/Contracts/sushi/UniswapV2Router02.sol": {
                version: "0.6.12",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
        },
    },
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 1,
            // gasPrice: 2000,
        },
        aurora: {
            chainId: 1313161554,
            url: `https://mainnet.aurora.dev/${process.env.AURORA_API_KEY}`,
            accounts: {
                mnemonic: process.env.MNEMONIC,
            },
        },
        auroratestnet: {
            chainId: 1313161555,
            url: "https://testnet.aurora.dev",
            accounts: {
                mnemonic: process.env.MNEMONIC,
            },
        },
    },
    typechain: {
        outDir: "typechain",
        target: "ethers-v5",
    },
    mocha: {
        timeout: 100000,
    },
    preprocess: {
        eachLine: removeConsoleLog((hre) => hre.network.name !== "hardhat" && hre.network.name !== "localhost"),
    },
};

export default config;
