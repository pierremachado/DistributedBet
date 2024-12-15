import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv"

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    ganache: {
      url: "http://127.0.0.1:8545", // URL do Ganache
      accounts: [`0x${process.env.GANACHE_PRIVATE_KEY}`], // Chave privada da conta no Ganache
    }
  },
  typechain: {
    outDir: "typechain-types", // Pasta de saída
    target: "ethers-v6", // Usando ethers.js
  }
};

export default config;
