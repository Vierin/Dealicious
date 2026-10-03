import type {
  CanonicalProduct,
  PricePoint,
  Store,
  StoreProduct,
  StorePromotion,
  SupplyIngredient,
  SupplyRecipe,
} from "./supply";

export const SUPPLY_STORE: Store = { id: "biedronka", name: "Biedronka" };

type ProductSeed = CanonicalProduct & { legacyUnit: "kg" | "szt" | "l" };

function food(
  id: string,
  name: string,
  category: string,
  availabilityType: CanonicalProduct["availabilityType"] = "standard",
  isPantryStaple = false,
): ProductSeed {
  return { id, name, category, defaultUnit: "g", availabilityType, isPantryStaple, legacyUnit: "kg" };
}

function liquid(id: string, name: string, isPantryStaple = false): ProductSeed {
  return {
    id,
    name,
    category: "Pantry",
    defaultUnit: "ml",
    availabilityType: "standard",
    isPantryStaple,
    legacyUnit: "l",
  };
}

function counted(id: string, name: string, category: string): ProductSeed {
  return { id, name, category, defaultUnit: "pc", availabilityType: "standard", isPantryStaple: false, legacyUnit: "szt" };
}

export const SUPPLY_PRODUCTS: ProductSeed[] = [
  food("chicken-breast", "Chicken breast", "Meat"),
  food("chicken-thighs", "Chicken thighs", "Meat"),
  food("ground-beef", "Ground beef", "Meat"),
  food("turkey-mince", "Turkey mince", "Meat"),
  counted("eggs", "Eggs", "Dairy"),
  food("salmon", "Salmon", "Fish"),
  food("tuna", "Tuna", "Fish"),
  food("rice", "Rice", "Grocery"),
  food("pasta", "Pasta", "Grocery"),
  food("potatoes", "Potatoes", "Produce"),
  food("sweet-potatoes", "Sweet potatoes", "Produce"),
  counted("tortilla-wraps", "Tortilla wraps", "Grocery"),
  counted("bread", "Bread", "Grocery"),
  food("couscous", "Couscous", "Grocery"),
  food("buckwheat", "Buckwheat", "Grocery"),
  food("oats", "Oats", "Grocery"),
  food("tomatoes", "Tomatoes", "Produce", "seasonal"),
  food("canned-tomatoes", "Canned tomatoes", "Grocery"),
  food("onion", "Onion", "Produce"),
  counted("garlic", "Garlic", "Produce"),
  food("broccoli", "Broccoli", "Produce", "seasonal"),
  food("carrots", "Carrots", "Produce"),
  food("bell-pepper", "Bell pepper", "Produce", "seasonal"),
  food("spinach", "Spinach", "Produce", "seasonal"),
  food("mushrooms", "Mushrooms", "Produce", "seasonal"),
  food("cabbage", "Cabbage", "Produce"),
  food("sauerkraut", "Sauerkraut", "Grocery"),
  counted("avocado", "Avocado", "Produce"),
  food("chickpeas", "Chickpeas", "Grocery"),
  food("black-beans", "Black beans", "Grocery"),
  food("lentils", "Lentils", "Grocery"),
  food("greek-yogurt", "Greek yogurt", "Dairy"),
  food("cottage-cheese", "Cottage cheese", "Dairy"),
  food("mozzarella", "Mozzarella", "Dairy"),
  food("feta", "Feta", "Dairy"),
  food("cheddar", "Cheddar", "Dairy"),
  food("parmesan", "Parmesan", "Dairy"),
  liquid("olive-oil", "Olive oil", true),
  liquid("soy-sauce", "Soy sauce", true),
  food("honey", "Honey", "Pantry", "standard", true),
  food("ginger", "Ginger", "Produce"),
  food("strawberries", "Strawberries", "Produce", "seasonal"),
];

const SEASONAL_PC = new Set(["avocado"]);
for (const product of SUPPLY_PRODUCTS) {
  if (SEASONAL_PC.has(product.id)) product.availabilityType = "seasonal";
}

