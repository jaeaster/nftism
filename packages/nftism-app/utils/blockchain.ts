import { ethers } from "ethers";
import { Provider } from "@ethersproject/abstract-provider";

export enum Networks {
  MAINNET = 1,
  RINKEBY = 4,
  LOCAL = 31337,
}

// export const DEFAULT_NETWORK = Networks.MAINNET;
export const DEFAULT_NETWORK = Networks.LOCAL;
// export const DEFAULT_NETWORK = Networks.RINKEBY;

export const INFURA_ID = "9aa3d95b3bc440fa88ea12eaa4456161";

export const networkConfig = {
  [Networks.MAINNET]: {
    nftismContract: "0xF8Fe4dbE106AC2a1e6C96C3Ca77B344A1b1A49e1",
    chainId: 1,
    chainName: "Ethereum Mainnet",
    uri: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
    etherscan: "https://etherscan.io",
  },
  [Networks.RINKEBY]: {
    nftismContract: "0xF8Fe4dbE106AC2a1e6C96C3Ca77B344A1b1A49e1",
    chainId: 4,
    chainName: "Rinkeby Testnet",
    uri: "https://rinkeby.infura.io/v3/dd03b0b31e154af88bdd60ade7d6c6d0",
    etherscan: "https://rinkeby.etherscan.io",
  },
  [Networks.LOCAL]: {
    nftismContract: "0xF8Fe4dbE106AC2a1e6C96C3Ca77B344A1b1A49e1",
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
