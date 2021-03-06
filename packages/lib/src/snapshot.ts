import { ethers } from "ethers";
import { readFileSync, writeFileSync } from "fs";
import axios from "axios";
import {
  HUXLXY_WALLET,
  JWALLET,
  KENNY_WALLET,
  MUTTS_ABI,
  MUTTS_ADDRESS,
  NIFTY_GATEWAY_WALLET,
} from "./constants";
import path from "path";
import { AirdropType, BalanceEntry, SnapshotEntry } from "./types";
import assert from "assert";

type BalanceMap = Record<string, number>;

interface NiftyGatewayResponse {
  next: string | null;
  results: NiftyGatewayResult[];
}

interface NiftyGatewayResult {
  owner: { airdropAddressEth: string };
}

async function ngHolders(balances: BalanceMap) {
  console.log("Gathering Nifty Gateway holders");
  let next: string | null =
    "https://api.niftygateway.com/v1/creators/cryptomutts/collectors/?limit=20&offset=0";
  while (next !== null) {
    try {
      const response = await axios.get(next);
      const json = response.data as NiftyGatewayResponse;
      next = json.next;
      const { results } = json;
      results.forEach((result: NiftyGatewayResult) => {
        let {
          owner: { airdropAddressEth },
        } = result;
        if (airdropAddressEth === "null" || airdropAddressEth === null) {
          airdropAddressEth = JWALLET;
        }
        airdropAddressEth = ethers.utils.getAddress(airdropAddressEth);
        balances[airdropAddressEth] = balances[airdropAddressEth] || 0;
        balances[airdropAddressEth] += 1;
        console.log(
          "Address: ",
          airdropAddressEth,
          "Balance: ",
          balances[airdropAddressEth]
        );
      });
    } catch (e: any) {
      if (axios.isAxiosError(e)) {
        console.error(e.code);
        console.error(e.response?.data);
      } else {
        console.error(e.message);
      }
      process.exit(1);
    }
  }
}

async function muttsHolders(balances: BalanceMap, blockTag: number | string) {
  console.log("Gathering Mutts holders");
  const provider = new ethers.providers.JsonRpcProvider(
    "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
  );
  const mutts = new ethers.Contract(MUTTS_ADDRESS, MUTTS_ABI, provider);
  const totalSupply = Number(await mutts.totalSupply());
  console.log("Total Supply: ", totalSupply);
  for (let i = 0; i < totalSupply; i++) {
    const address = await mutts.ownerOf(i, { blockTag });
    if (address === NIFTY_GATEWAY_WALLET) continue;
    balances[address] = balances[address] || 0;
    balances[address] += 1;
    console.log("Address: ", address, "Balance: ", balances[address]);
  }
}

const adjustBalances = (balances: BalanceMap): void => {
  balances[KENNY_WALLET] = 150;
  balances[HUXLXY_WALLET] = 850;
  const tokensAirdropped = Object.values(balances).reduce(
    (acc, balance) => acc + balance,
    0
  );
  balances["0x74f22345c476B22F4bbD926889ed2ab2284bDaa9"] +=
    10000 - tokensAirdropped;
};

export const generateSnapshot = async (
  airdropType: AirdropType,
  blockTag: number | string = "latest"
): Promise<void> => {
  const balances: BalanceMap = {};
  console.log("Generating Snapshot");
  await ngHolders(balances);
  await muttsHolders(balances, blockTag);
  if (airdropType === AirdropType.Huxlxy) {
    adjustBalances(balances);
  }
  const snapshot: SnapshotEntry[] = Object.keys(balances).map((address) => ({
    address,
    amount: balances[address],
  }));

  const tokensAirdropped = snapshot.reduce((acc, curr) => acc + curr.amount, 0);
  console.log("Total Tokens being airdropped:", tokensAirdropped);
  writeFileSync(
    path.resolve(__dirname, `../${airdropType}-snapshot.json`),
    JSON.stringify(snapshot, null, 2)
  );
  console.log("Snapshot generated");
};

export const generateBalances = (airdropType: AirdropType): void => {
  const balances: Record<string, BalanceEntry> = {};
  const snapshot: SnapshotEntry[] = JSON.parse(
    readFileSync(
      path.resolve(__dirname, `../${airdropType}-snapshot.json`)
    ).toString()
  );
  for (let i = 0; i < snapshot.length; i++) {
    const { address, amount } = snapshot[i];
    balances[address] = { amount, merkleIndex: i };
    console.log("Address: ", address, "Balance: ", balances[address]);
  }
  ensureBalances(balances);
  writeFileSync(
    path.resolve(__dirname, `../${airdropType}-balances.json`),
    JSON.stringify(balances, null, 2)
  );
};

export const ensureBalances = (
  balances: Record<string, BalanceEntry>
): void => {
  assert(
    Object.values(balances).reduce((sum, value) => sum + value.amount, 0) ===
      10000
  );
};
