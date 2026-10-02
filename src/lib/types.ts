export type MeatPref = "any" | "chicken" | "beef" | "pork" | "fish";
export type DietNeed = "none" | "vegetarian" | "vegan" | "pescatarian";
export type DietStyle = "healthy" | "sport" | "balanced" | "comfort";
export type Allergen = "gluten" | "lactose" | "eggs" | "fish" | "soy";
export type Protein = "chicken" | "beef" | "pork" | "fish" | "veg";
export type Appliance = "stove" | "oven" | "microwave" | "blender" | "airfryer";
export type Unit = "kg" | "szt" | "l" | "opak";

export type Product = {
  id: string;
  namePl: string;
  category: string;
  unit: Unit;
  regularPricePln: number;
};

export type Promotion = {
  id: string;
  productId: string;
  promoPricePln: number;
  validFrom: string;
  validTo: string;
  label: "gazetka-pon" | "gazetka-czw";
};

export type Recipe = {
  id: string;
  title: string;
  dietStyles: DietStyle[];
  allergens: Allergen[];
  proteins: Protein[];
  isVegan: boolean;
  appliances: Appliance[];
};

export type RecipeIngredient = {
  recipeId: string;
  productId: string;
  qtyPerPerson: number;
};

export type Catalog = {
  products: Product[];
  promotions: Promotion[];
  recipes: Recipe[];
  ingredients: RecipeIngredient[];
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
  weeklyBudgetPln: number;
};

export type BasketLine = {
  productId: string;
  namePl: string;
  category: string;
  qty: number;
  unit: Unit;
  unitPrice: number;
  lineTotal: number;
  regularLineTotal: number;
  onPromo: boolean;
};

export type PlanMeal = {
  dayIndex: number;
  date: string;
  recipeId: string;
  title: string;
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

export const CATEGORY_ORDER = ["Овощи", "Мясо", "Рыба", "Молочка", "Бакалея"];
