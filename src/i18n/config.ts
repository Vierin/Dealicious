export const locales = ["pl"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "pl";

export function isLocale(value: string | undefined): value is Locale {
  return locales.some((locale) => locale === value);
}
