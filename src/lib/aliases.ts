export type Alias = {
  phrase: string;
  productId: string;
  exclude?: string[];
};

const GLOBAL_EXCLUDE = ["karma", "przysmak", "dla psa", "dla kota", "dla psów", "dla kotów"];

/** Longer phrases win. Unmatched gazetka names stay out of the menu until added here. */
export const ALIASES: Alias[] = [
  { phrase: "filet z piersi kurczaka", productId: "kurczak", exclude: ["wędz", "panier", "pizza", "lasagn", "skrzydeł", "pieczon"] },
  { phrase: "filet z kurczaka", productId: "kurczak", exclude: ["wędz", "panier", "pizza", "lasagn", "skrzydeł", "pieczon"] },
  { phrase: "mięso mielone wołowe", productId: "mielone" },
  { phrase: "mielone wołowe", productId: "mielone" },
  { phrase: "schab wieprzowy", productId: "schab", exclude: ["wędz", "kotlet"] },
  { phrase: "schab bez kości", productId: "schab" },
  { phrase: "łosoś filet", productId: "losos", exclude: ["marynow", "wędz", "porcja"] },
  { phrase: "filet z łososia", productId: "losos", exclude: ["marynow", "wędz", "porcja"] },
  { phrase: "łosoś świeży", productId: "losos", exclude: ["marynow", "wędz", "porcja"] },
  { phrase: "dorsz filet", productId: "dorsz" },
  { phrase: "filet z dorsza", productId: "dorsz" },
  { phrase: "dorsz", productId: "dorsz", exclude: ["wędz", "panier", "paluszk"] },
  { phrase: "tofu naturalne", productId: "tofu" },
  { phrase: "tofu", productId: "tofu", exclude: ["wędz", "danie", "mango"] },
  { phrase: "ziemniaki", productId: "ziemniaki", exclude: ["frytk", "chips", "puree", "plack", "knedl"] },
  { phrase: "ogórki", productId: "ogorki", exclude: ["konserw", "kiszon", "małosol"] },
  { phrase: "cebula", productId: "cebula", exclude: ["prażon", "suszon"] },
  { phrase: "marchew", productId: "marchew", exclude: ["sok", "mieszanka", "groszk"] },
  { phrase: "papryka czerwona", productId: "papryka" },
  { phrase: "sałata masłowa", productId: "salata" },
  { phrase: "cukinia", productId: "cukinia" },
  { phrase: "brokuły", productId: "brokuly" },
  { phrase: "brokuł", productId: "brokuly" },
  { phrase: "szpinak", productId: "szpinak", exclude: ["mroż", "borek", "ze szpinakiem"] },
  { phrase: "czosnek", productId: "czosnek", exclude: ["sos", "granul"] },
  { phrase: "cytryny", productId: "cytryna", exclude: ["sok", "herbat", "piwo", "napój", "radler", "jogurt", "tuńczyk", "syrop"] },
  { phrase: "cytryna", productId: "cytryna", exclude: ["sok", "herbat", "piwo", "napój", "radler", "jogurt", "tuńczyk", "syrop"] },
  { phrase: "awokado", productId: "awokado" },
  { phrase: "pomidory krojone", productId: "pomidory-puszka" },
  { phrase: "pomidory w puszce", productId: "pomidory-puszka" },
  { phrase: "pomidory", productId: "pomidory", exclude: ["krojone", "puszk", "passata", "koncentrat", "suszon", "sok"] },
  { phrase: "jogurt naturalny", productId: "jogurt" },
  { phrase: "ser żółty gouda", productId: "gouda", exclude: ["plastr", "tart", "wiór", "topiony"] },
  { phrase: "ser gouda", productId: "gouda", exclude: ["plastr", "tart", "wiór", "topiony"] },
  { phrase: "gouda", productId: "gouda", exclude: ["plastr", "tart", "wiór", "topiony"] },
  { phrase: "śmietana 18%", productId: "smietana" },
  { phrase: "śmietana", productId: "smietana", exclude: ["36%", "30%", "12%", "36 %", "30 %", "12 %", "wafle", "kwaśna"] },
  { phrase: "ser feta", productId: "feta" },
  { phrase: "feta", productId: "feta" },
  { phrase: "masło ekstra", productId: "maslo" },
  { phrase: "masło", productId: "maslo", exclude: ["roślin", "klarowan", "orzech"] },
  { phrase: "mleko 2%", productId: "mleko" },
  { phrase: "mleko", productId: "mleko", exclude: ["kokos", "owsian", "migdał", "ryżow", "skondens", "zagęszcz", "czekolad", "w proszku"] },
  { phrase: "jajka", productId: "jaja", exclude: ["przepiór", "6 szt"] },
  { phrase: "jaja", productId: "jaja", exclude: ["przepiór", "6 szt"] },
  { phrase: "ryż jaśminowy", productId: "ryz" },
  { phrase: "ryż", productId: "ryz", exclude: ["wafle", "ciasto", "mleko"] },
  { phrase: "makaron penne", productId: "penne" },
  { phrase: "penne", productId: "penne" },
  { phrase: "makaron spaghetti", productId: "spaghetti" },
  { phrase: "spaghetti", productId: "spaghetti", exclude: ["sos"] },
  { phrase: "kasza gryczana", productId: "kasza" },
  { phrase: "soczewica czerwona", productId: "soczewica" },
  { phrase: "soczewica", productId: "soczewica" },
  { phrase: "ciecierzyca", productId: "ciecierzyca" },
  { phrase: "passata", productId: "passata" },
  { phrase: "oliwa z oliwek", productId: "oliwa" },
  { phrase: "oliwa", productId: "oliwa" },
  { phrase: "tortilla pszenna", productId: "tortilla" },
  { phrase: "tortilla", productId: "tortilla", exclude: ["chips", "kurczak", "wrap", "gyros", "dania"] },
  { phrase: "fasola czerwona", productId: "fasola" },
  { phrase: "kukurydza konserwowa", productId: "kukurydza" },
  { phrase: "kukurydza", productId: "kukurydza", exclude: ["wafle", "chrupki", "prażon"] },
  { phrase: "chleb żytni", productId: "chleb" },
  { phrase: "bułka kajzerka", productId: "bulka" },
  { phrase: "kajzerka", productId: "bulka" },
];

export function matchProductId(name: string): string | null {
  const hay = name.toLocaleLowerCase("pl");
  if (GLOBAL_EXCLUDE.some((word) => hay.includes(word))) return null;

  const ranked = [...ALIASES].sort((a, b) => b.phrase.length - a.phrase.length);
  for (const alias of ranked) {
    const phrase = alias.phrase.toLocaleLowerCase("pl");
    if (!hay.includes(phrase)) continue;
    if (alias.exclude?.some((word) => hay.includes(word.toLocaleLowerCase("pl")))) continue;
    return alias.productId;
  }
  return null;
}
