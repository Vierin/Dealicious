import { addDays, formatISODate, mondayOnOrBefore } from "./dates";
import type { Catalog, Product, Promotion, Recipe, RecipeIngredient } from "./types";

export const PRODUCTS: Product[] = [
  { id: "pomidory", namePl: "Pomidory", category: "Овощи", unit: "kg", regularPricePln: 8.99 },
  { id: "ogorki", namePl: "Ogórki", category: "Овощи", unit: "kg", regularPricePln: 6.49 },
  { id: "cebula", namePl: "Cebula", category: "Овощи", unit: "kg", regularPricePln: 3.49 },
  { id: "marchew", namePl: "Marchew", category: "Овощи", unit: "kg", regularPricePln: 3.29 },
  { id: "ziemniaki", namePl: "Ziemniaki", category: "Овощи", unit: "kg", regularPricePln: 2.99 },
  { id: "papryka", namePl: "Papryka czerwona", category: "Овощи", unit: "kg", regularPricePln: 12.99 },
  { id: "salata", namePl: "Sałata masłowa", category: "Овощи", unit: "szt", regularPricePln: 4.49 },
  { id: "cukinia", namePl: "Cukinia", category: "Овощи", unit: "kg", regularPricePln: 6.99 },
  { id: "brokuly", namePl: "Brokuły", category: "Овощи", unit: "szt", regularPricePln: 5.99 },
  { id: "szpinak", namePl: "Szpinak baby", category: "Овощи", unit: "szt", regularPricePln: 4.99 },
  { id: "czosnek", namePl: "Czosnek", category: "Овощи", unit: "szt", regularPricePln: 1.49 },
  { id: "cytryna", namePl: "Cytryna", category: "Овощи", unit: "szt", regularPricePln: 1.99 },
  { id: "awokado", namePl: "Awokado", category: "Овощи", unit: "szt", regularPricePln: 6.99 },
  { id: "kurczak", namePl: "Filet z kurczaka", category: "Мясо", unit: "kg", regularPricePln: 24.99 },
  { id: "mielone", namePl: "Mięso mielone wołowe", category: "Мясо", unit: "kg", regularPricePln: 32.99 },
  { id: "schab", namePl: "Schab wieprzowy", category: "Мясо", unit: "kg", regularPricePln: 22.99 },
  { id: "tofu", namePl: "Tofu naturalne", category: "Мясо", unit: "szt", regularPricePln: 7.49 },
  { id: "losos", namePl: "Łosoś filet", category: "Рыба", unit: "kg", regularPricePln: 59.99 },
  { id: "dorsz", namePl: "Dorsz filet", category: "Рыба", unit: "kg", regularPricePln: 39.99 },
  { id: "mleko", namePl: "Mleko 2%", category: "Молочка", unit: "l", regularPricePln: 3.99 },
  { id: "jogurt", namePl: "Jogurt naturalny", category: "Молочка", unit: "szt", regularPricePln: 2.49 },
  { id: "gouda", namePl: "Ser gouda", category: "Молочка", unit: "kg", regularPricePln: 39.99 },
  { id: "smietana", namePl: "Śmietana 18%", category: "Молочка", unit: "szt", regularPricePln: 3.29 },
  { id: "jaja", namePl: "Jaja M 10 szt.", category: "Молочка", unit: "opak", regularPricePln: 12.99 },
  { id: "feta", namePl: "Ser feta", category: "Молочка", unit: "szt", regularPricePln: 6.99 },
  { id: "maslo", namePl: "Masło ekstra", category: "Молочка", unit: "szt", regularPricePln: 8.99 },
  { id: "ryz", namePl: "Ryż jaśminowy", category: "Бакалея", unit: "kg", regularPricePln: 6.99 },
  { id: "penne", namePl: "Makaron penne", category: "Бакалея", unit: "szt", regularPricePln: 4.49 },
  { id: "spaghetti", namePl: "Makaron spaghetti", category: "Бакалея", unit: "szt", regularPricePln: 4.29 },
  { id: "kasza", namePl: "Kasza gryczana", category: "Бакалея", unit: "kg", regularPricePln: 7.49 },
  { id: "soczewica", namePl: "Soczewica czerwona", category: "Бакалея", unit: "kg", regularPricePln: 8.99 },
  { id: "ciecierzyca", namePl: "Ciecierzyca konserwowa", category: "Бакалея", unit: "szt", regularPricePln: 3.49 },
  { id: "pomidory-puszka", namePl: "Pomidory krojone", category: "Бакалея", unit: "szt", regularPricePln: 3.99 },
  { id: "passata", namePl: "Passata pomidorowa", category: "Бакалея", unit: "szt", regularPricePln: 5.49 },
  { id: "oliwa", namePl: "Oliwa z oliwek", category: "Бакалея", unit: "szt", regularPricePln: 19.99 },
  { id: "tortilla", namePl: "Tortilla pszenna", category: "Бакалея", unit: "opak", regularPricePln: 6.99 },
  { id: "fasola", namePl: "Fasola czerwona", category: "Бакалея", unit: "szt", regularPricePln: 3.79 },
  { id: "kukurydza", namePl: "Kukurydza konserwowa", category: "Бакалея", unit: "szt", regularPricePln: 3.59 },
  { id: "chleb", namePl: "Chleb żytni", category: "Бакалея", unit: "szt", regularPricePln: 4.99 },
  { id: "bulka", namePl: "Bułka kajzerka", category: "Бакалея", unit: "szt", regularPricePln: 0.69 },
];