export const SUPPLY_RECIPES: SupplyRecipe[] = [
  {
    id: "chicken-teriyaki-bowl",
    name: "Chicken Teriyaki Rice Bowl",
    description: "Курица, рис и брокколи в соево-медовой заправке.",
    servings: 1,
    prepTime: 25,
    calories: 640,
    protein: 42,
    cuisines: ["asian"],
    vibes: ["protein-packed", "fakeway"],
  },
  {
    id: "chicken-tacos",
    name: "Chicken Tacos with Avocado & Salsa",
    description: "Тортильи с курицей, помидорами и авокадо.",
    servings: 1,
    prepTime: 20,
    calories: 680,
    protein: 40,
    cuisines: ["mexican"],
    vibes: ["fakeway", "speedy-meals"],
  },
  {
    id: "spaghetti-bolognese",
    name: "Spaghetti Bolognese",
    description: "Паста с говяжьим фаршем и томатами.",
    servings: 1,
    prepTime: 35,
    calories: 720,
    protein: 34,
    cuisines: ["italian"],
    vibes: ["home-style", "family-favs"],
  },
  {
    id: "butter-chicken",
    name: "Butter Chicken with Rice",
    description: "Куриные бёдра в йогуртово-томатном соусе с рисом.",
    servings: 1,
    prepTime: 40,
    calories: 700,
    protein: 38,
    cuisines: ["indian"],
    vibes: ["home-style", "protein-packed"],
  },
  {
    id: "mediterranean-chicken-bowl",
    name: "Mediterranean Chicken Bowl",
    description: "Курица, кускус, нут, помидоры и фета.",
    servings: 1,
    prepTime: 25,
    calories: 610,
    protein: 44,
    cuisines: ["mediterranean"],
    vibes: ["healthy-comfort"],
  },
  {
    id: "polish-chicken-soup",
    name: "Polish Chicken Soup",
    description: "Бульон с курицей, картофелем, морковью и капустой.",
    servings: 1,
    prepTime: 45,
    calories: 420,
    protein: 30,
    cuisines: ["polish"],
    vibes: ["home-style", "family-favs"],
  },
];

function line(
  recipeId: string,
  productId: string,
  quantity: number,
  unit: SupplyIngredient["unit"],
  isPantryIngredient = false,
): SupplyIngredient {
  return { id: `${recipeId}:${productId}`, recipeId, productId, quantity, unit, isPantryIngredient };
}

export const SUPPLY_INGREDIENTS: SupplyIngredient[] = [
  line("chicken-teriyaki-bowl", "chicken-breast", 300, "g"),
  line("chicken-teriyaki-bowl", "rice", 150, "g"),
  line("chicken-teriyaki-bowl", "broccoli", 200, "g"),
  line("chicken-teriyaki-bowl", "soy-sauce", 30, "ml", true),
  line("chicken-teriyaki-bowl", "honey", 15, "g", true),
  line("chicken-teriyaki-bowl", "garlic", 2, "pc"),
  line("chicken-teriyaki-bowl", "ginger", 10, "g"),
  line("chicken-tacos", "chicken-breast", 300, "g"),
  line("chicken-tacos", "tortilla-wraps", 4, "pc"),
  line("chicken-tacos", "tomatoes", 150, "g"),
  line("chicken-tacos", "avocado", 1, "pc"),
  line("chicken-tacos", "onion", 40, "g"),
  line("spaghetti-bolognese", "ground-beef", 180, "g"),
  line("spaghetti-bolognese", "pasta", 150, "g"),
  line("spaghetti-bolognese", "canned-tomatoes", 200, "g"),
  line("spaghetti-bolognese", "onion", 50, "g"),
  line("spaghetti-bolognese", "garlic", 1, "pc"),
  line("spaghetti-bolognese", "olive-oil", 10, "ml", true),
  line("butter-chicken", "chicken-thighs", 250, "g"),
  line("butter-chicken", "rice", 150, "g"),
  line("butter-chicken", "greek-yogurt", 80, "g"),
  line("butter-chicken", "canned-tomatoes", 120, "g"),
  line("butter-chicken", "onion", 40, "g"),
  line("butter-chicken", "garlic", 2, "pc"),
  line("mediterranean-chicken-bowl", "chicken-breast", 220, "g"),
  line("mediterranean-chicken-bowl", "couscous", 80, "g"),
  line("mediterranean-chicken-bowl", "chickpeas", 100, "g"),
  line("mediterranean-chicken-bowl", "tomatoes", 80, "g"),
  line("mediterranean-chicken-bowl", "feta", 40, "g"),
  line("mediterranean-chicken-bowl", "olive-oil", 10, "ml", true),
  line("polish-chicken-soup", "chicken-thighs", 200, "g"),
  line("polish-chicken-soup", "carrots", 80, "g"),
  line("polish-chicken-soup", "potatoes", 150, "g"),
  line("polish-chicken-soup", "onion", 40, "g"),
  line("polish-chicken-soup", "garlic", 1, "pc"),
  line("polish-chicken-soup", "cabbage", 60, "g"),
];

