export function fmtUsd(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(n);
}

export function fmtPct(n: number, digits = 2): string {
  return `${n.toFixed(digits)}%`;
}