export const MON_PROMO: { productId: string; price: number }[] = [
  { productId: "kurczak", price: 16.99 },
  { productId: "ryz", price: 3.99 },
  { productId: "pomidory", price: 4.99 },
  { productId: "penne", price: 2.49 },
  { productId: "jogurt", price: 1.29 },
  { productId: "ziemniaki", price: 1.49 },
  { productId: "cebula", price: 1.99 },
  { productId: "marchew", price: 1.79 },
  { productId: "jaja", price: 7.99 },
  { productId: "soczewica", price: 4.99 },
  { productId: "pomidory-puszka", price: 2.29 },
  { productId: "kasza", price: 4.49 },
];

export const THU_PROMO: { productId: string; price: number }[] = [
  { productId: "losos", price: 36.99 },
  { productId: "brokuly", price: 3.49 },
  { productId: "feta", price: 3.99 },
  { productId: "schab", price: 14.99 },
  { productId: "gouda", price: 24.99 },
  { productId: "ciecierzyca", price: 1.99 },
  { productId: "szpinak", price: 2.99 },
  { productId: "smietana", price: 1.79 },
  { productId: "awokado", price: 3.99 },
  { productId: "cukinia", price: 3.99 },
  { productId: "tofu", price: 4.49 },
  { productId: "dorsz", price: 24.99 },
];

