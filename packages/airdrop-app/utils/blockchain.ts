import { ethers } from "ethers";
import { Provider } from "@ethersproject/abstract-provider";
import { AirdropType } from "../../lib/src/types";

export enum Networks {
  MAINNET = 1,
  RINKEBY = 4,
  LOCAL = 31337,
}

export const DEFAULT_NETWORK = Networks.MAINNET;
// export const DEFAULT_NETWORK = Networks.LOCAL;
// export const DEFAULT_NETWORK = Networks.RINKEBY;

export const INFURA_ID = "9aa3d95b3bc440fa88ea12eaa4456161";
export const networkConfig = {
  [Networks.MAINNET]: {
    airdropContract: {
      [AirdropType.NFTism]: "0x11ae08fC5124b244451884926baFe857316f7ccc",
      [AirdropType.Huxlxy]: "0xcD2D0AA981ED12bFE700693F701eAC8B60EE68ee",
    },
    chainId: 1,
    chainName: "Ethereum Mainnet",
    uri: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
    etherscan: "https://etherscan.io",
  },
  [Networks.RINKEBY]: {
    airdropContract: {
      [AirdropType.NFTism]: "0x155a2B5da8aB175662F64c8cb54e8b0b19a796E6",
      [AirdropType.Huxlxy]: "0x7A4CCD541d66f2E1b33B993E2b7bC291281FEF52",
    },
    chainId: 4,
    chainName: "Rinkeby Testnet",
    uri: "https://rinkeby.infura.io/v3/dd03b0b31e154af88bdd60ade7d6c6d0",
    etherscan: "https://rinkeby.etherscan.io",
  },
  [Networks.LOCAL]: {
    airdropContract: {
      [AirdropType.NFTism]: "0x6F6f570F45833E249e27022648a26F4076F48f78",
      [AirdropType.Huxlxy]: "0x40918Ba7f132E0aCba2CE4de4c4baF9BD2D7D849",
    },
    chainId: 31337,
    chainName: "Local Testnet",
    uri: "http://localhost:8545",
    etherscan: "https://rinkeby.etherscan.io",
  },
};

export const etherscanLink = (txnHash: string) => {
  return `${networkConfig[DEFAULT_NETWORK].etherscan}/tx/${txnHash}`;
};

export const getGasPrice = async (provider: Provider) => {
  const GAS = "5";
  const gasPrice = await provider.getGasPrice();
  const convertGas = ethers.utils.parseUnits(GAS, "gwei");
  return gasPrice.add(convertGas);
};
