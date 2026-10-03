export type MeatPref = "any" | "chicken" | "beef" | "pork" | "fish";
export type DietNeed = "none" | "vegetarian" | "vegan" | "pescatarian";
export type DietStyle =
  | "healthy-comfort"
  | "protein-packed"
  | "speedy-meals"
  | "low-calories"
  | "family-favs"
  | "fakeway"
  | "gut-friendly"
  | "home-style";
export type Allergen = "gluten" | "lactose" | "eggs" | "fish" | "soy";
export type Protein = "chicken" | "beef" | "pork" | "fish" | "veg";
export type Appliance = "stove" | "oven" | "microwave" | "blender" | "airfryer";
export type Cuisine = "mexican" | "italian" | "indian" | "asian" | "mediterranean" | "polish" | "fusion";
export type Unit = "kg" | "szt" | "l" | "opak";
export type IngredientKind = "core" | "seasonal" | "specialty";

export type Product = {
  id: string;
  namePl: string;
  category: string;
  unit: Unit;
  /** Что покрывает regularPricePln: «1 kg», «10 szt». */
  pack: string;
  kind: IngredientKind;
  /** Справочная цена. Не значит, что товар лежит в конкретной Biedronka. */
  estimatePricePln: number;
  regularPricePln: number;
  /** true только если цену сняли с карточки магазина или с газетки. */
  priceConfirmed: boolean;
  priceCheckedAt?: string;
  /** Чем заменить specialty, если самой позиции на полке нет. */
  substituteId?: string;
};

export type Promotion = {
  id: string;
  productId: string;
  promoPricePln: number;
  validFrom: string;
  validTo: string;
  label: string;
  /** Leaflet "was" price. null/omitted = use the shelf price. */
  regularPricePln?: number | null;
};

export type Recipe = {
  id: string;
  title: string;
  vibes: DietStyle[];
  allergens: Allergen[];
  proteins: Protein[];
  /** Кто может это есть. Пусто — только без диетических ограничений. */
  diets: DietNeed[];
  appliances: Appliance[];
  cuisines: Cuisine[];
  /** Путь к фото, если файл уже лежит в public. Пусто — слот без картинки. */
  image?: string;
};

export type PantryItem = {
  recipeId: string;
  name: string;
  grams?: number;
};

export type RecipeIngredient = {
  recipeId: string;
  productId: string;
  qtyPerPerson: number;
};

export type Cooking = {
  minutes: number;
  protein: number;
  fat: number;
  carbs: number;
  kcal?: number;
  steps: string[];
};

export type Catalog = {
  products: Product[];
  promotions: Promotion[];
  recipes: Recipe[];
  ingredients: RecipeIngredient[];
  cooking: Record<string, Cooking>;
  pantry: PantryItem[];
};

export type Profile = {
  userId: string;
  name: string;
  city: string;
  store: "biedronka";
  allergies: Allergen[];
  meatPref: MeatPref;
  diet: DietNeed;
  dietStyle: DietStyle;
  appliances: Appliance[];
  householdSize: number;
  shopWeekday: number;
  /** Weekdays to cook, 0 = Sunday … 6 = Saturday. */
  cookDays: number[];
  weeklyBudgetPln: number;
  dailyKcal: number;
  /** 1 Simple, 3 Balanced, 5 Gourmet. */
  menuLevel: number;
};

export type BasketLine = {
  productId: string;
  namePl: string;
  category: string;
  qty: number;
  unit: Unit;
  unitPrice: number;
  regularUnitPrice: number;
  lineTotal: number;
  regularLineTotal: number;
  onPromo: boolean;
  /** Обычная цена не подтверждена: сумма ориентир, экономию по строке не считаем. */
  approx: boolean;
};

export type PlanMeal = {
  dayIndex: number;
  date: string;
  recipeId: string;
  title: string;
  cost: number;
};

export type PlanView = {
  id: string;
  shopDate: string;
  householdSize: number;
  meals: PlanMeal[];
  lines: BasketLine[];
  total: number;
  regularTotal: number;
  saved: number;
};

export const CATEGORY_ORDER = ["vegetables", "meat", "fish", "dairy", "grocery"];