export const RECIPES: Recipe[] = [
  {
    id: "chicken-rice",
    title: "Курица с рисом и брокколи",
    dietStyles: ["sport", "healthy"],
    allergens: [],
    proteins: ["chicken"],
    isVegan: false,
  },
  {
    id: "chicken-salad",
    title: "Салат с курицей",
    dietStyles: ["healthy", "sport"],
    allergens: [],
    proteins: ["chicken"],
    isVegan: false,
  },
  {
    id: "chicken-tortilla",
    title: "Тортилья с курицей",
    dietStyles: ["sport", "comfort"],
    allergens: ["gluten"],
    proteins: ["chicken"],
    isVegan: false,
  },
  {
    id: "bolognese",
    title: "Паста болоньезе",
    dietStyles: ["comfort"],
    allergens: ["gluten"],
    proteins: ["beef"],
    isVegan: false,
  },
  {
    id: "pork-potato",
    title: "Свинина с картошкой",
    dietStyles: ["comfort"],
    allergens: [],
    proteins: ["pork"],
    isVegan: false,
  },
  {
    id: "salmon-buckwheat",
    title: "Лосось с гречкой и шпинатом",
    dietStyles: ["healthy", "sport"],
    allergens: ["fish"],
    proteins: ["fish"],
    isVegan: false,
  },
  {
    id: "beef-bake",
    title: "Запеканка с фаршем",
    dietStyles: ["comfort"],
    allergens: ["lactose"],
    proteins: ["beef"],
    isVegan: false,
  },
  {
    id: "omelette",
    title: "Омлет со шпинатом и фетой",
    dietStyles: ["sport"],
    allergens: ["eggs", "lactose"],
    proteins: ["veg"],
    isVegan: false,
  },
  {
    id: "lentil-soup",
    title: "Чечевичный суп",
    dietStyles: ["healthy", "balanced"],
    allergens: [],
    proteins: ["veg"],
    isVegan: true,
  },
  {
    id: "chickpea-curry",
    title: "Нут карри с рисом",
    dietStyles: ["healthy"],
    allergens: [],
    proteins: ["veg"],
    isVegan: true,
  },
  {
    id: "buckwheat-veg",
    title: "Гречка с цукини",
    dietStyles: ["healthy", "comfort"],
    allergens: [],
    proteins: ["veg"],
    isVegan: true,
  },
  {
    id: "avocado-salad",
    title: "Овощной салат с авокадо",
    dietStyles: ["healthy"],
    allergens: [],
    proteins: ["veg"],
    isVegan: true,
  },
  {
    id: "veg-risotto",
    title: "Овощное ризотто",
    dietStyles: ["balanced", "comfort"],
    allergens: [],
    proteins: ["veg"],
    isVegan: true,
  },
  {
    id: "lentil-pepper",
    title: "Чечевица с паприкой",
    dietStyles: ["healthy", "sport"],
    allergens: [],
    proteins: ["veg"],
    isVegan: true,
  },
  {
    id: "chickpea-salad",
    title: "Салат с нутом",
    dietStyles: ["healthy", "balanced"],
    allergens: [],
    proteins: ["veg"],
    isVegan: true,
  },
  {
    id: "tofu-bowl",
    title: "Тофу с рисом и брокколи",
    dietStyles: ["sport"],
    allergens: ["soy"],
    proteins: ["veg"],
    isVegan: true,
  },
];

