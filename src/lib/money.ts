export function money(value: number): number {
  return Math.round(value * 100) / 100;
}

export function formatPln(value: number): string {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  }).format(value);
}

export function roundQty(qty: number, unit: "kg" | "szt" | "l" | "opak"): number {
  const step = unit === "kg" || unit === "l" ? 0.1 : 1;
  const units = Math.ceil(Math.round((qty / step) * 1e6) / 1e6);
  const rounded = units * step;
  return unit === "kg" || unit === "l" ? Math.round(rounded * 10) / 10 : rounded;
}

export function formatQty(qty: number, unit: "kg" | "szt" | "l" | "opak"): string {
  const value = unit === "kg" || unit === "l" ? qty.toFixed(1).replace(/\.0$/, "") : String(qty);
  return `${value} ${unit}`;
}