type Pack = {
  id: string;
  productId: string;
  packageQuantity: number;
  packageUnit: StoreProduct["packageUnit"];
  price: number;
  saleMode?: StoreProduct["saleMode"];
};

const packs: Pack[] = [
  { id: "biedronka-chicken-breast-500", productId: "chicken-breast", packageQuantity: 500, packageUnit: "g", price: 12.99 },
  { id: "biedronka-chicken-breast-1000", productId: "chicken-breast", packageQuantity: 1000, packageUnit: "g", price: 22.99 },
  { id: "biedronka-chicken-thighs-500", productId: "chicken-thighs", packageQuantity: 500, packageUnit: "g", price: 11.49 },
  { id: "biedronka-ground-beef-500", productId: "ground-beef", packageQuantity: 500, packageUnit: "g", price: 16.99 },
  { id: "biedronka-turkey-mince-500", productId: "turkey-mince", packageQuantity: 500, packageUnit: "g", price: 14.99 },
  { id: "biedronka-eggs-10", productId: "eggs", packageQuantity: 10, packageUnit: "pc", price: 12.49 },
  { id: "biedronka-salmon-300", productId: "salmon", packageQuantity: 300, packageUnit: "g", price: 24.99 },
  { id: "biedronka-tuna-120", productId: "tuna", packageQuantity: 120, packageUnit: "g", price: 5.49 },
  { id: "biedronka-rice-500", productId: "rice", packageQuantity: 500, packageUnit: "g", price: 4.99 },
  { id: "biedronka-rice-1000", productId: "rice", packageQuantity: 1000, packageUnit: "g", price: 7.99 },
  { id: "biedronka-rice-2000", productId: "rice", packageQuantity: 2000, packageUnit: "g", price: 13.99 },
  { id: "biedronka-pasta-500", productId: "pasta", packageQuantity: 500, packageUnit: "g", price: 3.79 },
  { id: "biedronka-potatoes-1000", productId: "potatoes", packageQuantity: 1000, packageUnit: "g", price: 2.99, saleMode: "weight" },
  { id: "biedronka-sweet-potatoes-1000", productId: "sweet-potatoes", packageQuantity: 1000, packageUnit: "g", price: 5.99, saleMode: "weight" },
  { id: "biedronka-tortilla-6", productId: "tortilla-wraps", packageQuantity: 6, packageUnit: "pc", price: 5.49 },
  { id: "biedronka-bread-1", productId: "bread", packageQuantity: 1, packageUnit: "pc", price: 4.29 },
  { id: "biedronka-couscous-500", productId: "couscous", packageQuantity: 500, packageUnit: "g", price: 4.49 },
  { id: "biedronka-buckwheat-1000", productId: "buckwheat", packageQuantity: 1000, packageUnit: "g", price: 6.99 },
  { id: "biedronka-oats-500", productId: "oats", packageQuantity: 500, packageUnit: "g", price: 3.49 },
  { id: "biedronka-tomatoes-1000", productId: "tomatoes", packageQuantity: 1000, packageUnit: "g", price: 9.99, saleMode: "weight" },
  { id: "biedronka-canned-tomatoes-400", productId: "canned-tomatoes", packageQuantity: 400, packageUnit: "g", price: 3.29 },
  { id: "biedronka-onion-1000", productId: "onion", packageQuantity: 1000, packageUnit: "g", price: 2.99, saleMode: "weight" },
  { id: "biedronka-garlic-1", productId: "garlic", packageQuantity: 1, packageUnit: "pc", price: 1.79 },
  { id: "biedronka-broccoli-500", productId: "broccoli", packageQuantity: 500, packageUnit: "g", price: 5.49 },
  { id: "biedronka-carrots-1000", productId: "carrots", packageQuantity: 1000, packageUnit: "g", price: 2.99, saleMode: "weight" },
  { id: "biedronka-bell-pepper-200", productId: "bell-pepper", packageQuantity: 200, packageUnit: "g", price: 3.49 },
  { id: "biedronka-spinach-100", productId: "spinach", packageQuantity: 100, packageUnit: "g", price: 5.49 },
  { id: "biedronka-mushrooms-400", productId: "mushrooms", packageQuantity: 400, packageUnit: "g", price: 6.99 },
  { id: "biedronka-cabbage-1000", productId: "cabbage", packageQuantity: 1000, packageUnit: "g", price: 3.49, saleMode: "weight" },
  { id: "biedronka-sauerkraut-500", productId: "sauerkraut", packageQuantity: 500, packageUnit: "g", price: 4.29 },
  { id: "biedronka-avocado-1", productId: "avocado", packageQuantity: 1, packageUnit: "pc", price: 5.99 },
  { id: "biedronka-chickpeas-400", productId: "chickpeas", packageQuantity: 400, packageUnit: "g", price: 2.99 },
  { id: "biedronka-black-beans-400", productId: "black-beans", packageQuantity: 400, packageUnit: "g", price: 3.49 },
  { id: "biedronka-lentils-500", productId: "lentils", packageQuantity: 500, packageUnit: "g", price: 4.99 },
  { id: "biedronka-greek-yogurt-400", productId: "greek-yogurt", packageQuantity: 400, packageUnit: "g", price: 4.99 },
  { id: "biedronka-cottage-cheese-200", productId: "cottage-cheese", packageQuantity: 200, packageUnit: "g", price: 3.99 },
  { id: "biedronka-mozzarella-125", productId: "mozzarella", packageQuantity: 125, packageUnit: "g", price: 4.49 },
  { id: "biedronka-feta-200", productId: "feta", packageQuantity: 200, packageUnit: "g", price: 6.99 },
  { id: "biedronka-cheddar-200", productId: "cheddar", packageQuantity: 200, packageUnit: "g", price: 7.49 },
  { id: "biedronka-parmesan-100", productId: "parmesan", packageQuantity: 100, packageUnit: "g", price: 8.99 },
  { id: "biedronka-olive-oil-500", productId: "olive-oil", packageQuantity: 500, packageUnit: "ml", price: 18.99 },
  { id: "biedronka-soy-sauce-150", productId: "soy-sauce", packageQuantity: 150, packageUnit: "ml", price: 6.49 },
  { id: "biedronka-honey-250", productId: "honey", packageQuantity: 250, packageUnit: "g", price: 9.99 },
  { id: "biedronka-ginger-100", productId: "ginger", packageQuantity: 100, packageUnit: "g", price: 3.99 },
  { id: "biedronka-strawberries-500", productId: "strawberries", packageQuantity: 500, packageUnit: "g", price: 12.99 },
];

export const SUPPLY_STORE_PRODUCTS: StoreProduct[] = packs.map((pack) => {
  const product = SUPPLY_PRODUCTS.find((item) => item.id === pack.productId);
  return {
    id: pack.id,
    productId: pack.productId,
    storeId: SUPPLY_STORE.id,
    name: product?.name ?? pack.productId,
    brand: null,
    packageQuantity: pack.packageQuantity,
    packageUnit: pack.packageUnit,
    sku: null,
    saleMode: pack.saleMode ?? "package",
  };
});

export const SUPPLY_PRICES: PricePoint[] = packs.map((pack) => ({
  id: `${pack.id}-2026-10-01`,
  storeProductId: pack.id,
  price: pack.price,
  validFrom: "2026-10-01",
  validTo: null,
}));

export const SUPPLY_PROMOTIONS: StorePromotion[] = [
  {
    id: "promo-strawberries-2026-10",
    storeProductId: "biedronka-strawberries-500",
    regularPrice: 12.99,
    promotionPrice: 7.99,
    validFrom: "2026-10-01",
    validTo: "2026-10-07",
  },
];