export const INGREDIENTS: RecipeIngredient[] = [
  { recipeId: "chicken-rice", productId: "kurczak", qtyPerPerson: 0.18 },
  { recipeId: "chicken-rice", productId: "ryz", qtyPerPerson: 0.07 },
  { recipeId: "chicken-rice", productId: "brokuly", qtyPerPerson: 0.4 },
  { recipeId: "chicken-rice", productId: "cebula", qtyPerPerson: 0.04 },
  { recipeId: "chicken-rice", productId: "czosnek", qtyPerPerson: 0.15 },

  { recipeId: "chicken-salad", productId: "kurczak", qtyPerPerson: 0.15 },
  { recipeId: "chicken-salad", productId: "salata", qtyPerPerson: 0.5 },
  { recipeId: "chicken-salad", productId: "pomidory", qtyPerPerson: 0.12 },
  { recipeId: "chicken-salad", productId: "ogorki", qtyPerPerson: 0.1 },
  { recipeId: "chicken-salad", productId: "oliwa", qtyPerPerson: 0.02 },

  { recipeId: "chicken-tortilla", productId: "kurczak", qtyPerPerson: 0.15 },
  { recipeId: "chicken-tortilla", productId: "tortilla", qtyPerPerson: 0.5 },
  { recipeId: "chicken-tortilla", productId: "papryka", qtyPerPerson: 0.08 },
  { recipeId: "chicken-tortilla", productId: "cebula", qtyPerPerson: 0.03 },
  { recipeId: "chicken-tortilla", productId: "jogurt", qtyPerPerson: 0.15 },

  { recipeId: "bolognese", productId: "mielone", qtyPerPerson: 0.15 },
  { recipeId: "bolognese", productId: "penne", qtyPerPerson: 0.35 },
  { recipeId: "bolognese", productId: "pomidory-puszka", qtyPerPerson: 0.5 },
  { recipeId: "bolognese", productId: "cebula", qtyPerPerson: 0.05 },
  { recipeId: "bolognese", productId: "czosnek", qtyPerPerson: 0.2 },

  { recipeId: "pork-potato", productId: "schab", qtyPerPerson: 0.18 },
  { recipeId: "pork-potato", productId: "ziemniaki", qtyPerPerson: 0.25 },
  { recipeId: "pork-potato", productId: "cebula", qtyPerPerson: 0.04 },
  { recipeId: "pork-potato", productId: "marchew", qtyPerPerson: 0.05 },

  { recipeId: "salmon-buckwheat", productId: "losos", qtyPerPerson: 0.16 },
  { recipeId: "salmon-buckwheat", productId: "kasza", qtyPerPerson: 0.07 },
  { recipeId: "salmon-buckwheat", productId: "szpinak", qtyPerPerson: 0.5 },
  { recipeId: "salmon-buckwheat", productId: "cytryna", qtyPerPerson: 0.3 },

  { recipeId: "beef-bake", productId: "mielone", qtyPerPerson: 0.15 },
  { recipeId: "beef-bake", productId: "ziemniaki", qtyPerPerson: 0.3 },
  { recipeId: "beef-bake", productId: "smietana", qtyPerPerson: 0.15 },
  { recipeId: "beef-bake", productId: "gouda", qtyPerPerson: 0.04 },
  { recipeId: "beef-bake", productId: "cebula", qtyPerPerson: 0.04 },

  { recipeId: "omelette", productId: "jaja", qtyPerPerson: 0.2 },
  { recipeId: "omelette", productId: "szpinak", qtyPerPerson: 0.3 },
  { recipeId: "omelette", productId: "feta", qtyPerPerson: 0.15 },
  { recipeId: "omelette", productId: "cebula", qtyPerPerson: 0.02 },

  { recipeId: "lentil-soup", productId: "soczewica", qtyPerPerson: 0.08 },
  { recipeId: "lentil-soup", productId: "marchew", qtyPerPerson: 0.08 },
  { recipeId: "lentil-soup", productId: "cebula", qtyPerPerson: 0.05 },
  { recipeId: "lentil-soup", productId: "ziemniaki", qtyPerPerson: 0.12 },
  { recipeId: "lentil-soup", productId: "czosnek", qtyPerPerson: 0.15 },
  { recipeId: "lentil-soup", productId: "pomidory-puszka", qtyPerPerson: 0.25 },

  { recipeId: "chickpea-curry", productId: "ciecierzyca", qtyPerPerson: 1 },
  { recipeId: "chickpea-curry", productId: "passata", qtyPerPerson: 0.3 },
  { recipeId: "chickpea-curry", productId: "cebula", qtyPerPerson: 0.04 },
  { recipeId: "chickpea-curry", productId: "ryz", qtyPerPerson: 0.07 },
  { recipeId: "chickpea-curry", productId: "szpinak", qtyPerPerson: 0.3 },
  { recipeId: "chickpea-curry", productId: "czosnek", qtyPerPerson: 0.15 },

  { recipeId: "buckwheat-veg", productId: "kasza", qtyPerPerson: 0.08 },
  { recipeId: "buckwheat-veg", productId: "cukinia", qtyPerPerson: 0.15 },
  { recipeId: "buckwheat-veg", productId: "marchew", qtyPerPerson: 0.06 },
  { recipeId: "buckwheat-veg", productId: "cebula", qtyPerPerson: 0.04 },
  { recipeId: "buckwheat-veg", productId: "czosnek", qtyPerPerson: 0.1 },

  { recipeId: "avocado-salad", productId: "awokado", qtyPerPerson: 0.5 },
  { recipeId: "avocado-salad", productId: "pomidory", qtyPerPerson: 0.15 },
  { recipeId: "avocado-salad", productId: "ogorki", qtyPerPerson: 0.1 },
  { recipeId: "avocado-salad", productId: "cebula", qtyPerPerson: 0.02 },
  { recipeId: "avocado-salad", productId: "cytryna", qtyPerPerson: 0.25 },
  { recipeId: "avocado-salad", productId: "oliwa", qtyPerPerson: 0.02 },

  { recipeId: "veg-risotto", productId: "ryz", qtyPerPerson: 0.08 },
  { recipeId: "veg-risotto", productId: "cukinia", qtyPerPerson: 0.12 },
  { recipeId: "veg-risotto", productId: "marchew", qtyPerPerson: 0.05 },
  { recipeId: "veg-risotto", productId: "cebula", qtyPerPerson: 0.04 },
  { recipeId: "veg-risotto", productId: "szpinak", qtyPerPerson: 0.25 },
  { recipeId: "veg-risotto", productId: "czosnek", qtyPerPerson: 0.1 },

  { recipeId: "lentil-pepper", productId: "soczewica", qtyPerPerson: 0.09 },
  { recipeId: "lentil-pepper", productId: "papryka", qtyPerPerson: 0.12 },
  { recipeId: "lentil-pepper", productId: "cebula", qtyPerPerson: 0.04 },
  { recipeId: "lentil-pepper", productId: "pomidory-puszka", qtyPerPerson: 0.4 },
  { recipeId: "lentil-pepper", productId: "czosnek", qtyPerPerson: 0.15 },

  { recipeId: "chickpea-salad", productId: "ciecierzyca", qtyPerPerson: 0.8 },
  { recipeId: "chickpea-salad", productId: "ogorki", qtyPerPerson: 0.1 },
  { recipeId: "chickpea-salad", productId: "pomidory", qtyPerPerson: 0.12 },
  { recipeId: "chickpea-salad", productId: "cebula", qtyPerPerson: 0.03 },
  { recipeId: "chickpea-salad", productId: "cytryna", qtyPerPerson: 0.2 },

  { recipeId: "tofu-bowl", productId: "tofu", qtyPerPerson: 0.5 },
  { recipeId: "tofu-bowl", productId: "ryz", qtyPerPerson: 0.07 },
  { recipeId: "tofu-bowl", productId: "brokuly", qtyPerPerson: 0.4 },
  { recipeId: "tofu-bowl", productId: "papryka", qtyPerPerson: 0.08 },
  { recipeId: "tofu-bowl", productId: "czosnek", qtyPerPerson: 0.1 },
];

export function buildPromotions(from = new Date()): Promotion[] {
  const monday = mondayOnOrBefore(from);
  const promotions: Promotion[] = [];

  for (const week of [0, 1]) {
    const start = addDays(monday, week * 7);
    const monFrom = formatISODate(start);
    const monTo = formatISODate(addDays(start, 5));
    const thuFrom = formatISODate(addDays(start, 3));
    const thuTo = formatISODate(addDays(start, 6));

    for (const item of MON_PROMO) {
      promotions.push({
        id: `gazetka-pon-${week}-${item.productId}`,
        productId: item.productId,
        promoPricePln: item.price,
        validFrom: monFrom,
        validTo: monTo,
        label: "gazetka-pon",
      });
    }

    for (const item of THU_PROMO) {
      promotions.push({
        id: `gazetka-czw-${week}-${item.productId}`,
        productId: item.productId,
        promoPricePln: item.price,
        validFrom: thuFrom,
        validTo: thuTo,
        label: "gazetka-czw",
      });
    }
  }

  return promotions;
}

export function buildCatalog(from = new Date()): Catalog {
  return {
    products: PRODUCTS,
    recipes: RECIPES,
    ingredients: INGREDIENTS,
    promotions: buildPromotions(from),
  };
}
