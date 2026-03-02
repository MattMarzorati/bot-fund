import { EULER_VAULT } from "./config.js";

const EULER_BERA_SUBGRAPH =
  "https://api.goldsky.com/api/public/project_cm4iagnemt1wp01xn4gh1agft/subgraphs/euler-v2-berachain/latest/gn";

export async function fetchEulerSupplyApy(): Promise<number | null> {
  const query = `
    query ($id: ID!) {
      eulerVault(id: $id) {
        id
        state {
          supplyApy
          timestamp
        }
      }
    }
  `;

  const res = await fetch(EULER_BERA_SUBGRAPH, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      query,
      variables: { id: EULER_VAULT.vault.toLowerCase() }
    })
  });

  if (!res.ok) {
    throw new Error(`Euler subgraph failed: ${res.status} ${await res.text()}`);
  }

  const json = (await res.json()) as {
    data?: { eulerVault?: { state?: { supplyApy?: number } } };
  };

  const apy = json.data?.eulerVault?.state?.supplyApy;
  return typeof apy === "number" ? apy : null;
}
