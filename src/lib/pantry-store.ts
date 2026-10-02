export type Applied = { packs: number; used: number };
export type PantryState = {
  stock: Record<string, number>;
  applied: Record<string, Record<string, Applied>>;
};

const storageKey = "dealicious-pantry";
const empty: PantryState = { stock: {}, applied: {} };

export function readPantry(): PantryState {
  const raw = localStorage.getItem(storageKey);
  if (!raw) return empty;
  try {
    const parsed = JSON.parse(raw) as Partial<PantryState>;
    if (!parsed || typeof parsed !== "object" || !parsed.stock || !parsed.applied) return empty;
    return { stock: parsed.stock, applied: parsed.applied };
  } catch {
    return empty;
  }
}

export function writePantry(next: PantryState) {
  localStorage.setItem(storageKey, JSON.stringify(next));
}
