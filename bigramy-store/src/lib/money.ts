export function formatEGP(amount: number | string | null | undefined): string {
  const n = Number(amount ?? 0);
  return `EGP ${n.toLocaleString("en-EG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export function toNumber(amount: number | string | null | undefined): number {
  return Math.round(Number(amount ?? 0) * 100) / 100;
}
