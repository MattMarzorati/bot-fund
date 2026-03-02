import { CHAIN_ID, KODIAK_VAULT_IDS, WALLET } from "./config.js";

type KodiakVault = {
  id: string;
  tvl: number;
  balanceUSD?: number;
  farmApr?: number;
  totalApr?: number;
};

export type KodiakAllocation = {
  label: string;
  poolAddress: string;
  tvlUsd: number;
  walletUsd: number;
  walletSharePct: number;
  farmApr?: number;
  totalApr?: number;
  url: string;
};

export async function fetchKodiakAllocations(): Promise<KodiakAllocation[]> {
  const url = new URL("https://backend.kodiak.finance/vaults");
  url.searchParams.set("chainId", String(CHAIN_ID));
  url.searchParams.set("user", WALLET);
  url.searchParams.set("limit", "500");
  url.searchParams.set("offset", "0");

  const res = await fetch(url.toString(), {
    headers: { accept: "application/json" }
  });

  if (!res.ok) {
    throw new Error(`Kodiak /vaults failed: ${res.status} ${await res.text()}`);
  }

  const json = (await res.json()) as { data?: KodiakVault[] };
  const vaults = json.data ?? [];
  const byId = new Map(vaults.map((v) => [v.id.toLowerCase(), v]));

  return KODIAK_VAULT_IDS.map((pool) => {
    const found = byId.get(pool.poolAddress.toLowerCase());
    const tvl = found?.tvl ?? 0;
    const wallet = found?.balanceUSD ?? 0;

    return {
      label: pool.label,
      poolAddress: pool.poolAddress,
      tvlUsd: tvl,
      walletUsd: wallet,
      walletSharePct: tvl > 0 ? (wallet / tvl) * 100 : 0,
      farmApr: found?.farmApr,
      totalApr: found?.totalApr,
      url: pool.url
    };
  });
}
