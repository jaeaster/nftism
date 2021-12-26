import { ethers } from "hardhat";
import { writeFileSync } from "fs";
import axios from "axios";

const MUTTS_ADDRESS = "0x25C65721E26fa5F3c97f129F4e24972482327BC9";
const MUTTS_ABI = [
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "function balanceOf(address owner) public view returns (uint256)",
  "function totalSupply() public view returns (uint256)",
];
const NIFTY_GATEWAY_WALLET = "0xE052113bd7D7700d623414a0a4585BCaE754E9d5";

type BalanceMap = Record<string, number>;

interface SnapshotEntry {
  address: string;
  amount: number;
}

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
          airdropAddressEth = "0x74f22345c476B22F4bbD926889ed2ab2284bDaa9";
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

async function muttsHolders(balances: BalanceMap) {
  console.log("Gathering Mutts holders");
  const provider = new ethers.providers.InfuraProvider();
  const mutts = new ethers.Contract(MUTTS_ADDRESS, MUTTS_ABI, provider);
  const totalSupply = Number(await mutts.totalSupply());
  console.log("Total Supply: ", totalSupply);
  for (let i = 0; i < totalSupply; i++) {
    const address = await mutts.ownerOf(i);
    if (address === NIFTY_GATEWAY_WALLET) continue;
    balances[address] = balances[address] || 0;
    balances[address] += 1;
    console.log("Address: ", address, "Balance: ", balances[address]);
  }
}

async function main() {
  const balances: BalanceMap = {};
  console.log("Generating Snapshot");
  await ngHolders(balances);
  await muttsHolders(balances);
  const snapshot: SnapshotEntry[] = Object.keys(balances).map((address) => ({
    address,
    amount: balances[address] * 100,
  }));
  console.log(
    "Total Tokens being airdropped:",
    snapshot.reduce((acc, curr) => acc + curr.amount, 0)
  );
  writeFileSync("snapshot.json", JSON.stringify(snapshot, null, 2));
  console.log("Snapshot generated");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
