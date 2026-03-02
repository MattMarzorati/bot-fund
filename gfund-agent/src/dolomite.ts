import { createPublicClient, formatUnits, getAddress, http } from "viem";
import { berachain } from "viem/chains";
import { DOLOMITE, WALLET } from "./config.js";

const erc20Abi = [
  {
    type: "function",
    name: "decimals",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint8" }]
  },
  {
    type: "function",
    name: "symbol",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "string" }]
  },
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ type: "address" }],
    outputs: [{ type: "uint256" }]
  }
] as const;

export type DolomitePosition = {
  raw: bigint;
  decimals: number;
  symbol?: string;
  formatted: string;
};

export async function fetchDolomiteWberaSize(): Promise<DolomitePosition> {
  const client = createPublicClient({
    chain: { ...berachain, id: 80094 },
    transport: http(process.env.BERA_RPC_URL)
  });

  const token = getAddress(DOLOMITE.tokenOrMarket);
  const wallet = getAddress(WALLET);

  const [decimals, symbol, raw] = await Promise.all([
    client.readContract({
      address: token,
      abi: erc20Abi,
      functionName: "decimals"
    }),
    client
      .readContract({
        address: token,
        abi: erc20Abi,
        functionName: "symbol"
      })
      .catch(() => undefined),
    client.readContract({
      address: token,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [wallet]
    })
  ]);

  return {
    raw,
    decimals,
    symbol,
    formatted: formatUnits(raw, decimals)
  };
}

export async function fetchDolomiteSupplyApyFromVaultsFyi(): Promise<number | null> {
  const res = await fetch(DOLOMITE.apySourceUrl);
  if (!res.ok) {
    throw new Error(`Vaults.fyi fetch failed: ${res.status} ${await res.text()}`);
  }

  const html = await res.text();

  const baseApyMatch = html.match(/Base APY\s*<\/[^>]+>\s*([\d.]+)%/i)?.[1];
  const totalApyMatch = html.match(/Total APY\s*<\/[^>]+>\s*([\d.]+)%/i)?.[1];

  const parsed = baseApyMatch ?? totalApyMatch;
  return parsed ? Number(parsed) : null;
}
