import {
  EMAIL_SUBJECT_ALERT,
  EMAIL_SUBJECT_STATUS,
  EULER_VAULT,
  PREMIUM_ALERT_LOWER_INCLUSIVE,
  PREMIUM_ALERT_UPPER,
  WALLET,
  DOLOMITE
} from "./config.js";
import { fetchDolomiteSupplyApyFromVaultsFyi, fetchDolomiteWberaSize } from "./dolomite.js";
import { sendEmail } from "./email.js";
import { fetchEulerSupplyApy } from "./euler.js";
import { fmtPct, fmtUsd } from "./format.js";
import { fetchKodiakAllocations } from "./kodiak.js";
import { fetchIbgtPremiumPct } from "./premium.js";

function toRomeTimestamp(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(date);
}

export async function runOnce(): Promise<void> {
  const now = new Date();
  const premium = await fetchIbgtPremiumPct();

  const [kodiakAllocations, eulerApy, dolomitePosition, dolomiteApy] = await Promise.all([
    fetchKodiakAllocations(),
    fetchEulerSupplyApy(),
    fetchDolomiteWberaSize(),
    fetchDolomiteSupplyApyFromVaultsFyi()
  ]);

  const lines: string[] = [
    `Timestamp (Europe/Rome): ${toRomeTimestamp(now)}`,
    `Timestamp (UTC): ${now.toISOString()}`,
    `Wallet: ${WALLET}`,
    "",
    `iBGT Premium vs BERA (Furthermore): ${fmtPct(premium, 2)}`,
    "",
    "Kodiak allocations (wallet share of pool TVL):"
  ];

  for (const alloc of kodiakAllocations) {
    lines.push(
      "",
      `${alloc.label}`,
      `Pool: ${alloc.poolAddress}`,
      `Wallet TVL: ${fmtUsd(alloc.walletUsd)} / Pool TVL: ${fmtUsd(alloc.tvlUsd)} = ${fmtPct(alloc.walletSharePct, 4)}`
    );

    if (typeof alloc.farmApr === "number") {
      lines.push(`Infrared iBGT APR (farmApr): ${fmtPct(alloc.farmApr, 2)}`);
    }

    if (typeof alloc.totalApr === "number") {
      lines.push(`Total APR (fees + farm): ${fmtPct(alloc.totalApr, 2)}`);
    }

    lines.push(`Link: ${alloc.url}`);
  }

  lines.push(
    "",
    "Lending:",
    `Euler wBERA supply APY: ${eulerApy === null ? "N/A" : fmtPct(eulerApy, 2)}`,
    `Euler link: ${EULER_VAULT.url}`,
    "",
    `Dolomite position (${dolomitePosition.symbol ?? "TOKEN"}): ${dolomitePosition.formatted} (raw=${dolomitePosition.raw.toString()}, decimals=${dolomitePosition.decimals})`,
    `Dolomite supply APY (Vaults.fyi): ${dolomiteApy === null ? "N/A" : fmtPct(dolomiteApy, 2)}`,
    `Dolomite link: ${DOLOMITE.url}`
  );

  await sendEmail(EMAIL_SUBJECT_STATUS, lines.join("\n"));

  if (premium > PREMIUM_ALERT_UPPER || premium <= PREMIUM_ALERT_LOWER_INCLUSIVE) {
    const alertLines = [
      `Timestamp (Europe/Rome): ${toRomeTimestamp(now)}`,
      `Timestamp (UTC): ${now.toISOString()}`,
      `iBGT Premium vs BERA: ${fmtPct(premium, 2)}`,
      "",
      `Rule triggered: premium > ${PREMIUM_ALERT_UPPER}% OR premium <= ${PREMIUM_ALERT_LOWER_INCLUSIVE}% (including negative).`
    ];

    await sendEmail(EMAIL_SUBJECT_ALERT, alertLines.join("\n"));
  }
}
