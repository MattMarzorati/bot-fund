export const CHAIN_ID = 80094;

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const WALLET = requiredEnv("WALLET").toLowerCase();

export const KODIAK_VAULT_IDS = [
  {
    label: "iBERA/wgBERA",
    poolAddress: "0x88c983bf3d4a9adcee14e1b4f1c446c4c5853ea3",
    farmAddress: "0x25acec3a1766a0d02d7c8e22f48533d32d7b311b",
    url: "https://app.kodiak.finance/#/liquidity/pools/0x88c983bf3d4a9adcee14e1b4f1c446c4c5853ea3?farm=0x25acec3a1766a0d02d7c8e22f48533d32d7b311b&chain=berachain_mainnet"
  },
  {
    label: "iBGT/wgBERA",
    poolAddress: "0xbd9f4417fcc81e6dd33bca34aba9fdfb1fe75c0c",
    farmAddress: "0xce420bc9bdb02056cd6d6349ace17ef52f8a6540",
    url: "https://app.kodiak.finance/#/liquidity/pools/0xbd9f4417fcc81e6dd33bca34aba9fdfb1fe75c0c?farm=0xce420bc9bdb02056cd6d6349ace17ef52f8a6540&chain=berachain_mainnet"
  },
  {
    label: "SMILEE/HONEY",
    poolAddress: "0x5978e23d931b5e51a02e1919be7e7a99e4de2583",
    farmAddress: "0x47ffffad6650e791a5ed41909c6a8c9e4fb94b99",
    url: "https://app.kodiak.finance/#/liquidity/pools/0x5978e23d931b5e51a02e1919be7e7a99e4de2583?farm=0x47ffffad6650e791a5ed41909c6a8c9e4fb94b99&chain=berachain_mainnet"
  }
] as const;

export const EULER_VAULT = {
  label: "wBERA LEND on Euler",
  vault: "0xCaa70d2aa873Ef057980844e18D9a9560bdfFcC0",
  url: "https://app.euler.finance/vault/0xCaa70d2aa873Ef057980844e18D9a9560bdfFcC0?network=berachain"
} as const;

export const DOLOMITE = {
  label: "wBERA LEND on Dolomite",
  tokenOrMarket: "0x003ca23fd5f0ca87d01f6ec6cd14a8ae60c2b97d",
  apySourceUrl: "https://app.vaults.fyi/opportunity/berachain/0xAa97D791Afc02AF30cf0B046172bb05b3c306517",
  url: "https://berascan.com/address/0x003ca23fd5f0ca87d01f6ec6cd14a8ae60c2b97d"
} as const;

export const EMAIL_SUBJECT_STATUS = "[STATUS UPDATE] Today's gFund Allocation";
export const EMAIL_SUBJECT_ALERT = "[ALERT] iBGT Premium Price";

export const PREMIUM_ALERT_UPPER = 5;
export const PREMIUM_ALERT_LOWER_INCLUSIVE = 0.2;
