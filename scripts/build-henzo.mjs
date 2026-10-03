import fs from "fs";
import { TITLES, STEPS } from "./henzo-pl.mjs";

const text = fs.readFileSync("C:/Users/dmezy/Downloads/henzo_100_recipes.csv", "utf8");

function parseCsv(source) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < source.length; i++) {
    const c = source[i];
    if (quoted) {
      if (c === '"' && source[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(cell);
      cell = "";
    } else if (c === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (c !== "\r") cell += c;
  }
  if (cell.length || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

function round3(n) {
  return Math.round(n * 1000) / 1000;
}

function splitName(raw) {
  let text = raw.trim();
  const frac = text.match(/(\d+)\s*\/\s*(\d+)/);
  if (frac) {
    return {
      name: text.replace(frac[0], "").replace(/\s+/g, " ").trim().toLowerCase(),
      q: { n: Number(frac[1]) / Number(frac[2]), unit: "count" },
    };
  }
  const measured = text.match(/(\d+(?:[.,]\d+)?)\s*(g|ml|cloves?|large)\b/i);
  if (measured) {
    const word = measured[2].toLowerCase();
    const unit = word.startsWith("clove") ? "cloves" : word === "large" ? "large" : word;
    return {
      name: text.replace(measured[0], "").replace(/\s+/g, " ").trim().toLowerCase(),
      q: { n: Number(measured[1].replace(",", ".")), unit },
    };
  }
  const num = text.match(/(\d+(?:[.,]\d+)?)/);
  if (num) {
    return {
      name: text.replace(num[0], "").replace(/\s+/g, " ").trim().toLowerCase(),
      q: { n: Number(num[1].replace(",", ".")), unit: "count" },
    };
  }
  return { name: text.replace(/\s+/g, " ").trim().toLowerCase(), q: null };
}

function grams(q, fallback) {
  if (!q) return fallback;
  if (q.unit === "g" || q.unit === "ml") return q.n;
  return fallback;
}

function count(q, fallback) {
  if (!q) return fallback;
  if (q.unit === "count" || q.unit === "large" || q.unit === "cloves") return q.n;
  return fallback;
}

function paid(id, qty) {
  return { kind: "paid", id, qty: round3(qty) };
}

function pan(name, gramsValue) {
  return { kind: "pantry", name, grams: Math.round(gramsValue) };
}

function mapKey(name, q) {
  const g = (fallback) => grams(q, fallback);
  const n = (fallback) => count(q, fallback);
  if (/chicken sausage/.test(name)) return paid("kielbasa", g(150) / 1000);
  if (/chicken thighs/.test(name)) return paid("udka", g(170) / 1000);
  if (/chicken breast/.test(name)) return paid("kurczak", g(150) / 1000);
  if (/turkey mince|lean turkey/.test(name)) return paid("indyk", g(180) / 1000);
  if (/beef mince|lean beef mince/.test(name)) return paid("mielone", g(150) / 1000);
  if (/beef strips|lean beef/.test(name)) return paid("wolowina", g(160) / 1000);
  if (/salmon/.test(name)) return paid("losos", g(170) / 1000);
  if (/tuna/.test(name)) return paid("tunczyk", g(120) / 120);
  if (/sweet potato/.test(name)) return paid("batat", g(220) / 1000);
  if (/large potato|potatoes/.test(name)) return paid("ziemniaki", g(200) / 1000);
  if (/rice/.test(name)) return paid("ryz", g(150) / 2.5 / 1000);
  if (/red lentils/.test(name)) return paid("soczewica", g(100) / 1000);
  if (/pearl barley/.test(name)) return paid("peczak", g(60) / 1000);
  if (/buckwheat/.test(name)) return paid("kasza", g(150) / 2.5 / 1000);
  if (/cooked quinoa|quinoa/.test(name)) return paid("quinoa", g(130) / 3 / 1000);
  if (/couscous/.test(name)) return paid("kuskus", g(80) / 1000);
  if (/spaghetti/.test(name)) return paid("spaghetti", g(80) / 500);
  if (/gnocchi/.test(name)) return paid("gnocchi", g(250) / 1000);
  if (/noodles/.test(name)) return paid(name.includes("ramen") ? "ramen" : name.includes("udon") ? "udon" : "makaron", g(90) / 1000);
  if (/udon/.test(name)) return paid("udon", g(200) / 1000);
  if (/short pasta|pasta/.test(name)) return paid("penne", g(80) / 500);
  if (/corn tortillas/.test(name)) return paid("tortilla-kukurydza", n(3) / 6);
  if (/flour tortillas/.test(name)) return paid("tortilla", n(2) / 6);
  if (/tortilla wrap|large tortilla|large flour tortilla|whole-wheat wrap/.test(name)) return paid("tortilla", n(1) / 6);
  if (/tortilla chips/.test(name)) return paid("chipsy", g(35) / 150);
  if (/pita/.test(name)) return paid("pita", n(1));
  if (/burger bun/.test(name)) return paid("bulka-burger", n(1));
  if (/black beans/.test(name)) return paid("fasola-czarna", g(80) / 240);
  if (/kidney beans|^beans$/.test(name)) return paid("fasola", g(100) / 240);
  if (/cannellini|white beans/.test(name)) return paid("fasola-biala", g(120) / 240);
  if (/chickpeas/.test(name)) return paid("ciecierzyca", g(150) / 240);
  if (/corn$|corn \d/.test(name)) return paid("kukurydza", g(60) / 140);
  if (/tomato passata|passata|enchilada sauce/.test(name)) return paid("passata", g(180) / 500);
  if (/^tomatoes$/.test(name)) return paid("pomidory", g(200) / 1000);
  if (/chopped tomatoes/.test(name)) return paid("pomidory-puszka", g(180) / 400);
  if (/cherry tomatoes|^tomato$|tomato \d/.test(name)) return paid("pomidory", g(80) / 1000);
  if (/salsa/.test(name)) return paid("salsa", g(70) / 300);
  if (/pesto/.test(name)) return paid("pesto", g(30) / 190);
  if (/light coconut/.test(name)) return paid("mleczko", g(120) / 400);
  if (/light cream/.test(name)) return paid("smietanka", g(60) / 200);
  if (/^yogurt$/.test(name)) return paid("jogurt", g(50) / 150);
  if (/greek yogurt|yogurt sauce/.test(name)) return paid("jogurt-grecki", g(50) / 150);
  if (/cottage cheese/.test(name)) return paid("twarog", g(150) / 1000);
  if (/ricotta/.test(name)) return paid("ricotta", g(100) / 1000);
  if (/parmesan/.test(name)) return paid("parmezan", g(15) / 1000);
  if (/cheddar/.test(name)) return paid("cheddar", g(40) / 1000);
  if (/mozzarella/.test(name)) return paid("mozzarella", g(50) / 1000);
  if (/feta/.test(name)) return paid("feta", g(40) / 200);
  if (/^eggs?$/.test(name)) return paid("jaja", n(1) / 10);
  if (/butter/.test(name) && !/peanut/.test(name)) return paid("maslo", g(5) / 200);
  if (/peanut butter/.test(name)) return paid("maslo-orzechowe", g(25) / 350);
  if (/cashews/.test(name)) return paid("orzechy", g(20) / 1000);
  if (/olive oil|^oil$/.test(name)) return paid("oliwa", g(5) / 1000);
  if (/honey/.test(name)) return paid("miod", g(15) / 370);
  if (/hummus/.test(name)) return paid("hummus", g(50) / 200);
  if (/tahini/.test(name)) return paid("tahini", g(15) / 300);
  if (/mayonnaise/.test(name)) return paid("majonez", g(30) / 400);
  if (/sriracha/.test(name)) return paid("sriracha", g(15) / 200);
  if (/teriyaki/.test(name)) return paid("teriyaki", g(40) / 250);
  if (/sweet chili/.test(name)) return paid("chili-sos", g(45) / 250);
  if (/oyster sauce/.test(name)) return paid("ostryga", g(15) / 250);
  if (/gochujang/.test(name)) return paid("gochujang", g(20) / 250);
  if (/burger sauce/.test(name)) return paid("sos-burger", g(30) / 250);
  if (/mustard/.test(name)) return paid("musztarda", g(10) / 200);
  if (/pickles/.test(name)) return paid("ogorki-kiszone", g(40) / 1000);
  if (/sauerkraut/.test(name)) return paid("kiszona", g(250) / 1000);
  if (/olives/.test(name)) return paid("oliwki", g(25) / 200);
  if (/breadcrumbs/.test(name)) return paid("bulka-tarta", g(25) / 1000);
  if (/panko/.test(name)) return paid("panko", g(25) / 1000);
  if (/broth/.test(name)) return paid("bulion", g(400) / 1000);
  if (/cabbage leaves/.test(name)) return paid("kapusta", 0.25);
  if (/cabbage/.test(name)) return paid("kapusta", g(200) / 1000);
  if (/cauliflower/.test(name)) return paid("kalafior", g(150) / 600);
  if (/eggplant/.test(name)) return paid("baklazan", g(100) / 1000);
  if (/zucchini/.test(name)) return paid("cukinia", g(120) / 1000);
  if (/broccoli/.test(name)) return paid("brokuly", g(120) / 400);
  if (/spinach/.test(name)) return paid("szpinak", g(70) / 100);
  if (/mushrooms/.test(name)) return paid("pieczarki", g(150) / 1000);
  if (/peas/.test(name)) return paid("groch", g(70) / 1000);
  if (/bell pepper/.test(name)) return paid("papryka", (q?.unit === "large" ? n(2) * 150 : g(80)) / 1000);
  if (/onion/.test(name)) return paid("cebula", g(50) / 1000);
  if (/carrot/.test(name)) return paid("marchew", g(60) / 1000);
  if (/cucumber/.test(name)) return paid("ogorki", g(80) / 1000);
  if (/celery/.test(name)) return paid("seler", g(60) / 1000);
  if (/apple/.test(name)) return paid("jablko", g(50) / 1000);
  if (/radish/.test(name)) return paid("rzodkiewka", g(60) / 100);
  if (/avocado/.test(name)) return paid("awokado", g(50) / 160);
  if (/lettuce|romaine|mixed salad|salad greens/.test(name)) return paid("salata", g(name.trim() === "lettuce" ? 50 : 80) / 200);
  if (/^lemon/.test(name)) return paid("cytryna", n(1));
  if (/^lime/.test(name)) return paid("limonka", n(0.5));
  if (/^garlic/.test(name)) return paid("czosnek", (q?.unit === "cloves" ? n(1) : 1) * 0.12);
  if (/spring onion/.test(name)) return paid("cebula", g(20) / 1000);
  if (/chives/.test(name)) return pan("Szczypiorek", g(20));
  if (/soy sauce/.test(name)) return pan("Sos sojowy", g(20));
  if (/sesame oil/.test(name)) return pan("Olej sezamowy", g(5));
  if (/sesame/.test(name)) return pan("Sezam", g(5));
  if (/cornstarch/.test(name)) return pan("Skrobia", g(5));
  if (/^flour$/.test(name)) return pan("Mąka", g(20));
  if (/balsamic/.test(name)) return pan("Glazura balsamiczna", g(10));
  if (/bay leaf/.test(name)) return pan("Liść laurowy", 1);
  if (/caraway/.test(name)) return pan("Kminek", 1);
  if (/garam masala/.test(name)) return pan("Garam masala", 2);
  if (/turmeric/.test(name)) return pan("Kurkuma", 1);
  if (/curry powder|curry spices/.test(name)) return pan("Curry", 3);
  if (/tikka spices|fajita seasoning/.test(name)) return [pan("Papryka mielona", 2), pan("Kumin", 2)];
  if (/^cumin/.test(name)) return pan("Kumin", 2);
  if (/^paprika/.test(name)) return pan("Papryka mielona", 2);
  if (/chili flakes|^chili$/.test(name)) return pan("Chili", 1);
  if (/italian herbs|^herbs$/.test(name)) return pan("Zioła", 1);
  if (/^basil$/.test(name)) return pan("Bazylia", 2);
  if (/parsley/.test(name)) return pan("Pietruszka", 3);
  if (/^dill$/.test(name)) return pan("Koperek", 2);
  if (/^ginger$/.test(name)) return pan("Imbir", 8);
  if (/^oregano$/.test(name)) return pan("Oregano", 1);
  if (/^pepper$/.test(name)) return pan("Pieprz", 1);
  if (/salt and pepper/.test(name)) return [pan("Sól", 2), pan("Pieprz", 1)];
  if (/^salt$/.test(name)) return pan("Sól", 2);
  return null;
}

function mapPiece(raw) {
  const text = raw.trim();
  if (!text) return [];
  if (/mixed vegetables/.test(text.toLowerCase())) {
    const each = grams(splitName(text).q, 180) / 3;
    return [paid("papryka", each / 1000), paid("marchew", each / 1000), paid("brokuly", each / 400)];
  }
  if (!/\d/.test(text) && text.includes(",")) {
    return text.split(",").flatMap((part) => mapPiece(part));
  }
  const split = splitName(text);
  const name = split.name.replace(/,?\s*skinless/g, "").trim();
  const q = split.q;
  if (name === "cumin, paprika, salt" || name.includes(",")) {
    return name.split(",").flatMap((part) => mapPiece(part));
  }
  const hit = mapKey(name, q);
  if (!hit) throw new Error(`unmapped [${text}] => [${name}]`);
  const list = Array.isArray(hit) ? hit : [hit];
  if (name === "mixed vegetables") return list;
  return list;
}

function appliancesOf(raw) {
  const value = raw.toLowerCase();
  if (value.includes("без")) return [];
  const stove = value.includes("плита");
  const oven = value.includes("духовка");
  const blender = value.includes("блендер");
  const air = value.includes("аэро");
  if (value.includes("или")) {
    if (stove) return ["stove"];
    if (oven) return ["oven"];
    if (air) return ["airfryer"];
  }
  const out = [];
  if (stove) out.push("stove");
  if (oven) out.push("oven");
  if (blender) out.push("blender");
  if (air && out.length === 0) out.push("airfryer");
  return out;
}

function minutesOf(instruction) {
  const ranges = [...instruction.matchAll(/(\d+)\s*[–-]\s*(\d+)/g)].map((match) => Number(match[2]));
  const singles = [...instruction.matchAll(/(\d+)\s*min/gi)].map((match) => Number(match[1]));
  const nums = [...ranges, ...singles];
  return nums.length ? Math.max(...nums) : 30;
}

function cuisineOf(raw) {
  const value = raw.toLowerCase();
  if (value.startsWith("fusion")) return "fusion";
  if (value.includes("mexican")) return "mexican";
  if (value.includes("italian")) return "italian";
  if (value.includes("indian")) return "indian";
  if (value.includes("asian")) return "asian";
  if (value.includes("mediterranean")) return "mediterranean";
  if (value.includes("polish")) return "polish";
  return "fusion";
}

const VIBES = {
  "protein packed": "protein-packed",
  "speedy meals": "speedy-meals",
  "healthy comfort": "healthy-comfort",
  "family favs": "family-favs",
  fakeway: "fakeway",
  "comfort food": "home-style",
  "low calories": "low-calories",
  "gut friendly": "gut-friendly",
};

const PROTEIN = {
  kurczak: "chicken",
  udka: "chicken",
  kielbasa: "chicken",
  indyk: "chicken",
  mielone: "beef",
  wolowina: "beef",
  losos: "fish",
  tunczyk: "fish",
};

const ANIMAL = new Set([
  ...Object.keys(PROTEIN),
  "jaja",
  "makaron",
  "ramen",
  "mleko",
  "jogurt",
  "jogurt-grecki",
  "gouda",
  "smietana",
  "smietanka",
  "maslo",
  "feta",
  "cheddar",
  "parmezan",
  "mozzarella",
  "ricotta",
  "twarog",
]);

function mergePaid(items) {
  const map = new Map();
  for (const item of items) {
    if (item.kind !== "paid") continue;
    map.set(item.id, round3((map.get(item.id) ?? 0) + item.qty));
  }
  return [...map.entries()];
}

function mergePantry(items) {
  const map = new Map();
  for (const item of items) {
    if (item.kind !== "pantry") continue;
    map.set(item.name, (map.get(item.name) ?? 0) + item.grams);
  }
  return [...map.entries()].map(([name, gramsValue]) => ({ name, grams: gramsValue }));
}

const rows = parseCsv(text).slice(1).filter((row) => row[1]);
if (rows.length !== 100) throw new Error(`rows ${rows.length}`);
if (TITLES.length !== 100 || STEPS.length !== 100) throw new Error("polish copy length");

const meals = rows.map((row, index) => {
  const pieces = row[4].split(";").flatMap((part) => mapPiece(part));
  const paidItems = mergePaid(pieces);
  const pantry = mergePantry(pieces);
  const proteins = [...new Set(paidItems.map(([id]) => PROTEIN[id]).filter(Boolean))];
  const vibes = [...new Set(row[3].split(",").map((item) => VIBES[item.trim().toLowerCase()]).filter(Boolean))];
  if (/fakeway/i.test(row[2]) && !vibes.includes("fakeway")) vibes.push("fakeway");
  const number = index + 1;
  return {
    id: `h${String(number).padStart(2, "0")}`,
    title: TITLES[index],
    cuisines: [cuisineOf(row[2])],
    vibes,
    proteins: proteins.length ? proteins : ["veg"],
    isVegan: paidItems.every(([id]) => !ANIMAL.has(id)),
    appliances: appliancesOf(row[6]),
    minutes: minutesOf(row[5]),
    protein: Number(row[8]),
    fat: Number(row[9]),
    carbs: Number(row[10]),
    kcal: Number(row[7]),
    paid: paidItems,
    pantry,
    steps: STEPS[index],
  };
});

function ts(value) {
  return JSON.stringify(value, null, 2);
}

const out = `import type { Appliance, Cuisine, DietStyle, Protein } from "./types";

export const HENZO_MEALS: {
  id: string;
  title: string;
  cuisines: Cuisine[];
  vibes: DietStyle[];
  proteins: Protein[];
  isVegan: boolean;
  appliances: Appliance[];
  minutes: number;
  protein: number;
  fat: number;
  carbs: number;
  kcal: number;
  paid: [string, number][];
  pantry: { name: string; grams?: number }[];
  steps: string[];
}[] = ${ts(meals)};
`;

fs.writeFileSync(new URL("../src/lib/henzo-meals.ts", import.meta.url), out);
console.log("wrote", meals.length, "meals");
