import * as axios from "axios";

import { config as loadEnv } from "dotenv";
loadEnv();

if (
  process.env.CHAIN_ID === undefined ||
  process.env.INFURA_API_KEY === undefined ||
  process.env.INFURA_API_KEY_SECRET === undefined
) {
  console.log(
    "%s, %s, %s",
    process.env.CHAIN_ID,
    process.env.INFURA_API_KEY,
    process.env.INFURA_API_KEY_SECRET
  );
  process.exit(1);
}
const CHAIN_ID = process.env.CHAIN_ID;

export interface NftOwnership {
  tokenAddress: string;
  tokenId: string;
  amount: string;
  ownerOf: string;
  blockNumber: string;
  contractType: string;
  name: string;
  symbol: string;
  metadata: string;
}

export async function getAllOwners(
  contractAddress: string
): Promise<NftOwnership[]> {
  const response = await axios.default.get(
    `https://nft.api.infura.io/networks/${CHAIN_ID}/nfts/${contractAddress}/owners`,
    {
      headers: { accept: "application/json" },
      auth: {
        username: process.env.INFURA_API_KEY!,
        password: process.env.INFURA_API_KEY_SECRET!,
      },
    }
  );
  return response.data.owners! as NftOwnership[];
}

export function isOwnerOf(
  owners: NftOwnership[],
  walletAddress: string
): NftOwnership[] {
  // console.log("%s", walletAddress)
  return owners.filter((owner) => owner.ownerOf === walletAddress.toLowerCase());
}

export function isOwner(
  owners: NftOwnership[],
  walletAddress: string
): boolean {
  return isOwnerOf(owners, walletAddress).length > 0;
}

export interface Asset {
  contract: string;
  tokenId: string;
  supply: string;
  type: string;
  metadata: Object;
}

export async function getNFTs(walletAddress: string): Promise<Asset[]> {
  const response = await axios.default.get(
    `https://nft.api.infura.io/networks/${CHAIN_ID}/accounts/${walletAddress}/assets/nfts`,
    {
      headers: { accept: "application/json" },
      auth: {
        username: process.env.INFURA_API_KEY!,
        password: process.env.INFURA_API_KEY_SECRET!,
      },
    }
  );
  return response.data.assets! as Asset[];
}

export function filterByContract(
  assets: Asset[],
  contractAddress: string
): Asset[] {
  return assets.filter((asset) => asset.contract === contractAddress.toLowerCase());
}
