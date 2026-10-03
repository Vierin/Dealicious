export function startOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(12, 0, 0, 0);
  return next;
}

export function formatISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d, 12, 0, 0, 0);
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function mondayOnOrBefore(from: Date): Date {
  const date = startOfDay(from);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  return date;
}

export function nextShopDate(weekday: number, from = new Date()): string {
  const date = startOfDay(from);
  const delta = (weekday - date.getDay() + 7) % 7;
  date.setDate(date.getDate() + delta);
  return formatISODate(date);
}

/** Ближайший понедельник или четверг, включая сегодня. Газетки Biedronka выходят в эти дни. */
export function nextLeafletDate(from = new Date()): string {
  const date = startOfDay(from);
  for (let i = 0; i < 7; i += 1) {
    const day = date.getDay();
    if (day === 1 || day === 4) return formatISODate(date);
    date.setDate(date.getDate() + 1);
  }
  return formatISODate(date);
}

export function addISODays(iso: string, days: number): string {
  return formatISODate(addDays(parseISODate(iso), days));
}

export function cookOffsets(shopDate: string, cookDays: number[]): number[] {
  const days = new Set(cookDays);
  const offsets: number[] = [];
  for (let index = 0; index < 7; index += 1) {
    if (days.has(parseISODate(addISODays(shopDate, index)).getDay())) offsets.push(index);
  }
  return offsets;
}

const WEEKDAY_LONG: Record<string, string[]> = {
  pl: ["niedziela", "poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota"],
};

export function formatRuDate(iso: string, locale = "pl"): { weekday: string; dayMonth: string } {
  const date = parseISODate(iso);
  const dayMonth = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
  }).format(date);
  const names = WEEKDAY_LONG[locale] ?? WEEKDAY_LONG.pl;
  return { weekday: names[date.getDay()], dayMonth };
}
