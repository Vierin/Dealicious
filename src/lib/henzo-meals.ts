import type { Appliance, Cuisine, DietStyle, Protein } from "./types";

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
}[] = [
  {
    "id": "h01",
    "title": "Tacos z kurczakiem, awokado i salsą",
    "cuisines": [
      "mexican"
    ],
    "vibes": [
      "protein-packed",
      "speedy-meals"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 7,
    "protein": 46,
    "fat": 20,
    "carbs": 38,
    "kcal": 520,
    "paid": [
      [
        "kurczak",
        0.15
      ],
      [
        "tortilla-kukurydza",
        0.5
      ],
      [
        "awokado",
        0.375
      ],
      [
        "pomidory",
        0.08
      ],
      [
        "cebula",
        0.03
      ],
      [
        "limonka",
        0.5
      ],
      [
        "oliwa",
        0.005
      ]
    ],
    "pantry": [
      {
        "name": "Kumin",
        "grams": 2
      },
      {
        "name": "Papryka mielona",
        "grams": 2
      },
      {
        "name": "Sól",
        "grams": 2
      }
    ],
    "steps": [
      "Przyprawionego kurczaka smaż na oleju 5–7 minut z każdej strony i pokrój.",
      "Podgrzej tortille.",
      "Nałóż kurczaka, awokado, pomidora i cebulę, na koniec skrop limonką."
    ]
  },
  {
    "id": "h02",
    "title": "Miska burrito z wołowiną i fasolą",
    "cuisines": [
      "mexican"
    ],
    "vibes": [
      "protein-packed",
      "healthy-comfort"
    ],
    "proteins": [
      "beef"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 30,
    "protein": 48,
    "fat": 24,
    "carbs": 65,
    "kcal": 680,
    "paid": [
      [
        "mielone",
        0.15
      ],
      [
        "ryz",
        0.06
      ],
      [
        "fasola-czarna",
        0.417
      ],
      [
        "kukurydza",
        0.429
      ],
      [
        "pomidory",
        0.08
      ],
      [
        "awokado",
        0.313
      ],
      [
        "jogurt-grecki",
        0.267
      ],
      [
        "limonka",
        0.5
      ]
    ],
    "pantry": [
      {
        "name": "Kumin",
        "grams": 2
      },
      {
        "name": "Papryka mielona",
        "grams": 2
      }
    ],
    "steps": [
      "Wołowinę zrumień z kuminem i papryką.",
      "W misce ułóż ciepły ryż, fasolę, kukurydzę, mięso i pomidora.",
      "Dodaj awokado i jogurt, skrop limonką."
    ]
  },
  {
    "id": "h03",
    "title": "Quesadilla z kurczakiem",
    "cuisines": [
      "mexican"
    ],
    "vibes": [
      "family-favs",
      "fakeway"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 30,
    "protein": 50,
    "fat": 24,
    "carbs": 48,
    "kcal": 610,
    "paid": [
      [
        "kurczak",
        0.14
      ],
      [
        "tortilla",
        0.333
      ],
      [
        "cheddar",
        0.05
      ],
      [
        "papryka",
        0.07
      ],
      [
        "cebula",
        0.04
      ],
      [
        "oliwa",
        0.005
      ],
      [
        "salsa",
        0.2
      ]
    ],
    "pantry": [],
    "steps": [
      "Usmaż kurczaka z papryką i cebulą.",
      "Na tortillę połóż farsz i cheddar, przykryj drugą i opiecz z obu stron, aż ser się stopi.",
      "Podawaj z salsą."
    ]
  },
  {
    "id": "h04",
    "title": "Chili z indyka i fasoli",
    "cuisines": [
      "mexican"
    ],
    "vibes": [
      "protein-packed",
      "home-style"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 25,
    "protein": 50,
    "fat": 16,
    "carbs": 42,
    "kcal": 520,
    "paid": [
      [
        "indyk",
        0.18
      ],
      [
        "fasola",
        0.5
      ],
      [
        "pomidory-puszka",
        0.5
      ],
      [
        "cebula",
        0.07
      ],
      [
        "papryka",
        0.08
      ],
      [
        "czosnek",
        0.12
      ],
      [
        "oliwa",
        0.005
      ]
    ],
    "pantry": [
      {
        "name": "Chili",
        "grams": 1
      },
      {
        "name": "Kumin",
        "grams": 2
      },
      {
        "name": "Papryka mielona",
        "grams": 2
      }
    ],
    "steps": [
      "Podsmaż cebulę, paprykę i czosnek. Dodaj indyka i zrumień.",
      "Wlej pomidory, dodaj fasolę i przyprawy. Duś 20–25 minut, aż zgęstnieje."
    ]
  },
  {
    "id": "h05",
    "title": "Kurczak z ryżem po meksykańsku",
    "cuisines": [
      "mexican"
    ],
    "vibes": [
      "family-favs",
      "speedy-meals"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 7,
    "protein": 48,
    "fat": 14,
    "carbs": 66,
    "kcal": 610,
    "paid": [
      [
        "kurczak",
        0.15
      ],
      [
        "ryz",
        0.072
      ],
      [
        "pomidory-puszka",
        0.375
      ],
      [
        "papryka",
        0.08
      ],
      [
        "cebula",
        0.05
      ],
      [
        "kukurydza",
        0.429
      ],
      [
        "oliwa",
        0.005
      ]
    ],
    "pantry": [
      {
        "name": "Papryka mielona",
        "grams": 2
      },
      {
        "name": "Kumin",
        "grams": 2
      }
    ],
    "steps": [
      "Zrumień kawałki kurczaka. Dodaj cebulę i paprykę, potem pomidory i przyprawy.",
      "Wmieszaj ugotowany ryż i kukurydzę, grzej 5–7 minut."
    ]
  },
  {
    "id": "h06",
    "title": "Miska fajita z wołowiną",
    "cuisines": [
      "mexican"
    ],
    "vibes": [
      "protein-packed",
      "speedy-meals"
    ],
    "proteins": [
      "beef"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 30,
    "protein": 45,
    "fat": 23,
    "carbs": 61,
    "kcal": 650,
    "paid": [
      [
        "wolowina",
        0.16
      ],
      [
        "ryz",
        0.064
      ],
      [
        "papryka",
        0.1
      ],
      [
        "cebula",
        0.06
      ],
      [
        "awokado",
        0.313
      ],
      [
        "oliwa",
        0.005
      ],
      [
        "limonka",
        0.5
      ]
    ],
    "pantry": [
      {
        "name": "Papryka mielona",
        "grams": 2
      },
      {
        "name": "Kumin",
        "grams": 2
      }
    ],
    "steps": [
      "Wołowinę szybko obsmaż na dużym ogniu.",
      "Dodaj paprykę i cebulę i smaż, aż lekko się przypalą.",
      "Podawaj na ryżu z awokado i limonką."
    ]
  },
  {
    "id": "h07",
    "title": "Zapiekanka enchilada z kurczakiem",
    "cuisines": [
      "mexican"
    ],
    "vibes": [
      "family-favs",
      "fakeway"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "oven"
    ],
    "minutes": 20,
    "protein": 55,
    "fat": 21,
    "carbs": 51,
    "kcal": 650,
    "paid": [
      [
        "kurczak",
        0.16
      ],
      [
        "tortilla-kukurydza",
        0.667
      ],
      [
        "passata",
        0.36
      ],
      [
        "cheddar",
        0.05
      ],
      [
        "fasola-czarna",
        0.333
      ],
      [
        "cebula",
        0.04
      ],
      [
        "jogurt-grecki",
        0.2
      ]
    ],
    "pantry": [],
    "steps": [
      "Ugotowanego kurczaka, fasolę i cebulę zawiń w tortille.",
      "Ułóż w naczyniu, polej sosem i posyp cheddarem.",
      "Piecz 20 minut w 190°C, na wierzch daj jogurt."
    ]
  },
  {
    "id": "h08",
    "title": "Wrap z tuńczykiem i kukurydzą",
    "cuisines": [
      "mexican"
    ],
    "vibes": [
      "speedy-meals",
      "low-calories"
    ],
    "proteins": [
      "fish"
    ],
    "isVegan": false,
    "appliances": [],
    "minutes": 30,
    "protein": 35,
    "fat": 8,
    "carbs": 43,
    "kcal": 390,
    "paid": [
      [
        "tunczyk",
        1
      ],
      [
        "tortilla",
        0.167
      ],
      [
        "kukurydza",
        0.429
      ],
      [
        "pomidory",
        0.08
      ],
      [
        "salata",
        0.25
      ],
      [
        "jogurt-grecki",
        0.333
      ],
      [
        "limonka",
        0.5
      ]
    ],
    "pantry": [
      {
        "name": "Pieprz",
        "grams": 1
      }
    ],
    "steps": [
      "Tuńczyka wymieszaj z jogurtem, limonką i pieprzem.",
      "Rozsmaruj na wrapie, dodaj kukurydzę, pomidora i sałatę.",
      "Zwiń ciasno i przekrój."
    ]
  },
  {
    "id": "h09",
    "title": "Tacos z batatem i czarną fasolą",
    "cuisines": [
      "mexican"
    ],
    "vibes": [
      "healthy-comfort",
      "gut-friendly"
    ],
    "proteins": [
      "veg"
    ],
    "isVegan": true,
    "appliances": [
      "oven"
    ],
    "minutes": 30,
    "protein": 17,
    "fat": 17,
    "carbs": 79,
    "kcal": 560,
    "paid": [
      [
        "batat",
        0.22
      ],
      [
        "fasola-czarna",
        0.417
      ],
      [
        "tortilla-kukurydza",
        0.5
      ],
      [
        "awokado",
        0.313
      ],
      [
        "pomidory",
        0.08
      ],
      [
        "cebula",
        0.03
      ],
      [
        "limonka",
        0.5
      ]
    ],
    "pantry": [
      {
        "name": "Kumin",
        "grams": 2
      }
    ],
    "steps": [
      "Batata pokrój w kostkę i piecz 25–30 minut w 200°C z kuminem.",
      "Podgrzej tortille i nałóż batata, fasolę, awokado, pomidora i cebulę."
    ]
  },
  {
    "id": "h10",
    "title": "Miska nachos z kurczakiem",
    "cuisines": [
      "mexican"
    ],
    "vibes": [
      "fakeway",
      "family-favs"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 30,
    "protein": 49,
    "fat": 23,
    "carbs": 68,
    "kcal": 690,
    "paid": [
      [
        "kurczak",
        0.15
      ],
      [
        "ryz",
        0.052
      ],
      [
        "chipsy",
        0.233
      ],
      [
        "fasola-czarna",
        0.292
      ],
      [
        "kukurydza",
        0.357
      ],
      [
        "cheddar",
        0.035
      ],
      [
        "salsa",
        0.267
      ],
      [
        "awokado",
        0.25
      ]
    ],
    "pantry": [],
    "steps": [
      "Usmaż i pokrój kurczaka.",
      "W misce ułóż ryż, fasolę, kukurydzę i kurczaka.",
      "Dodaj pokruszone chipsy, ser, salsę i awokado."
    ]
  },
  {
    "id": "h11",
    "title": "Makaron z kurczakiem w kremowym sosie pomidorowym",
    "cuisines": [
      "italian"
    ],
    "vibes": [
      "home-style",
      "family-favs"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 5,
    "protein": 52,
    "fat": 18,
    "carbs": 69,
    "kcal": 650,
    "paid": [
      [
        "kurczak",
        0.15
      ],
      [
        "penne",
        0.16
      ],
      [
        "passata",
        0.36
      ],
      [
        "smietanka",
        0.3
      ],
      [
        "parmezan",
        0.02
      ],
      [
        "czosnek",
        0.12
      ],
      [
        "oliwa",
        0.005
      ]
    ],
    "pantry": [
      {
        "name": "Zioła",
        "grams": 1
      }
    ],
    "steps": [
      "Ugotuj makaron. Kurczaka zrumień z czosnkiem, dodaj passatę i śmietankę, duś 5 minut.",
      "Wymieszaj z makaronem i parmezanem."
    ]
  },
  {
    "id": "h12",
    "title": "Spaghetti bolognese",
    "cuisines": [
      "italian"
    ],
    "vibes": [
      "family-favs",
      "home-style"
    ],
    "proteins": [
      "beef"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 20,
    "protein": 47,
    "fat": 20,
    "carbs": 78,
    "kcal": 700,
    "paid": [
      [
        "mielone",
        0.15
      ],
      [
        "spaghetti",
        0.18
      ],
      [
        "passata",
        0.44
      ],
      [
        "cebula",
        0.06
      ],
      [
        "marchew",
        0.05
      ],
      [
        "czosnek",
        0.12
      ],
      [
        "oliwa",
        0.005
      ],
      [
        "parmezan",
        0.015
      ]
    ],
    "pantry": [],
    "steps": [
      "Podsmaż cebulę i marchewkę, dodaj wołowinę i zrumień.",
      "Wlej passatę i duś 20 minut.",
      "Ugotuj spaghetti, wymieszaj z sosem i posyp parmezanem."
    ]
  },
  {
    "id": "h13",
    "title": "Makaron z kurczakiem i pesto",
    "cuisines": [
      "italian"
    ],
    "vibes": [
      "speedy-meals",
      "protein-packed"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 30,
    "protein": 55,
    "fat": 22,
    "carbs": 65,
    "kcal": 670,
    "paid": [
      [
        "kurczak",
        0.15
      ],
      [
        "penne",
        0.16
      ],
      [
        "pesto",
        0.158
      ],
      [
        "pomidory",
        0.1
      ],
      [
        "szpinak",
        0.5
      ],
      [
        "parmezan",
        0.015
      ]
    ],
    "pantry": [],
    "steps": [
      "Ugotuj makaron i zostaw odrobinę wody z gotowania. Kurczaka usmaż na patelni.",
      "Makaron wymieszaj z pesto, pomidorami, szpinakiem i wodą z makaronu. Dodaj kurczaka i parmezan."
    ]
  },
  {
    "id": "h14",
    "title": "Makaron z tuńczykiem i pomidorami",
    "cuisines": [
      "italian"
    ],
    "vibes": [
      "speedy-meals",
      "protein-packed"
    ],
    "proteins": [
      "fish"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 5,
    "protein": 38,
    "fat": 10,
    "carbs": 73,
    "kcal": 560,
    "paid": [
      [
        "tunczyk",
        1
      ],
      [
        "penne",
        0.16
      ],
      [
        "pomidory",
        0.15
      ],
      [
        "passata",
        0.24
      ],
      [
        "czosnek",
        0.12
      ],
      [
        "oliwa",
        0.005
      ]
    ],
    "pantry": [
      {
        "name": "Pietruszka",
        "grams": 3
      }
    ],
    "steps": [
      "Ugotuj makaron. Czosnek i pomidory podsmaż, dodaj passatę i odsączonego tuńczyka.",
      "Duś 5 minut, wymieszaj z makaronem i pietruszką."
    ]
  },
  {
    "id": "h15",
    "title": "Makaron z kiełbasą i pomidorami z jednej patelni",
    "cuisines": [
      "italian"
    ],
    "vibes": [
      "home-style",
      "speedy-meals"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 30,
    "protein": 36,
    "fat": 25,
    "carbs": 71,
    "kcal": 680,
    "paid": [
      [
        "kielbasa",
        0.15
      ],
      [
        "penne",
        0.16
      ],
      [
        "pomidory-puszka",
        0.5
      ],
      [
        "cebula",
        0.06
      ],
      [
        "szpinak",
        0.5
      ],
      [
        "mozzarella",
        0.03
      ],
      [
        "oliwa",
        0.005
      ]
    ],
    "pantry": [],
    "steps": [
      "Kiełbasę i cebulę zrumień na dużej patelni.",
      "Dodaj pomidory, makaron i tyle wody, żeby makaron się ugotował.",
      "Gotuj do miękkości, wmieszaj szpinak i mozzarellę."
    ]
  },
  {
    "id": "h16",
    "title": "Zapiekanka z makaronem, szpinakiem i ricottą",
    "cuisines": [
      "italian"
    ],
    "vibes": [
      "healthy-comfort",
      "family-favs"
    ],
    "proteins": [
      "veg"
    ],
    "isVegan": false,
    "appliances": [
      "stove",
      "oven"
    ],
    "minutes": 20,
    "protein": 33,
    "fat": 23,
    "carbs": 72,
    "kcal": 650,
    "paid": [
      [
        "penne",
        0.15
      ],
      [
        "ricotta",
        0.1
      ],
      [
        "szpinak",
        1
      ],
      [
        "passata",
        0.36
      ],
      [
        "mozzarella",
        0.04
      ],
      [
        "czosnek",
        0.12
      ],
      [
        "parmezan",
        0.01
      ]
    ],
    "pantry": [],
    "steps": [
      "Makaron ugotuj prawie al dente. Wymieszaj z ricottą, szpinakiem, czosnkiem i passatą.",
      "Przełóż do naczynia, posyp mozzarellą i parmezanem. Piecz 20 minut w 190°C."
    ]
  },
  {
    "id": "h17",
    "title": "Makaron z kurczakiem, czosnkiem i brokułami",
    "cuisines": [
      "italian"
    ],
    "vibes": [
      "protein-packed",
      "healthy-comfort"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 30,
    "protein": 57,
    "fat": 18,
    "carbs": 62,
    "kcal": 640,
    "paid": [
      [
        "kurczak",
        0.16
      ],
      [
        "penne",
        0.16
      ],
      [
        "brokuly",
        0.375
      ],
      [
        "czosnek",
        0.24
      ],
      [
        "parmezan",
        0.02
      ],
      [
        "oliwa",
        0.01
      ],
      [
        "cytryna",
        1
      ]
    ],
    "pantry": [],
    "steps": [
      "Ugotuj makaron i brokuły. Kurczaka obsmaż z czosnkiem i oliwą.",
      "Wymieszaj makaron i brokuły z kurczakiem, sokiem z cytryny i parmezanem."
    ]
  },
  {
    "id": "h18",
    "title": "Gnocchi z pomidorami i mozzarellą",
    "cuisines": [
      "italian"
    ],
    "vibes": [
      "home-style",
      "speedy-meals"
    ],
    "proteins": [
      "veg"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 7,
    "protein": 24,
    "fat": 22,
    "carbs": 79,
    "kcal": 620,
    "paid": [
      [
        "gnocchi",
        0.25
      ],
      [
        "pomidory",
        0.18
      ],
      [
        "mozzarella",
        0.08
      ],
      [
        "passata",
        0.24
      ],
      [
        "czosnek",
        0.12
      ],
      [
        "oliwa",
        0.005
      ]
    ],
    "pantry": [
      {
        "name": "Bazylia",
        "grams": 2
      }
    ],
    "steps": [
      "Gnocchi podsmaż na patelni, aż się zezłocą.",
      "Dodaj czosnek, pomidory i passatę, duś 5–7 minut.",
      "Wmieszaj mozzarellę i bazylię, aż ser zmięknie."
    ]
  },
  {
    "id": "h19",
    "title": "Makaron z tuńczykiem po śródziemnomorsku",
    "cuisines": [
      "italian"
    ],
    "vibes": [
      "low-calories",
      "protein-packed"
    ],
    "proteins": [
      "fish"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 30,
    "protein": 39,
    "fat": 18,
    "carbs": 65,
    "kcal": 570,
    "paid": [
      [
        "penne",
        0.15
      ],
      [
        "tunczyk",
        1
      ],
      [
        "pomidory",
        0.12
      ],
      [
        "ogorki",
        0.08
      ],
      [
        "oliwki",
        0.125
      ],
      [
        "feta",
        0.2
      ],
      [
        "oliwa",
        0.005
      ],
      [
        "cytryna",
        1
      ]
    ],
    "pantry": [],
    "steps": [
      "Makaron ugotuj i lekko ostudź.",
      "Wymieszaj z tuńczykiem, warzywami, oliwkami i fetą.",
      "Skrop sokiem z cytryny i oliwą."
    ]
  },
  {
    "id": "h20",
    "title": "Makaron z kurczakiem arrabbiata",
    "cuisines": [
      "italian"
    ],
    "vibes": [
      "speedy-meals",
      "protein-packed"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 8,
    "protein": 52,
    "fat": 15,
    "carbs": 69,
    "kcal": 620,
    "paid": [
      [
        "kurczak",
        0.15
      ],
      [
        "penne",
        0.16
      ],
      [
        "passata",
        0.4
      ],
      [
        "czosnek",
        0.12
      ],
      [
        "oliwa",
        0.005
      ],
      [
        "parmezan",
        0.015
      ]
    ],
    "pantry": [
      {
        "name": "Chili",
        "grams": 1
      },
      {
        "name": "Pietruszka",
        "grams": 3
      }
    ],
    "steps": [
      "Ugotuj makaron. Kurczaka obsmaż z czosnkiem i chili.",
      "Dodaj passatę i duś 8 minut. Wymieszaj z makaronem i parmezanem."
    ]
  },
  {
    "id": "h21",
    "title": "Makaron z kurczakiem i pieczarkami w śmietanie",
    "cuisines": [
      "italian"
    ],
    "vibes": [
      "home-style",
      "family-favs"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 30,
    "protein": 54,
    "fat": 22,
    "carbs": 67,
    "kcal": 680,
    "paid": [
      [
        "kurczak",
        0.15
      ],
      [
        "penne",
        0.16
      ],
      [
        "pieczarki",
        0.15
      ],
      [
        "smietanka",
        0.4
      ],
      [
        "parmezan",
        0.02
      ],
      [
        "czosnek",
        0.12
      ],
      [
        "oliwa",
        0.005
      ]
    ],
    "pantry": [],
    "steps": [
      "Ugotuj makaron. Pieczarki i kurczaka podsmaż z czosnkiem.",
      "Dodaj śmietankę i parmezan, chwilę pogotuj. Wymieszaj z makaronem."
    ]
  },
  {
    "id": "h22",
    "title": "Kurczak z białą fasolą z patelni",
    "cuisines": [
      "italian"
    ],
    "vibes": [
      "protein-packed",
      "gut-friendly"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 15,
    "protein": 54,
    "fat": 14,
    "carbs": 38,
    "kcal": 500,
    "paid": [
      [
        "kurczak",
        0.16
      ],
      [
        "fasola-biala",
        0.542
      ],
      [
        "pomidory-puszka",
        0.45
      ],
      [
        "szpinak",
        0.7
      ],
      [
        "cebula",
        0.05
      ],
      [
        "czosnek",
        0.12
      ],
      [
        "oliwa",
        0.005
      ]
    ],
    "pantry": [
      {
        "name": "Zioła",
        "grams": 1
      }
    ],
    "steps": [
      "Kurczaka i cebulę zrumień. Dodaj pomidory, fasolę i zioła, duś 12–15 minut.",
      "Na końcu wmieszaj szpinak."
    ]
  },
  {
    "id": "h23",
    "title": "Klopsiki z indyka w sosie pomidorowym",
    "cuisines": [
      "italian"
    ],
    "vibes": [
      "protein-packed",
      "family-favs"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 20,
    "protein": 51,
    "fat": 22,
    "carbs": 34,
    "kcal": 540,
    "paid": [
      [
        "indyk",
        0.18
      ],
      [
        "jaja",
        0.1
      ],
      [
        "bulka-tarta",
        0.025
      ],
      [
        "passata",
        0.44
      ],
      [
        "cebula",
        0.05
      ],
      [
        "czosnek",
        0.12
      ],
      [
        "parmezan",
        0.015
      ],
      [
        "oliwa",
        0.005
      ]
    ],
    "pantry": [],
    "steps": [
      "Indyka wymieszaj z jajkiem, bułką tartą i przyprawami, uformuj klopsiki.",
      "Zrumień na patelni, zalej passatą i duś pod przykryciem 15–20 minut.",
      "Posyp parmezanem."
    ]
  },
  {
    "id": "h24",
    "title": "Kurczak caprese",
    "cuisines": [
      "italian"
    ],
    "vibes": [
      "healthy-comfort",
      "low-calories"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 30,
    "protein": 58,
    "fat": 21,
    "carbs": 13,
    "kcal": 490,
    "paid": [
      [
        "kurczak",
        0.17
      ],
      [
        "mozzarella",
        0.06
      ],
      [
        "pomidory",
        0.15
      ],
      [
        "oliwa",
        0.005
      ],
      [
        "salata",
        0.4
      ]
    ],
    "pantry": [
      {
        "name": "Bazylia",
        "grams": 2
      },
      {
        "name": "Glazura balsamiczna",
        "grams": 10
      }
    ],
    "steps": [
      "Kurczaka przypraw i obsmaż. Na wierzch połóż mozzarellę i pomidory, przykryj, aż ser zmięknie.",
      "Podawaj z bazylią, sałatą i glazurą balsamiczną."
    ]
  },
  {
    "id": "h25",
    "title": "Makaron z kurczakiem, cytryną i czosnkiem",
    "cuisines": [
      "italian"
    ],
    "vibes": [
      "speedy-meals",
      "healthy-comfort"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 30,
    "protein": 52,
    "fat": 19,
    "carbs": 67,
    "kcal": 650,
    "paid": [
      [
        "kurczak",
        0.15
      ],
      [
        "spaghetti",
        0.16
      ],
      [
        "cytryna",
        1
      ],
      [
        "czosnek",
        0.12
      ],
      [
        "parmezan",
        0.02
      ],
      [
        "oliwa",
        0.01
      ]
    ],
    "pantry": [
      {
        "name": "Pietruszka",
        "grams": 3
      }
    ],
    "steps": [
      "Ugotuj spaghetti. Kurczaka obsmaż z czosnkiem.",
      "Makaron wymieszaj z sokiem i skórką z cytryny, oliwą i parmezanem, dolej odrobinę wody z makaronu.",
      "Na wierzch połóż kurczaka i pietruszkę."
    ]
  },
  {
    "id": "h26",
    "title": "Kurczak maślany z ryżem",
    "cuisines": [
      "indian"
    ],
    "vibes": [
      "fakeway",
      "family-favs"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 30,
    "protein": 55,
    "fat": 21,
    "carbs": 61,
    "kcal": 680,
    "paid": [
      [
        "kurczak",
        0.17
      ],
      [
        "ryz",
        0.064
      ],
      [
        "jogurt-grecki",
        0.4
      ],
      [
        "passata",
        0.36
      ],
      [
        "cebula",
        0.06
      ],
      [
        "czosnek",
        0.12
      ],
      [
        "maslo",
        0.05
      ]
    ],
    "pantry": [
      {
        "name": "Garam masala",
        "grams": 2
      },
      {
        "name": "Curry",
        "grams": 3
      }
    ],
    "steps": [
      "Cebulę i przyprawy podsmaż na maśle. Dodaj kurczaka i zrumień, potem passatę i duś.",
      "Jogurt wmieszaj już poza ogniem. Podawaj z ryżem."
    ]
  },
  {
    "id": "h27",
    "title": "Kurczak tikka masala",
    "cuisines": [
      "indian"
    ],
    "vibes": [
      "fakeway",
      "protein-packed"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 15,
    "protein": 57,
    "fat": 15,
    "carbs": 62,
    "kcal": 650,
    "paid": [
      [
        "kurczak",
        0.17
      ],
      [
        "jogurt-grecki",
        0.467
      ],
      [
        "passata",
        0.4
      ],
      [
        "cebula",
        0.06
      ],
      [
        "czosnek",
        0.12
      ],
      [
        "ryz",
        0.06
      ],
      [
        "maslo",
        0.025
      ]
    ],
    "pantry": [
      {
        "name": "Garam masala",
        "grams": 2
      },
      {
        "name": "Papryka mielona",
        "grams": 2
      }
    ],
    "steps": [
      "Kurczaka zamarynuj 15 minut w jogurcie i przyprawach. Obsmaż do rumieńca.",
      "Duś z cebulą i sosem pomidorowym 15 minut. Podawaj z ryżem."
    ]
  },
  {
    "id": "h28",
    "title": "Curry z kurczakiem i mlekiem kokosowym",
    "cuisines": [
      "indian"
    ],
    "vibes": [
      "home-style",
      "protein-packed"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 15,
    "protein": 49,
    "fat": 22,
    "carbs": 60,
    "kcal": 650,
    "paid": [
      [
        "kurczak",
        0.16
      ],
      [
        "mleczko",
        0.375
      ],
      [
        "ryz",
        0.06
      ],
      [
        "cebula",
        0.06
      ],
      [
        "papryka",
        0.08
      ],
      [
        "czosnek",
        0.12
      ],
      [
        "limonka",
        0.5
      ]
    ],
    "pantry": [
      {
        "name": "Curry",
        "grams": 3
      }
    ],
    "steps": [
      "Kurczaka usmaż z cebulą i papryką.",
      "Dodaj curry i mleko kokosowe, duś 12–15 minut.",
      "Skrop limonką i podawaj z ryżem."
    ]
  },
  {
    "id": "h29",
    "title": "Curry z ciecierzycą i szpinakiem",
    "cuisines": [
      "indian"
    ],
    "vibes": [
      "gut-friendly",
      "healthy-comfort"
    ],
    "proteins": [
      "veg"
    ],
    "isVegan": true,
    "appliances": [
      "stove"
    ],
    "minutes": 15,
    "protein": 18,
    "fat": 19,
    "carbs": 65,
    "kcal": 520,
    "paid": [
      [
        "ciecierzyca",
        0.75
      ],
      [
        "szpinak",
        1.2
      ],
      [
        "mleczko",
        0.25
      ],
      [
        "pomidory-puszka",
        0.45
      ],
      [
        "cebula",
        0.06
      ],
      [
        "czosnek",
        0.12
      ],
      [
        "oliwa",
        0.005
      ]
    ],
    "pantry": [
      {
        "name": "Curry",
        "grams": 3
      }
    ],
    "steps": [
      "Cebulę i czosnek podsmaż z curry.",
      "Dodaj pomidory, ciecierzycę i mleko kokosowe, duś 15 minut.",
      "Wmieszaj szpinak, aż zwiędnie."
    ]
  },
  {
    "id": "h30",
    "title": "Dal z soczewicy z ryżem",
    "cuisines": [
      "indian"
    ],
    "vibes": [
      "gut-friendly",
      "low-calories"
    ],
    "proteins": [
      "veg"
    ],
    "isVegan": true,
    "appliances": [
      "stove"
    ],
    "minutes": 20,
    "protein": 25,
    "fat": 9,
    "carbs": 91,
    "kcal": 560,
    "paid": [
      [
        "soczewica",
        0.1
      ],
      [
        "ryz",
        0.052
      ],
      [
        "cebula",
        0.06
      ],
      [
        "pomidory-puszka",
        0.3
      ],
      [
        "czosnek",
        0.12
      ],
      [
        "oliwa",
        0.005
      ]
    ],
    "pantry": [
      {
        "name": "Kurkuma",
        "grams": 1
      },
      {
        "name": "Kumin",
        "grams": 2
      }
    ],
    "steps": [
      "Soczewicę opłucz. Cebulę i przyprawy podsmaż, dodaj soczewicę, pomidory i wodę.",
      "Duś 18–20 minut, aż będzie kremowa. Podawaj z ryżem."
    ]
  },
  {
    "id": "h31",
    "title": "Curry z kurczaka i pieczone warzywa",
    "cuisines": [
      "indian"
    ],
    "vibes": [
      "protein-packed",
      "healthy-comfort"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "stove",
      "oven"
    ],
    "minutes": 30,
    "protein": 52,
    "fat": 17,
    "carbs": 53,
    "kcal": 570,
    "paid": [
      [
        "kurczak",
        0.16
      ],
      [
        "ziemniaki",
        0.2
      ],
      [
        "cukinia",
        0.1
      ],
      [
        "marchew",
        0.08
      ],
      [
        "oliwa",
        0.01
      ],
      [
        "jogurt",
        0.267
      ]
    ],
    "pantry": [
      {
        "name": "Curry",
        "grams": 3
      }
    ],
    "steps": [
      "Ziemniaki i warzywa pokrój i piecz 25–30 minut w 200°C.",
      "Kurczaka usmaż z przyprawami na patelni. Podawaj razem z jogurtem."
    ]
  },
  {
    "id": "h32",
    "title": "Curry z soczewicy i pomidorów",
    "cuisines": [
      "indian"
    ],
    "vibes": [
      "gut-friendly",
      "speedy-meals"
    ],
    "proteins": [
      "veg"
    ],
    "isVegan": true,
    "appliances": [
      "stove"
    ],
    "minutes": 20,
    "protein": 27,
    "fat": 9,
    "carbs": 67,
    "kcal": 450,
    "paid": [
      [
        "soczewica",
        0.1
      ],
      [
        "passata",
        0.44
      ],
      [
        "cebula",
        0.06
      ],
      [
        "szpinak",
        0.7
      ],
      [
        "czosnek",
        0.12
      ],
      [
        "oliwa",
        0.005
      ]
    ],
    "pantry": [
      {
        "name": "Kumin",
        "grams": 2
      },
      {
        "name": "Kurkuma",
        "grams": 1
      }
    ],
    "steps": [
      "Cebulę, czosnek i przyprawy podsmaż.",
      "Dodaj soczewicę, passatę i wodę, duś 18–20 minut.",
      "Na końcu wmieszaj szpinak."
    ]
  },
  {
    "id": "h33",
    "title": "Curry z kurczakiem i ziemniakami",
    "cuisines": [
      "indian"
    ],
    "vibes": [
      "family-favs",
      "home-style"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 25,
    "protein": 51,
    "fat": 13,
    "carbs": 64,
    "kcal": 590,
    "paid": [
      [
        "kurczak",
        0.16
      ],
      [
        "ziemniaki",
        0.22
      ],
      [
        "pomidory-puszka",
        0.45
      ],
      [
        "cebula",
        0.06
      ],
      [
        "groch",
        0.07
      ],
      [
        "oliwa",
        0.005
      ]
    ],
    "pantry": [
      {
        "name": "Curry",
        "grams": 3
      }
    ],
    "steps": [
      "Kurczaka i cebulę zrumień.",
      "Dodaj ziemniaki, pomidory, groszek, curry i tyle wody, żeby prawie przykryła.",
      "Duś 25 minut, aż ziemniaki zmiękną."
    ]
  },
  {
    "id": "h34",
    "title": "Miska ryżu z ciecierzycą",
    "cuisines": [
      "indian"
    ],
    "vibes": [
      "healthy-comfort",
      "low-calories"
    ],
    "proteins": [
      "veg"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 30,
    "protein": 19,
    "fat": 15,
    "carbs": 80,
    "kcal": 540,
    "paid": [
      [
        "ciecierzyca",
        0.667
      ],
      [
        "ryz",
        0.056
      ],
      [
        "ogorki",
        0.08
      ],
      [
        "pomidory",
        0.1
      ],
      [
        "szpinak",
        0.5
      ],
      [
        "jogurt",
        0.4
      ],
      [
        "oliwa",
        0.005
      ]
    ],
    "pantry": [
      {
        "name": "Curry",
        "grams": 3
      }
    ],
    "steps": [
      "Ciecierzycę podgrzej na patelni z curry.",
      "Podawaj na ryżu z ogórkiem, pomidorem i szpinakiem.",
      "Na wierzch daj jogurt."
    ]
  },
  {
    "id": "h35",
    "title": "Wrap tikka z kurczakiem",
    "cuisines": [
      "indian"
    ],
    "vibes": [
      "speedy-meals",
      "protein-packed"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 30,
    "protein": 48,
    "fat": 10,
    "carbs": 48,
    "kcal": 470,
    "paid": [
      [
        "kurczak",
        0.15
      ],
      [
        "tortilla",
        0.167
      ],
      [
        "jogurt-grecki",
        0.333
      ],
      [
        "ogorki",
        0.07
      ],
      [
        "pomidory",
        0.07
      ],
      [
        "czosnek",
        0.12
      ],
      [
        "salata",
        0.25
      ]
    ],
    "pantry": [
      {
        "name": "Papryka mielona",
        "grams": 2
      },
      {
        "name": "Kumin",
        "grams": 2
      }
    ],
    "steps": [
      "Kurczaka obtocz w jogurcie i przyprawach, usmaż do gotowości.",
      "Pokrój i włóż do wrapa z ogórkiem, pomidorem i sałatą. Zwiń ciasno."
    ]
  },
  {
    "id": "h36",
    "title": "Dal z soczewicy i mlekiem kokosowym",
    "cuisines": [
      "indian"
    ],
    "vibes": [
      "gut-friendly",
      "home-style"
    ],
    "proteins": [
      "veg"
    ],
    "isVegan": true,
    "appliances": [
      "stove"
    ],
    "minutes": 20,
    "protein": 25,
    "fat": 16,
    "carbs": 67,
    "kcal": 510,
    "paid": [
      [
        "soczewica",
        0.1
      ],
      [
        "mleczko",
        0.3
      ],
      [
        "szpinak",
        0.8
      ],
      [
        "cebula",
        0.06
      ],
      [
        "czosnek",
        0.12
      ],
      [
        "oliwa",
        0.005
      ]
    ],
    "pantry": [
      {
        "name": "Kurkuma",
        "grams": 1
      },
      {
        "name": "Kumin",
        "grams": 2
      }
    ],
    "steps": [
      "Cebulę, czosnek i przyprawy podsmaż.",
      "Dodaj soczewicę, mleko kokosowe i wodę, duś 20 minut, aż zgęstnieje.",
      "Przed podaniem wmieszaj szpinak."
    ]
  },
  {
    "id": "h37",
    "title": "Curry z jajek i pomidorów",
    "cuisines": [
      "indian"
    ],
    "vibes": [
      "protein-packed",
      "speedy-meals"
    ],
    "proteins": [
      "veg"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 8,
    "protein": 28,
    "fat": 21,
    "carbs": 31,
    "kcal": 430,
    "paid": [
      [
        "jaja",
        0.3
      ],
      [
        "pomidory-puszka",
        0.55
      ],
      [
        "cebula",
        0.05
      ],
      [
        "szpinak",
        0.5
      ],
      [
        "ciecierzyca",
        0.25
      ],
      [
        "oliwa",
        0.005
      ]
    ],
    "pantry": [
      {
        "name": "Kumin",
        "grams": 2
      },
      {
        "name": "Chili",
        "grams": 1
      }
    ],
    "steps": [
      "Cebulę i przyprawy podsmaż, dodaj pomidory i ciecierzycę, duś 8 minut.",
      "Zrób wgłębienia, wbij jajka, przykryj i gotuj, aż białko się zetnie.",
      "Dodaj szpinak."
    ]
  },
  {
    "id": "h38",
    "title": "Kurczak korma z ryżem",
    "cuisines": [
      "indian"
    ],
    "vibes": [
      "fakeway",
      "family-favs"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 10,
    "protein": 57,
    "fat": 23,
    "carbs": 66,
    "kcal": 700,
    "paid": [
      [
        "kurczak",
        0.17
      ],
      [
        "ryz",
        0.064
      ],
      [
        "jogurt-grecki",
        0.533
      ],
      [
        "orzechy",
        0.02
      ],
      [
        "passata",
        0.32
      ],
      [
        "cebula",
        0.06
      ],
      [
        "czosnek",
        0.12
      ],
      [
        "maslo",
        0.025
      ]
    ],
    "pantry": [
      {
        "name": "Garam masala",
        "grams": 2
      }
    ],
    "steps": [
      "Kurczaka usmaż z cebulą i przyprawami. Dodaj passatę i duś 10 minut.",
      "Zmniejsz ogień i wmieszaj jogurt.",
      "Podawaj z ryżem i posiekanymi nerkowcami."
    ]
  },
  {
    "id": "h39",
    "title": "Klopsiki z indyka w sosie curry",
    "cuisines": [
      "indian"
    ],
    "vibes": [
      "protein-packed",
      "fakeway"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 15,
    "protein": 49,
    "fat": 24,
    "carbs": 35,
    "kcal": 600,
    "paid": [
      [
        "indyk",
        0.18
      ],
      [
        "jaja",
        0.1
      ],
      [
        "bulka-tarta",
        0.02
      ],
      [
        "mleczko",
        0.3
      ],
      [
        "passata",
        0.24
      ],
      [
        "cebula",
        0.05
      ],
      [
        "oliwa",
        0.005
      ]
    ],
    "pantry": [
      {
        "name": "Curry",
        "grams": 3
      }
    ],
    "steps": [
      "Indyka wymieszaj z jajkiem i bułką tartą, uformuj klopsiki i zrumień.",
      "Dodaj cebulę, curry, passatę i mleko kokosowe. Duś 15 minut."
    ]
  },
  {
    "id": "h40",
    "title": "Warzywne curry z ciecierzycą",
    "cuisines": [
      "indian"
    ],
    "vibes": [
      "healthy-comfort",
      "gut-friendly"
    ],
    "proteins": [
      "veg"
    ],
    "isVegan": true,
    "appliances": [
      "stove"
    ],
    "minutes": 20,
    "protein": 17,
    "fat": 17,
    "carbs": 69,
    "kcal": 500,
    "paid": [
      [
        "ciecierzyca",
        0.625
      ],
      [
        "kalafior",
        0.25
      ],
      [
        "marchew",
        0.08
      ],
      [
        "groch",
        0.07
      ],
      [
        "pomidory-puszka",
        0.45
      ],
      [
        "mleczko",
        0.25
      ],
      [
        "oliwa",
        0.005
      ]
    ],
    "pantry": [
      {
        "name": "Curry",
        "grams": 3
      }
    ],
    "steps": [
      "Warzywa podsmaż z curry.",
      "Dodaj pomidory, ciecierzycę i mleko kokosowe.",
      "Duś 20 minut, aż warzywa zmiękną."
    ]
  },
  {
    "id": "h41",
    "title": "Miska ryżu z kurczakiem teriyaki",
    "cuisines": [
      "asian"
    ],
    "vibes": [
      "fakeway",
      "protein-packed"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 5,
    "protein": 50,
    "fat": 13,
    "carbs": 72,
    "kcal": 610,
    "paid": [
      [
        "kurczak",
        0.16
      ],
      [
        "ryz",
        0.068
      ],
      [
        "teriyaki",
        0.16
      ],
      [
        "brokuly",
        0.3
      ],
      [
        "marchew",
        0.06
      ],
      [
        "oliwa",
        0.005
      ]
    ],
    "pantry": [
      {
        "name": "Sezam",
        "grams": 5
      }
    ],
    "steps": [
      "Paski kurczaka obsmaż. Dodaj brokuły i marchewkę, smaż 4–5 minut.",
      "Wlej sos teriyaki i wymieszaj.",
      "Podawaj na ryżu z sezamem."
    ]
  },
  {
    "id": "h42",
    "title": "Wołowina z brokułami",
    "cuisines": [
      "asian"
    ],
    "vibes": [
      "fakeway",
      "speedy-meals"
    ],
    "proteins": [
      "beef"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 30,
    "protein": 45,
    "fat": 18,
    "carbs": 61,
    "kcal": 620,
    "paid": [
      [
        "wolowina",
        0.16
      ],
      [
        "brokuly",
        0.45
      ],
      [
        "ryz",
        0.06
      ],
      [
        "czosnek",
        0.12
      ]
    ],
    "pantry": [
      {
        "name": "Sos sojowy",
        "grams": 25
      },
      {
        "name": "Imbir",
        "grams": 8
      },
      {
        "name": "Olej sezamowy",
        "grams": 5
      },
      {
        "name": "Skrobia",
        "grams": 5
      }
    ],
    "steps": [
      "Wołowinę lekko obtocz w skrobi i obsmaż na dużym ogniu.",
      "Dodaj brokuły, czosnek i imbir.",
      "Wlej sos sojowy i odrobinę wody, smaż aż sos się zeszkli. Podawaj z ryżem."
    ]
  },
  {
    "id": "h43",
    "title": "Smażony ryż z kurczakiem",
    "cuisines": [
      "asian"
    ],
    "vibes": [
      "family-favs",
      "speedy-meals"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 30,
    "protein": 44,
    "fat": 19,
    "carbs": 73,
    "kcal": 640,
    "paid": [
      [
        "ryz",
        0.08
      ],
      [
        "kurczak",
        0.13
      ],
      [
        "jaja",
        0.2
      ],
      [
        "groch",
        0.07
      ],
      [
        "marchew",
        0.06
      ]
    ],
    "pantry": [
      {
        "name": "Sos sojowy",
        "grams": 20
      },
      {
        "name": "Olej sezamowy",
        "grams": 5
      }
    ],
    "steps": [
      "Kurczaka usmaż na mocno rozgrzanej patelni. Dodaj marchewkę i groszek, odsuń i usmaż jajecznicę.",
      "Dodaj ryż i sos sojowy, smaż aż będzie gorący i lekko chrupiący."
    ]
  },
  {
    "id": "h44",
    "title": "Smażony ryż z jajkiem i warzywami",
    "cuisines": [
      "asian"
    ],
    "vibes": [
      "speedy-meals",
      "low-calories"
    ],
    "proteins": [
      "veg"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 30,
    "protein": 20,
    "fat": 17,
    "carbs": 79,
    "kcal": 560,
    "paid": [
      [
        "ryz",
        0.08
      ],
      [
        "jaja",
        0.2
      ],
      [
        "groch",
        0.07
      ],
      [
        "marchew",
        0.06
      ],
      [
        "kukurydza",
        0.429
      ],
      [
        "cebula",
        0.05
      ]
    ],
    "pantry": [
      {
        "name": "Sos sojowy",
        "grams": 15
      },
      {
        "name": "Olej sezamowy",
        "grams": 5
      }
    ],
    "steps": [
      "Jajka usmaż na rozgrzanej patelni i odłóż.",
      "Podsmaż warzywa, dodaj ryż i sos sojowy, wmieszaj jajka i podgrzej."
    ]
  },
  {
    "id": "h45",
    "title": "Kurczak w słodkim chili z ryżem",
    "cuisines": [
      "asian"
    ],
    "vibes": [
      "fakeway",
      "protein-packed"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 3,
    "protein": 49,
    "fat": 12,
    "carbs": 83,
    "kcal": 630,
    "paid": [
      [
        "kurczak",
        0.16
      ],
      [
        "ryz",
        0.068
      ],
      [
        "chili-sos",
        0.18
      ],
      [
        "papryka",
        0.08
      ],
      [
        "brokuly",
        0.25
      ],
      [
        "oliwa",
        0.005
      ],
      [
        "limonka",
        0.5
      ]
    ],
    "pantry": [],
    "steps": [
      "Kurczaka obsmaż, dodaj paprykę i brokuły.",
      "Wlej słodkie chili i smaż 2–3 minuty, aż sos się sklei.",
      "Podawaj na ryżu z limonką."
    ]
  },
  {
    "id": "h46",
    "title": "Makaron z kurczakiem i czosnkiem",
    "cuisines": [
      "asian"
    ],
    "vibes": [
      "speedy-meals",
      "family-favs"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 3,
    "protein": 48,
    "fat": 14,
    "carbs": 67,
    "kcal": 610,
    "paid": [
      [
        "makaron",
        0.09
      ],
      [
        "kurczak",
        0.15
      ],
      [
        "brokuly",
        0.25
      ],
      [
        "marchew",
        0.06
      ],
      [
        "czosnek",
        0.12
      ]
    ],
    "pantry": [
      {
        "name": "Sos sojowy",
        "grams": 20
      },
      {
        "name": "Olej sezamowy",
        "grams": 5
      }
    ],
    "steps": [
      "Ugotuj makaron. Kurczaka, czosnek i warzywa smaż na dużym ogniu.",
      "Dodaj makaron i sos sojowy, wymieszaj 2–3 minuty."
    ]
  },
  {
    "id": "h47",
    "title": "Makaron z wołowiną",
    "cuisines": [
      "asian"
    ],
    "vibes": [
      "protein-packed",
      "fakeway"
    ],
    "proteins": [
      "beef"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 30,
    "protein": 48,
    "fat": 20,
    "carbs": 71,
    "kcal": 680,
    "paid": [
      [
        "wolowina",
        0.16
      ],
      [
        "makaron",
        0.09
      ],
      [
        "papryka",
        0.08
      ],
      [
        "cebula",
        0.05
      ],
      [
        "ostryga",
        0.06
      ],
      [
        "oliwa",
        0.005
      ]
    ],
    "pantry": [
      {
        "name": "Sos sojowy",
        "grams": 25
      }
    ],
    "steps": [
      "Ugotuj makaron. Wołowinę obsmaż na dużym ogniu, dodaj warzywa.",
      "Wlej sosy i makaron, wymieszaj aż wszystko pokryje sos."
    ]
  },
  {
    "id": "h48",
    "title": "Kurczak sezamowy z ryżem",
    "cuisines": [
      "asian"
    ],
    "vibes": [
      "fakeway",
      "family-favs"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 30,
    "protein": 51,
    "fat": 15,
    "carbs": 75,
    "kcal": 650,
    "paid": [
      [
        "kurczak",
        0.16
      ],
      [
        "ryz",
        0.068
      ],
      [
        "miod",
        0.041
      ],
      [
        "czosnek",
        0.12
      ],
      [
        "brokuly",
        0.25
      ],
      [
        "oliwa",
        0.005
      ]
    ],
    "pantry": [
      {
        "name": "Sezam",
        "grams": 8
      },
      {
        "name": "Sos sojowy",
        "grams": 20
      },
      {
        "name": "Imbir",
        "grams": 8
      }
    ],
    "steps": [
      "Wymieszaj sos sojowy, miód, czosnek i imbir.",
      "Kurczaka usmaż do rumieńca, dodaj sos i brokuły, redukuj aż się zeszkli.",
      "Podawaj z ryżem i sezamem."
    ]
  },
  {
    "id": "h49",
    "title": "Makaron z kurczakiem i masłem orzechowym",
    "cuisines": [
      "asian"
    ],
    "vibes": [
      "protein-packed",
      "fakeway"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 30,
    "protein": 48,
    "fat": 22,
    "carbs": 71,
    "kcal": 690,
    "paid": [
      [
        "kurczak",
        0.15
      ],
      [
        "makaron",
        0.09
      ],
      [
        "maslo-orzechowe",
        0.071
      ],
      [
        "limonka",
        0.5
      ],
      [
        "czosnek",
        0.12
      ],
      [
        "ogorki",
        0.08
      ],
      [
        "marchew",
        0.05
      ]
    ],
    "pantry": [
      {
        "name": "Sos sojowy",
        "grams": 20
      }
    ],
    "steps": [
      "Ugotuj makaron i kurczaka.",
      "Masło orzechowe wymieszaj z sosem sojowym, limonką, czosnkiem i odrobiną gorącej wody.",
      "Makaron i kurczaka wymieszaj z sosem i warzywami."
    ]
  },
  {
    "id": "h50",
    "title": "Ramen z jajkiem i warzywami",
    "cuisines": [
      "asian"
    ],
    "vibes": [
      "speedy-meals",
      "home-style"
    ],
    "proteins": [
      "veg"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 30,
    "protein": 23,
    "fat": 15,
    "carbs": 65,
    "kcal": 500,
    "paid": [
      [
        "ramen",
        0.08
      ],
      [
        "jaja",
        0.2
      ],
      [
        "pieczarki",
        0.1
      ],
      [
        "szpinak",
        0.6
      ],
      [
        "kukurydza",
        0.429
      ],
      [
        "bulion",
        0.4
      ],
      [
        "cebula",
        0.05
      ]
    ],
    "pantry": [
      {
        "name": "Sos sojowy",
        "grams": 15
      }
    ],
    "steps": [
      "Bulion z sosem sojowym zagotuj.",
      "Dodaj makaron i pieczarki, potem kukurydzę i szpinak.",
      "Wbij jajka albo włóż ugotowane. Gotuj, aż makaron zmięknie."
    ]
  },
  {
    "id": "h51",
    "title": "Miska ryżu z kurczakiem i imbirem",
    "cuisines": [
      "asian"
    ],
    "vibes": [
      "healthy-comfort",
      "protein-packed"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 30,
    "protein": 51,
    "fat": 13,
    "carbs": 69,
    "kcal": 600,
    "paid": [
      [
        "kurczak",
        0.16
      ],
      [
        "ryz",
        0.068
      ],
      [
        "brokuly",
        0.25
      ],
      [
        "marchew",
        0.06
      ],
      [
        "cebula",
        0.05
      ]
    ],
    "pantry": [
      {
        "name": "Imbir",
        "grams": 8
      },
      {
        "name": "Sos sojowy",
        "grams": 20
      },
      {
        "name": "Olej sezamowy",
        "grams": 5
      }
    ],
    "steps": [
      "Kurczaka obsmaż z imbirem.",
      "Dodaj warzywa i smaż, aż będą chrupiąco-miękkie.",
      "Wlej sos sojowy i podawaj na ryżu ze szczypiorkiem."
    ]
  },
  {
    "id": "h52",
    "title": "Kurczak z miodem i czosnkiem",
    "cuisines": [
      "asian"
    ],
    "vibes": [
      "fakeway",
      "family-favs"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 30,
    "protein": 51,
    "fat": 14,
    "carbs": 76,
    "kcal": 630,
    "paid": [
      [
        "kurczak",
        0.16
      ],
      [
        "ryz",
        0.068
      ],
      [
        "miod",
        0.041
      ],
      [
        "czosnek",
        0.12
      ],
      [
        "brokuly",
        0.3
      ],
      [
        "papryka",
        0.07
      ],
      [
        "oliwa",
        0.005
      ]
    ],
    "pantry": [
      {
        "name": "Sos sojowy",
        "grams": 20
      }
    ],
    "steps": [
      "Kurczaka usmaż do rumieńca.",
      "Dodaj warzywa, potem miód, sos sojowy i czosnek.",
      "Smaż, aż sos pokryje wszystko. Podawaj z ryżem."
    ]
  },
  {
    "id": "h53",
    "title": "Ostra miska ryżu z wołowiną",
    "cuisines": [
      "asian"
    ],
    "vibes": [
      "protein-packed",
      "speedy-meals"
    ],
    "proteins": [
      "beef"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 30,
    "protein": 46,
    "fat": 19,
    "carbs": 74,
    "kcal": 650,
    "paid": [
      [
        "wolowina",
        0.16
      ],
      [
        "ryz",
        0.068
      ],
      [
        "gochujang",
        0.08
      ],
      [
        "ogorki",
        0.08
      ],
      [
        "marchew",
        0.06
      ],
      [
        "cebula",
        0.05
      ]
    ],
    "pantry": [
      {
        "name": "Sos sojowy",
        "grams": 15
      },
      {
        "name": "Sezam",
        "grams": 5
      }
    ],
    "steps": [
      "Wołowinę obsmaż z gochujang i sosem sojowym.",
      "Podawaj na ryżu z ogórkiem, marchewką i szczypiorkiem.",
      "Posyp sezamem."
    ]
  },
  {
    "id": "h54",
    "title": "Łosoś teriyaki z ryżem",
    "cuisines": [
      "asian"
    ],
    "vibes": [
      "protein-packed",
      "healthy-comfort"
    ],
    "proteins": [
      "fish"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 30,
    "protein": 43,
    "fat": 24,
    "carbs": 67,
    "kcal": 680,
    "paid": [
      [
        "losos",
        0.17
      ],
      [
        "ryz",
        0.068
      ],
      [
        "teriyaki",
        0.14
      ],
      [
        "brokuly",
        0.375
      ],
      [
        "limonka",
        0.5
      ]
    ],
    "pantry": [
      {
        "name": "Sezam",
        "grams": 5
      }
    ],
    "steps": [
      "Łososia upiecz albo obsmaż, żeby został lekko różowy w środku.",
      "Brokuły ugotuj na parze albo na patelni.",
      "Posmaruj łososia teriyaki i podawaj z ryżem i sezamem."
    ]
  },
  {
    "id": "h55",
    "title": "Udon z kurczakiem i warzywami",
    "cuisines": [
      "asian"
    ],
    "vibes": [
      "family-favs",
      "speedy-meals"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 30,
    "protein": 44,
    "fat": 12,
    "carbs": 75,
    "kcal": 610,
    "paid": [
      [
        "kurczak",
        0.15
      ],
      [
        "udon",
        0.2
      ],
      [
        "papryka",
        0.06
      ],
      [
        "marchew",
        0.06
      ],
      [
        "brokuly",
        0.15
      ],
      [
        "czosnek",
        0.12
      ]
    ],
    "pantry": [
      {
        "name": "Sos sojowy",
        "grams": 25
      },
      {
        "name": "Imbir",
        "grams": 8
      },
      {
        "name": "Olej sezamowy",
        "grams": 5
      }
    ],
    "steps": [
      "Kurczaka podsmaż z czosnkiem i imbirem.",
      "Dodaj warzywa i smaż, aż będą chrupiąco-miękkie.",
      "Dodaj udon i sos sojowy, wymieszaj aż będzie gorące."
    ]
  },
  {
    "id": "h56",
    "title": "Miska z kurczakiem po śródziemnomorsku",
    "cuisines": [
      "mediterranean"
    ],
    "vibes": [
      "healthy-comfort",
      "protein-packed"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 30,
    "protein": 52,
    "fat": 23,
    "carbs": 60,
    "kcal": 650,
    "paid": [
      [
        "kurczak",
        0.16
      ],
      [
        "quinoa",
        0.05
      ],
      [
        "ogorki",
        0.08
      ],
      [
        "pomidory",
        0.1
      ],
      [
        "feta",
        0.2
      ],
      [
        "ciecierzyca",
        0.292
      ],
      [
        "oliwa",
        0.01
      ],
      [
        "cytryna",
        1
      ]
    ],
    "pantry": [],
    "steps": [
      "Kurczaka usmaż i pokrój.",
      "W misce ułóż komosę, ciecierzycę, ogórka, pomidora i fetę.",
      "Skrop cytryną i oliwą."
    ]
  },
  {
    "id": "h57",
    "title": "Kurczak po grecku z ziemniakami",
    "cuisines": [
      "mediterranean"
    ],
    "vibes": [
      "family-favs",
      "healthy-comfort"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "oven"
    ],
    "minutes": 35,
    "protein": 47,
    "fat": 24,
    "carbs": 55,
    "kcal": 650,
    "paid": [
      [
        "udka",
        0.18
      ],
      [
        "ziemniaki",
        0.25
      ],
      [
        "cytryna",
        1
      ],
      [
        "czosnek",
        0.12
      ],
      [
        "oliwa",
        0.01
      ],
      [
        "ogorki",
        0.08
      ]
    ],
    "pantry": [
      {
        "name": "Oregano",
        "grams": 1
      }
    ],
    "steps": [
      "Kurczaka i ziemniaczane ćwiartki wymieszaj z cytryną, czosnkiem, oregano i oliwą.",
      "Piecz 30–35 minut w 200°C, aż się zrumienią i kurczak będzie gotowy.",
      "Podawaj z ogórkiem."
    ]
  },
  {
    "id": "h58",
    "title": "Sałatka grecka z kurczakiem i fetą",
    "cuisines": [
      "mediterranean"
    ],
    "vibes": [
      "low-calories",
      "protein-packed"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 30,
    "protein": 52,
    "fat": 24,
    "carbs": 17,
    "kcal": 480,
    "paid": [
      [
        "kurczak",
        0.15
      ],
      [
        "salata",
        0.6
      ],
      [
        "ogorki",
        0.08
      ],
      [
        "pomidory",
        0.1
      ],
      [
        "feta",
        0.2
      ],
      [
        "oliwki",
        0.125
      ],
      [
        "oliwa",
        0.01
      ],
      [
        "cytryna",
        1
      ]
    ],
    "pantry": [],
    "steps": [
      "Kurczaka usmaż na patelni albo grillu i pokrój.",
      "Warzywa wymieszaj z fetą i oliwkami.",
      "Dodaj kurczaka, skrop cytryną i oliwą."
    ]
  },
  {
    "id": "h59",
    "title": "Sałatka z tuńczyka i białej fasoli",
    "cuisines": [
      "mediterranean"
    ],
    "vibes": [
      "protein-packed",
      "gut-friendly"
    ],
    "proteins": [
      "fish"
    ],
    "isVegan": false,
    "appliances": [],
    "minutes": 30,
    "protein": 40,
    "fat": 14,
    "carbs": 38,
    "kcal": 430,
    "paid": [
      [
        "tunczyk",
        1
      ],
      [
        "fasola-biala",
        0.583
      ],
      [
        "pomidory",
        0.12
      ],
      [
        "cebula",
        0.03
      ],
      [
        "oliwa",
        0.01
      ],
      [
        "cytryna",
        1
      ]
    ],
    "pantry": [
      {
        "name": "Pietruszka",
        "grams": 3
      }
    ],
    "steps": [
      "Tuńczyka i fasolę odsącz.",
      "Wymieszaj z pomidorem, cebulą i pietruszką.",
      "Skrop cytryną i oliwą, podawaj schłodzone."
    ]
  },
  {
    "id": "h60",
    "title": "Miska z ciecierzycą po śródziemnomorsku",
    "cuisines": [
      "mediterranean"
    ],
    "vibes": [
      "gut-friendly",
      "healthy-comfort"
    ],
    "proteins": [
      "veg"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 30,
    "protein": 20,
    "fat": 22,
    "carbs": 78,
    "kcal": 590,
    "paid": [
      [
        "ciecierzyca",
        0.667
      ],
      [
        "quinoa",
        0.043
      ],
      [
        "ogorki",
        0.08
      ],
      [
        "pomidory",
        0.1
      ],
      [
        "szpinak",
        0.5
      ],
      [
        "feta",
        0.2
      ],
      [
        "oliwa",
        0.01
      ],
      [
        "cytryna",
        1
      ]
    ],
    "pantry": [],
    "steps": [
      "Komosę, ciecierzycę i warzywa wymieszaj.",
      "Dodaj fetę, skrop cytryną i oliwą.",
      "Podawaj w temperaturze pokojowej."
    ]
  },
  {
    "id": "h61",
    "title": "Łosoś z cytryną, czosnkiem i warzywami",
    "cuisines": [
      "mediterranean"
    ],
    "vibes": [
      "low-calories",
      "protein-packed"
    ],
    "proteins": [
      "fish"
    ],
    "isVegan": false,
    "appliances": [
      "oven"
    ],
    "minutes": 20,
    "protein": 42,
    "fat": 30,
    "carbs": 24,
    "kcal": 540,
    "paid": [
      [
        "losos",
        0.17
      ],
      [
        "cukinia",
        0.15
      ],
      [
        "papryka",
        0.1
      ],
      [
        "brokuly",
        0.3
      ],
      [
        "cytryna",
        1
      ],
      [
        "czosnek",
        0.12
      ],
      [
        "oliwa",
        0.01
      ]
    ],
    "pantry": [],
    "steps": [
      "Łososia i warzywa ułóż na blasze.",
      "Przypraw czosnkiem, cytryną i oliwą.",
      "Piecz 15–20 minut w 200°C, aż łosoś się rozdziela, a warzywa zmiękną."
    ]
  },
  {
    "id": "h62",
    "title": "Souvlaki z kurczaka z ryżem",
    "cuisines": [
      "mediterranean"
    ],
    "vibes": [
      "fakeway",
      "protein-packed"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 30,
    "protein": 57,
    "fat": 16,
    "carbs": 72,
    "kcal": 650,
    "paid": [
      [
        "kurczak",
        0.17
      ],
      [
        "pita",
        1
      ],
      [
        "ryz",
        0.052
      ],
      [
        "ogorki",
        0.08
      ],
      [
        "pomidory",
        0.08
      ],
      [
        "jogurt-grecki",
        0.4
      ],
      [
        "czosnek",
        0.12
      ],
      [
        "cytryna",
        1
      ]
    ],
    "pantry": [
      {
        "name": "Oregano",
        "grams": 1
      }
    ],
    "steps": [
      "Kurczaka przypraw oregano i cytryną, usmaż do rumieńca.",
      "Pokrój i podawaj z ryżem, pitą, ogórkiem, pomidorem i jogurtem z czosnkiem."
    ]
  },
  {
    "id": "h63",
    "title": "Klopsiki z indyka z tzatziki",
    "cuisines": [
      "mediterranean"
    ],
    "vibes": [
      "protein-packed",
      "fakeway"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "oven"
    ],
    "minutes": 20,
    "protein": 50,
    "fat": 21,
    "carbs": 34,
    "kcal": 540,
    "paid": [
      [
        "indyk",
        0.18
      ],
      [
        "jaja",
        0.1
      ],
      [
        "bulka-tarta",
        0.02
      ],
      [
        "jogurt-grecki",
        0.533
      ],
      [
        "ogorki",
        0.1
      ],
      [
        "czosnek",
        0.12
      ],
      [
        "oliwa",
        0.005
      ]
    ],
    "pantry": [
      {
        "name": "Koperek",
        "grams": 2
      }
    ],
    "steps": [
      "Indyka wymieszaj z jajkiem i bułką tartą, uformuj klopsiki.",
      "Piecz 18–20 minut w 200°C.",
      "Jogurt wymieszaj z ogórkiem, czosnkiem i koperkiem i podawaj obok."
    ]
  },
  {
    "id": "h64",
    "title": "Sałatka makaronowa po śródziemnomorsku",
    "cuisines": [
      "mediterranean"
    ],
    "vibes": [
      "low-calories",
      "speedy-meals"
    ],
    "proteins": [
      "veg"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 30,
    "protein": 20,
    "fat": 22,
    "carbs": 67,
    "kcal": 560,
    "paid": [
      [
        "penne",
        0.15
      ],
      [
        "pomidory",
        0.12
      ],
      [
        "ogorki",
        0.08
      ],
      [
        "oliwki",
        0.125
      ],
      [
        "feta",
        0.25
      ],
      [
        "cebula",
        0.03
      ],
      [
        "oliwa",
        0.01
      ],
      [
        "cytryna",
        1
      ]
    ],
    "pantry": [],
    "steps": [
      "Makaron ugotuj i lekko ostudź.",
      "Wymieszaj z warzywami, oliwkami i fetą.",
      "Skrop cytryną i oliwą."
    ]
  },
  {
    "id": "h65",
    "title": "Makaron z pieczoną fetą i pomidorami",
    "cuisines": [
      "mediterranean"
    ],
    "vibes": [
      "home-style",
      "speedy-meals"
    ],
    "proteins": [
      "veg"
    ],
    "isVegan": false,
    "appliances": [
      "stove",
      "oven"
    ],
    "minutes": 20,
    "protein": 24,
    "fat": 25,
    "carbs": 77,
    "kcal": 650,
    "paid": [
      [
        "penne",
        0.16
      ],
      [
        "feta",
        0.4
      ],
      [
        "pomidory",
        0.2
      ],
      [
        "czosnek",
        0.12
      ],
      [
        "szpinak",
        0.6
      ],
      [
        "oliwa",
        0.01
      ]
    ],
    "pantry": [
      {
        "name": "Bazylia",
        "grams": 2
      }
    ],
    "steps": [
      "Fetę i pomidory włóż do naczynia z czosnkiem i oliwą. Piecz 20 minut w 200°C.",
      "Ugotuj makaron i wymieszaj z upieczoną fetą oraz szpinakiem."
    ]
  },
  {
    "id": "h66",
    "title": "Miska z tuńczykiem i jajkiem",
    "cuisines": [
      "mediterranean"
    ],
    "vibes": [
      "protein-packed",
      "low-calories"
    ],
    "proteins": [
      "fish"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 30,
    "protein": 43,
    "fat": 23,
    "carbs": 41,
    "kcal": 560,
    "paid": [
      [
        "tunczyk",
        1
      ],
      [
        "jaja",
        0.2
      ],
      [
        "quinoa",
        0.04
      ],
      [
        "ogorki",
        0.08
      ],
      [
        "pomidory",
        0.1
      ],
      [
        "oliwki",
        0.1
      ],
      [
        "feta",
        0.15
      ],
      [
        "oliwa",
        0.005
      ]
    ],
    "pantry": [],
    "steps": [
      "Jajka ugotuj i ostudź.",
      "Komosę, tuńczyka i warzywa wymieszaj.",
      "Na wierzch połóż jajka, oliwki i fetę, skrop oliwą."
    ]
  },
  {
    "id": "h67",
    "title": "Kuskus z pieczonymi warzywami i fetą",
    "cuisines": [
      "mediterranean"
    ],
    "vibes": [
      "healthy-comfort",
      "gut-friendly"
    ],
    "proteins": [
      "veg"
    ],
    "isVegan": false,
    "appliances": [
      "oven"
    ],
    "minutes": 25,
    "protein": 18,
    "fat": 21,
    "carbs": 75,
    "kcal": 560,
    "paid": [
      [
        "kuskus",
        0.08
      ],
      [
        "cukinia",
        0.12
      ],
      [
        "papryka",
        0.1
      ],
      [
        "baklazan",
        0.1
      ],
      [
        "feta",
        0.25
      ],
      [
        "oliwa",
        0.01
      ]
    ],
    "pantry": [
      {
        "name": "Zioła",
        "grams": 1
      }
    ],
    "steps": [
      "Warzywa pokrój i piecz 20–25 minut w 200°C.",
      "Kuskus zalej wrzątkiem.",
      "Wymieszaj i posyp fetą oraz ziołami."
    ]
  },
  {
    "id": "h68",
    "title": "Kuskus z kurczakiem i cytryną",
    "cuisines": [
      "mediterranean"
    ],
    "vibes": [
      "speedy-meals",
      "protein-packed"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 30,
    "protein": 48,
    "fat": 16,
    "carbs": 65,
    "kcal": 590,
    "paid": [
      [
        "kurczak",
        0.15
      ],
      [
        "kuskus",
        0.08
      ],
      [
        "cytryna",
        1
      ],
      [
        "cukinia",
        0.1
      ],
      [
        "ciecierzyca",
        0.292
      ],
      [
        "oliwa",
        0.01
      ]
    ],
    "pantry": [
      {
        "name": "Pietruszka",
        "grams": 3
      }
    ],
    "steps": [
      "Kurczaka i cukinię usmaż na patelni z cytryną i ziołami.",
      "Kuskus zalej wrzątkiem.",
      "Wymieszaj kuskus z ciecierzycą i połóż na wierzchu kurczaka."
    ]
  },
  {
    "id": "h69",
    "title": "Faszerowana papryka po grecku",
    "cuisines": [
      "mediterranean"
    ],
    "vibes": [
      "family-favs",
      "healthy-comfort"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "stove",
      "oven"
    ],
    "minutes": 35,
    "protein": 45,
    "fat": 18,
    "carbs": 52,
    "kcal": 540,
    "paid": [
      [
        "papryka",
        0.3
      ],
      [
        "indyk",
        0.16
      ],
      [
        "ryz",
        0.048
      ],
      [
        "pomidory",
        0.12
      ],
      [
        "cebula",
        0.05
      ],
      [
        "feta",
        0.15
      ],
      [
        "oliwa",
        0.005
      ]
    ],
    "pantry": [
      {
        "name": "Oregano",
        "grams": 1
      }
    ],
    "steps": [
      "Indyka i cebulę podsmaż, wymieszaj z ryżem, pomidorem i oregano.",
      "Napełnij papryki, posyp fetą.",
      "Piecz 30–35 minut w 190°C."
    ]
  },
  {
    "id": "h70",
    "title": "Gulasz z kurczaka i ciecierzycy",
    "cuisines": [
      "mediterranean"
    ],
    "vibes": [
      "gut-friendly",
      "home-style"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 30,
    "protein": 51,
    "fat": 15,
    "carbs": 63,
    "kcal": 590,
    "paid": [
      [
        "kurczak",
        0.15
      ],
      [
        "ciecierzyca",
        0.542
      ],
      [
        "ziemniaki",
        0.15
      ],
      [
        "marchew",
        0.08
      ],
      [
        "pomidory",
        0.2
      ],
      [
        "cebula",
        0.06
      ],
      [
        "oliwa",
        0.005
      ]
    ],
    "pantry": [
      {
        "name": "Zioła",
        "grams": 1
      }
    ],
    "steps": [
      "Kurczaka i cebulę zrumień.",
      "Dodaj ziemniaki, marchewkę, ciecierzycę, pomidory i wodę.",
      "Duś 25–30 minut, aż warzywa zmiękną."
    ]
  },
  {
    "id": "h71",
    "title": "Kotlet z kurczaka z ziemniakami",
    "cuisines": [
      "polish"
    ],
    "vibes": [
      "family-favs",
      "home-style"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 30,
    "protein": 55,
    "fat": 24,
    "carbs": 63,
    "kcal": 680,
    "paid": [
      [
        "kurczak",
        0.17
      ],
      [
        "ziemniaki",
        0.25
      ],
      [
        "jaja",
        0.1
      ],
      [
        "bulka-tarta",
        0.03
      ],
      [
        "oliwa",
        0.01
      ],
      [
        "ogorki",
        0.1
      ]
    ],
    "pantry": [
      {
        "name": "Mąka",
        "grams": 15
      }
    ],
    "steps": [
      "Kurczaka rozbij i przypraw. Obtocz w mące, jajku i bułce tartej.",
      "Smaż na oleju, aż będzie złoty i gotowy w środku.",
      "Podawaj z ugotowanymi albo upieczonymi ziemniakami."
    ]
  },
  {
    "id": "h72",
    "title": "Rosół z kurczaka",
    "cuisines": [
      "polish"
    ],
    "vibes": [
      "home-style",
      "gut-friendly"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 30,
    "protein": 45,
    "fat": 8,
    "carbs": 42,
    "kcal": 420,
    "paid": [
      [
        "kurczak",
        0.15
      ],
      [
        "marchew",
        0.1
      ],
      [
        "seler",
        0.06
      ],
      [
        "ziemniaki",
        0.18
      ],
      [
        "cebula",
        0.06
      ],
      [
        "bulion",
        0.6
      ]
    ],
    "pantry": [
      {
        "name": "Pietruszka",
        "grams": 3
      },
      {
        "name": "Liść laurowy",
        "grams": 1
      }
    ],
    "steps": [
      "Kurczaka, warzywa i liść laurowy włóż do bulionu.",
      "Gotuj 25–30 minut, aż kurczak i ziemniaki zmiękną.",
      "Kurczaka wyjmij, rozdrobnij i włóż z powrotem. Posyp pietruszką."
    ]
  },
  {
    "id": "h73",
    "title": "Zupa pomidorowa z ryżem",
    "cuisines": [
      "polish"
    ],
    "vibes": [
      "home-style",
      "low-calories"
    ],
    "proteins": [
      "veg"
    ],
    "isVegan": false,
    "appliances": [
      "stove",
      "blender"
    ],
    "minutes": 20,
    "protein": 10,
    "fat": 9,
    "carbs": 55,
    "kcal": 350,
    "paid": [
      [
        "pomidory",
        0.4
      ],
      [
        "ryz",
        0.04
      ],
      [
        "cebula",
        0.06
      ],
      [
        "marchew",
        0.06
      ],
      [
        "bulion",
        0.4
      ],
      [
        "oliwa",
        0.005
      ],
      [
        "jogurt",
        0.267
      ]
    ],
    "pantry": [],
    "steps": [
      "Cebulę i marchewkę podsmaż. Dodaj pomidory i bulion, gotuj 20 minut.",
      "Zblenduj na gładko, wmieszaj ryż.",
      "Podawaj z jogurtem."
    ]
  },
  {
    "id": "h74",
    "title": "Placki ziemniaczane",
    "cuisines": [
      "polish"
    ],
    "vibes": [
      "home-style",
      "family-favs"
    ],
    "proteins": [
      "veg"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 30,
    "protein": 17,
    "fat": 24,
    "carbs": 76,
    "kcal": 590,
    "paid": [
      [
        "ziemniaki",
        0.3
      ],
      [
        "jaja",
        0.2
      ],
      [
        "cebula",
        0.06
      ],
      [
        "jogurt-grecki",
        0.333
      ],
      [
        "oliwa",
        0.01
      ]
    ],
    "pantry": [
      {
        "name": "Mąka",
        "grams": 25
      },
      {
        "name": "Koperek",
        "grams": 2
      }
    ],
    "steps": [
      "Ziemniaki zetrzyj i odciśnij wodę.",
      "Wymieszaj z jajkiem, cebulą i mąką.",
      "Smaż łyżki ciasta na oleju, aż będą chrupiące z obu stron. Podawaj z jogurtem i koperkiem."
    ]
  },
  {
    "id": "h75",
    "title": "Zupa z kurczakiem i pęczakiem",
    "cuisines": [
      "polish"
    ],
    "vibes": [
      "gut-friendly",
      "healthy-comfort"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 20,
    "protein": 43,
    "fat": 8,
    "carbs": 60,
    "kcal": 470,
    "paid": [
      [
        "kurczak",
        0.13
      ],
      [
        "peczak",
        0.06
      ],
      [
        "marchew",
        0.08
      ],
      [
        "seler",
        0.06
      ],
      [
        "cebula",
        0.06
      ],
      [
        "bulion",
        0.6
      ]
    ],
    "pantry": [
      {
        "name": "Pietruszka",
        "grams": 3
      }
    ],
    "steps": [
      "Pęczak ugotuj prawie do miękkości.",
      "Cebulę, marchewkę i seler podsmaż, dodaj bulion, pęczak i kurczaka.",
      "Gotuj 20 minut, kurczaka rozdrobnij i posyp pietruszką."
    ]
  },
  {
    "id": "h76",
    "title": "Kurczak z kapustą z jednego garnka",
    "cuisines": [
      "polish"
    ],
    "vibes": [
      "healthy-comfort",
      "family-favs"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 30,
    "protein": 45,
    "fat": 17,
    "carbs": 57,
    "kcal": 570,
    "paid": [
      [
        "udka",
        0.17
      ],
      [
        "kapusta",
        0.25
      ],
      [
        "ziemniaki",
        0.15
      ],
      [
        "marchew",
        0.07
      ],
      [
        "cebula",
        0.06
      ],
      [
        "pomidory",
        0.15
      ],
      [
        "oliwa",
        0.005
      ]
    ],
    "pantry": [
      {
        "name": "Papryka mielona",
        "grams": 2
      }
    ],
    "steps": [
      "Kurczaka i cebulę zrumień w garnku.",
      "Dodaj kapustę, ziemniaki, marchewkę, pomidory i paprykę.",
      "Dolej trochę wody i duś pod przykryciem 30 minut."
    ]
  },
  {
    "id": "h77",
    "title": "Klopsiki z indyka i ziemniaki z koperkiem",
    "cuisines": [
      "polish"
    ],
    "vibes": [
      "protein-packed",
      "family-favs"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 30,
    "protein": 49,
    "fat": 20,
    "carbs": 57,
    "kcal": 610,
    "paid": [
      [
        "indyk",
        0.18
      ],
      [
        "jaja",
        0.1
      ],
      [
        "bulka-tarta",
        0.02
      ],
      [
        "ziemniaki",
        0.25
      ],
      [
        "jogurt-grecki",
        0.333
      ],
      [
        "oliwa",
        0.005
      ]
    ],
    "pantry": [
      {
        "name": "Koperek",
        "grams": 2
      }
    ],
    "steps": [
      "Indyka wymieszaj z jajkiem i bułką tartą, uformuj klopsiki i usmaż.",
      "Ziemniaki ugotuj, wymieszaj z koperkiem i jogurtem.",
      "Podawaj razem."
    ]
  },
  {
    "id": "h78",
    "title": "Kurczak z kaszą gryczaną",
    "cuisines": [
      "polish"
    ],
    "vibes": [
      "healthy-comfort",
      "protein-packed"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 30,
    "protein": 50,
    "fat": 12,
    "carbs": 51,
    "kcal": 520,
    "paid": [
      [
        "kurczak",
        0.16
      ],
      [
        "kasza",
        0.06
      ],
      [
        "ogorki",
        0.08
      ],
      [
        "marchew",
        0.07
      ],
      [
        "cebula",
        0.05
      ],
      [
        "oliwa",
        0.005
      ]
    ],
    "pantry": [
      {
        "name": "Papryka mielona",
        "grams": 2
      }
    ],
    "steps": [
      "Ugotuj kaszę. Cebulę i marchewkę podsmaż, dodaj kurczaka i paprykę, smaż do gotowości.",
      "Podawaj na kaszy ze świeżym ogórkiem."
    ]
  },
  {
    "id": "h79",
    "title": "Kurczak pieczony z kiszoną kapustą",
    "cuisines": [
      "polish"
    ],
    "vibes": [
      "gut-friendly",
      "home-style"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "oven"
    ],
    "minutes": 40,
    "protein": 46,
    "fat": 18,
    "carbs": 54,
    "kcal": 570,
    "paid": [
      [
        "udka",
        0.17
      ],
      [
        "kiszona",
        0.25
      ],
      [
        "ziemniaki",
        0.18
      ],
      [
        "cebula",
        0.06
      ],
      [
        "jablko",
        0.06
      ],
      [
        "oliwa",
        0.005
      ]
    ],
    "pantry": [
      {
        "name": "Kminek",
        "grams": 1
      }
    ],
    "steps": [
      "Kiszoną kapustę, jabłko, cebulę i ziemniaki ułóż w naczyniu.",
      "Przypraw kminkiem, połóż kurczaka na wierzchu.",
      "Piecz pod przykryciem 40 minut w 190°C, na końcu na chwilę odkryj."
    ]
  },
  {
    "id": "h80",
    "title": "Ziemniaki z jajkiem i koperkiem",
    "cuisines": [
      "polish"
    ],
    "vibes": [
      "speedy-meals",
      "home-style"
    ],
    "proteins": [
      "veg"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 30,
    "protein": 24,
    "fat": 21,
    "carbs": 55,
    "kcal": 500,
    "paid": [
      [
        "ziemniaki",
        0.25
      ],
      [
        "jaja",
        0.3
      ],
      [
        "cebula",
        0.05
      ],
      [
        "maslo",
        0.025
      ],
      [
        "ogorki",
        0.08
      ]
    ],
    "pantry": [
      {
        "name": "Koperek",
        "grams": 2
      }
    ],
    "steps": [
      "Ziemniaki i cebulę pokrój i smaż, aż będą złote i miękkie.",
      "Wlej roztrzepane jajka i smaż, aż się zetną.",
      "Posyp koperkiem i podawaj z ogórkiem."
    ]
  },
  {
    "id": "h81",
    "title": "Leczo z kurczakiem",
    "cuisines": [
      "polish"
    ],
    "vibes": [
      "healthy-comfort",
      "family-favs"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 20,
    "protein": 48,
    "fat": 12,
    "carbs": 47,
    "kcal": 500,
    "paid": [
      [
        "kurczak",
        0.15
      ],
      [
        "cukinia",
        0.12
      ],
      [
        "papryka",
        0.1
      ],
      [
        "pomidory",
        0.2
      ],
      [
        "cebula",
        0.06
      ],
      [
        "fasola",
        0.333
      ],
      [
        "oliwa",
        0.005
      ]
    ],
    "pantry": [
      {
        "name": "Papryka mielona",
        "grams": 2
      }
    ],
    "steps": [
      "Kurczaka i cebulę podsmaż.",
      "Dodaj cukinię i paprykę, potem pomidory i fasolę.",
      "Przypraw papryką w proszku i duś 15–20 minut."
    ]
  },
  {
    "id": "h82",
    "title": "Gulasz z indyka i kasza gryczana",
    "cuisines": [
      "polish"
    ],
    "vibes": [
      "protein-packed",
      "home-style"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 15,
    "protein": 48,
    "fat": 16,
    "carbs": 50,
    "kcal": 540,
    "paid": [
      [
        "indyk",
        0.18
      ],
      [
        "kasza",
        0.06
      ],
      [
        "cebula",
        0.06
      ],
      [
        "marchew",
        0.07
      ],
      [
        "papryka",
        0.08
      ],
      [
        "pomidory",
        0.15
      ],
      [
        "oliwa",
        0.005
      ]
    ],
    "pantry": [
      {
        "name": "Papryka mielona",
        "grams": 2
      }
    ],
    "steps": [
      "Indyka zrumień z cebulą.",
      "Dodaj marchewkę, paprykę, pomidory i paprykę w proszku, duś 15 minut.",
      "Podawaj z ugotowaną kaszą."
    ]
  },
  {
    "id": "h83",
    "title": "Miska z twarogiem i ziemniakami",
    "cuisines": [
      "polish"
    ],
    "vibes": [
      "protein-packed",
      "speedy-meals"
    ],
    "proteins": [
      "veg"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 30,
    "protein": 34,
    "fat": 12,
    "carbs": 61,
    "kcal": 500,
    "paid": [
      [
        "twarog",
        0.2
      ],
      [
        "ziemniaki",
        0.25
      ],
      [
        "ogorki",
        0.1
      ],
      [
        "rzodkiewka",
        0.6
      ],
      [
        "jogurt-grecki",
        0.333
      ]
    ],
    "pantry": [
      {
        "name": "Koperek",
        "grams": 2
      },
      {
        "name": "Sól",
        "grams": 2
      },
      {
        "name": "Pieprz",
        "grams": 1
      }
    ],
    "steps": [
      "Ziemniaki ugotuj albo upiecz.",
      "Twaróg wymieszaj z jogurtem, koperkiem, solą i pieprzem.",
      "Podawaj z ziemniakami, ogórkiem i rzodkiewką."
    ]
  },
  {
    "id": "h84",
    "title": "Kasza z pieczarkami i twarogiem",
    "cuisines": [
      "polish"
    ],
    "vibes": [
      "gut-friendly",
      "healthy-comfort"
    ],
    "proteins": [
      "veg"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 30,
    "protein": 26,
    "fat": 15,
    "carbs": 61,
    "kcal": 480,
    "paid": [
      [
        "kasza",
        0.064
      ],
      [
        "pieczarki",
        0.18
      ],
      [
        "cebula",
        0.06
      ],
      [
        "szpinak",
        0.7
      ],
      [
        "twarog",
        0.1
      ],
      [
        "oliwa",
        0.005
      ]
    ],
    "pantry": [
      {
        "name": "Koperek",
        "grams": 2
      }
    ],
    "steps": [
      "Pieczarki i cebulę podsmaż.",
      "Dodaj ugotowaną kaszę i szpinak, podgrzej.",
      "Na wierzch połóż twaróg i koperek."
    ]
  },
  {
    "id": "h85",
    "title": "Gołąbki z indykiem",
    "cuisines": [
      "polish"
    ],
    "vibes": [
      "family-favs",
      "protein-packed"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "stove",
      "oven"
    ],
    "minutes": 45,
    "protein": 49,
    "fat": 17,
    "carbs": 51,
    "kcal": 560,
    "paid": [
      [
        "kapusta",
        0.25
      ],
      [
        "indyk",
        0.18
      ],
      [
        "ryz",
        0.04
      ],
      [
        "cebula",
        0.05
      ],
      [
        "passata",
        0.44
      ],
      [
        "jaja",
        0.1
      ],
      [
        "czosnek",
        0.12
      ]
    ],
    "pantry": [],
    "steps": [
      "Liście kapusty zblanszuj.",
      "Indyka wymieszaj z ryżem, jajkiem i cebulą, zawijaj w liście.",
      "Ułóż w passacie, przykryj i piecz 45 minut w 190°C."
    ]
  },
  {
    "id": "h86",
    "title": "Pęczak z kurczakiem i pieczarkami",
    "cuisines": [
      "polish"
    ],
    "vibes": [
      "home-style",
      "healthy-comfort"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 30,
    "protein": 49,
    "fat": 17,
    "carbs": 70,
    "kcal": 610,
    "paid": [
      [
        "kurczak",
        0.15
      ],
      [
        "peczak",
        0.07
      ],
      [
        "pieczarki",
        0.18
      ],
      [
        "cebula",
        0.06
      ],
      [
        "parmezan",
        0.02
      ],
      [
        "bulion",
        0.4
      ],
      [
        "oliwa",
        0.005
      ]
    ],
    "pantry": [],
    "steps": [
      "Kurczaka, pieczarki i cebulę podsmaż.",
      "Dodawaj pęczak i bulion partiami, mieszaj około 30 minut, aż pęczak zmięknie.",
      "Na końcu wmieszaj parmezan."
    ]
  },
  {
    "id": "h87",
    "title": "Indyk z warzywami z patelni",
    "cuisines": [
      "polish"
    ],
    "vibes": [
      "low-calories",
      "protein-packed"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 20,
    "protein": 43,
    "fat": 13,
    "carbs": 31,
    "kcal": 430,
    "paid": [
      [
        "indyk",
        0.17
      ],
      [
        "cukinia",
        0.12
      ],
      [
        "papryka",
        0.1
      ],
      [
        "marchew",
        0.07
      ],
      [
        "cebula",
        0.05
      ],
      [
        "pomidory",
        0.15
      ],
      [
        "oliwa",
        0.005
      ]
    ],
    "pantry": [
      {
        "name": "Zioła",
        "grams": 1
      }
    ],
    "steps": [
      "Indyka zrumień z cebulą.",
      "Dodaj warzywa i pomidory.",
      "Duś pod przykryciem 15–20 minut, aż warzywa zmiękną."
    ]
  },
  {
    "id": "h88",
    "title": "Pieczone ziemniaki z twarogiem",
    "cuisines": [
      "polish"
    ],
    "vibes": [
      "protein-packed",
      "speedy-meals"
    ],
    "proteins": [
      "veg"
    ],
    "isVegan": false,
    "appliances": [
      "oven"
    ],
    "minutes": 60,
    "protein": 34,
    "fat": 12,
    "carbs": 69,
    "kcal": 510,
    "paid": [
      [
        "ziemniaki",
        0.3
      ],
      [
        "twarog",
        0.18
      ],
      [
        "jogurt-grecki",
        0.333
      ],
      [
        "maslo",
        0.025
      ]
    ],
    "pantry": [
      {
        "name": "Szczypiorek",
        "grams": 20
      },
      {
        "name": "Sól",
        "grams": 2
      },
      {
        "name": "Pieprz",
        "grams": 1
      }
    ],
    "steps": [
      "Ziemniaki piecz 45–60 minut w 200°C, aż będą miękkie.",
      "Rozkrój i napełnij twarogiem wymieszanym z jogurtem i szczypiorkiem."
    ]
  },
  {
    "id": "h89",
    "title": "Warzywny gulasz",
    "cuisines": [
      "polish"
    ],
    "vibes": [
      "gut-friendly",
      "low-calories"
    ],
    "proteins": [
      "veg"
    ],
    "isVegan": true,
    "appliances": [
      "stove"
    ],
    "minutes": 30,
    "protein": 17,
    "fat": 9,
    "carbs": 67,
    "kcal": 430,
    "paid": [
      [
        "ziemniaki",
        0.18
      ],
      [
        "marchew",
        0.1
      ],
      [
        "cukinia",
        0.15
      ],
      [
        "kapusta",
        0.15
      ],
      [
        "fasola-biala",
        0.417
      ],
      [
        "pomidory",
        0.2
      ],
      [
        "cebula",
        0.06
      ],
      [
        "oliwa",
        0.005
      ]
    ],
    "pantry": [],
    "steps": [
      "Cebulę podsmaż, dodaj pokrojone warzywa i pomidory.",
      "Dolej wodę i duś 25–30 minut.",
      "Pod koniec wmieszaj fasolę."
    ]
  },
  {
    "id": "h90",
    "title": "Kurczak z kiszoną kapustą",
    "cuisines": [
      "polish"
    ],
    "vibes": [
      "gut-friendly",
      "protein-packed"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 25,
    "protein": 48,
    "fat": 13,
    "carbs": 54,
    "kcal": 530,
    "paid": [
      [
        "kurczak",
        0.15
      ],
      [
        "kiszona",
        0.25
      ],
      [
        "ziemniaki",
        0.18
      ],
      [
        "cebula",
        0.06
      ],
      [
        "jablko",
        0.05
      ],
      [
        "musztarda",
        0.05
      ],
      [
        "oliwa",
        0.005
      ]
    ],
    "pantry": [],
    "steps": [
      "Kurczaka i cebulę zrumień.",
      "Dodaj kiszoną kapustę, ziemniaka i jabłko oraz trochę wody.",
      "Przykryj i duś 25 minut, przed podaniem wmieszaj musztardę."
    ]
  },
  {
    "id": "h91",
    "title": "Burger z kurczakiem i frytkami z piekarnika",
    "cuisines": [
      "fusion"
    ],
    "vibes": [
      "fakeway",
      "family-favs"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "oven"
    ],
    "minutes": 25,
    "protein": 57,
    "fat": 25,
    "carbs": 83,
    "kcal": 760,
    "paid": [
      [
        "kurczak",
        0.17
      ],
      [
        "bulka-burger",
        1
      ],
      [
        "bulka-tarta",
        0.035
      ],
      [
        "jaja",
        0.1
      ],
      [
        "ziemniaki",
        0.25
      ],
      [
        "salata",
        0.25
      ],
      [
        "pomidory",
        0.08
      ],
      [
        "jogurt-grecki",
        0.267
      ],
      [
        "oliwa",
        0.01
      ]
    ],
    "pantry": [],
    "steps": [
      "Kurczaka obtocz w jajku i bułce tartej.",
      "Kurczaka i ziemniaczane ćwiartki piecz 20–25 minut w 210°C, raz obróć.",
      "Złóż burgera z sałatą, pomidorem i sosem jogurtowym."
    ]
  },
  {
    "id": "h92",
    "title": "Gyros z kurczaka",
    "cuisines": [
      "mediterranean"
    ],
    "vibes": [
      "fakeway",
      "protein-packed"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 30,
    "protein": 57,
    "fat": 14,
    "carbs": 55,
    "kcal": 590,
    "paid": [
      [
        "kurczak",
        0.17
      ],
      [
        "pita",
        1
      ],
      [
        "jogurt-grecki",
        0.533
      ],
      [
        "ogorki",
        0.08
      ],
      [
        "pomidory",
        0.08
      ],
      [
        "cebula",
        0.03
      ],
      [
        "czosnek",
        0.12
      ],
      [
        "oliwa",
        0.005
      ]
    ],
    "pantry": [
      {
        "name": "Papryka mielona",
        "grams": 2
      },
      {
        "name": "Kumin",
        "grams": 2
      }
    ],
    "steps": [
      "Kurczaka przypraw papryką, kuminem i czosnkiem, usmaż do rumieńca.",
      "Pokrój i napełnij pitę warzywami oraz jogurtem z czosnkiem."
    ]
  },
  {
    "id": "h93",
    "title": "Wrap z chrupiącym kurczakiem",
    "cuisines": [
      "fusion"
    ],
    "vibes": [
      "fakeway",
      "speedy-meals"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 30,
    "protein": 52,
    "fat": 20,
    "carbs": 57,
    "kcal": 620,
    "paid": [
      [
        "kurczak",
        0.16
      ],
      [
        "tortilla",
        0.167
      ],
      [
        "bulka-tarta",
        0.03
      ],
      [
        "jaja",
        0.1
      ],
      [
        "salata",
        0.3
      ],
      [
        "pomidory",
        0.07
      ],
      [
        "jogurt-grecki",
        0.267
      ],
      [
        "oliwa",
        0.005
      ]
    ],
    "pantry": [],
    "steps": [
      "Paski kurczaka obtocz w jajku i bułce tartej, smaż albo piecz w frytkownicy, aż będą chrupiące.",
      "Wrap napełnij sałatą, pomidorem i sosem jogurtowym."
    ]
  },
  {
    "id": "h94",
    "title": "Miska cheeseburger z wołowiną",
    "cuisines": [
      "fusion"
    ],
    "vibes": [
      "fakeway",
      "protein-packed"
    ],
    "proteins": [
      "beef"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 30,
    "protein": 45,
    "fat": 27,
    "carbs": 63,
    "kcal": 700,
    "paid": [
      [
        "mielone",
        0.16
      ],
      [
        "ryz",
        0.06
      ],
      [
        "cheddar",
        0.035
      ],
      [
        "salata",
        0.4
      ],
      [
        "pomidory",
        0.08
      ],
      [
        "ogorki-kiszone",
        0.04
      ],
      [
        "cebula",
        0.03
      ],
      [
        "sos-burger",
        0.12
      ]
    ],
    "pantry": [],
    "steps": [
      "Wołowinę zrumień z cebulą.",
      "W misce ułóż ryż, sałatę, pomidora, ogórki i mięso.",
      "Na wierzch daj cheddar i sos burgerowy."
    ]
  },
  {
    "id": "h95",
    "title": "Wrap Caesar z kurczakiem",
    "cuisines": [
      "italian"
    ],
    "vibes": [
      "fakeway",
      "speedy-meals"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 30,
    "protein": 53,
    "fat": 17,
    "carbs": 52,
    "kcal": 590,
    "paid": [
      [
        "kurczak",
        0.15
      ],
      [
        "tortilla",
        0.167
      ],
      [
        "salata",
        0.4
      ],
      [
        "parmezan",
        0.02
      ],
      [
        "jogurt-grecki",
        0.333
      ],
      [
        "cytryna",
        1
      ],
      [
        "czosnek",
        0.12
      ],
      [
        "bulka-tarta",
        0.02
      ],
      [
        "oliwa",
        0.005
      ]
    ],
    "pantry": [],
    "steps": [
      "Panierowanego kurczaka usmaż na patelni albo w frytkownicy.",
      "Jogurt wymieszaj z cytryną, czosnkiem i parmezanem.",
      "Wrap napełnij sałatą, kurczakiem i sosem."
    ]
  },
  {
    "id": "h96",
    "title": "Pizza na tortilli",
    "cuisines": [
      "italian"
    ],
    "vibes": [
      "fakeway",
      "family-favs"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "oven"
    ],
    "minutes": 12,
    "protein": 43,
    "fat": 21,
    "carbs": 54,
    "kcal": 590,
    "paid": [
      [
        "tortilla",
        0.167
      ],
      [
        "passata",
        0.16
      ],
      [
        "mozzarella",
        0.07
      ],
      [
        "kurczak",
        0.1
      ],
      [
        "papryka",
        0.06
      ],
      [
        "oliwa",
        0.005
      ]
    ],
    "pantry": [
      {
        "name": "Oregano",
        "grams": 1
      }
    ],
    "steps": [
      "Tortillę posmaruj passatą.",
      "Nałóż ugotowanego kurczaka, paprykę i mozzarellę.",
      "Piecz 8–12 minut w 220°C, aż będzie chrupiąca, a ser się stopi. Posyp oregano."
    ]
  },
  {
    "id": "h97",
    "title": "Miska shawarma z kurczakiem",
    "cuisines": [
      "mediterranean"
    ],
    "vibes": [
      "fakeway",
      "protein-packed"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 30,
    "protein": 58,
    "fat": 22,
    "carbs": 61,
    "kcal": 670,
    "paid": [
      [
        "kurczak",
        0.17
      ],
      [
        "ryz",
        0.06
      ],
      [
        "hummus",
        0.25
      ],
      [
        "ogorki",
        0.08
      ],
      [
        "pomidory",
        0.1
      ],
      [
        "salata",
        0.25
      ],
      [
        "tahini",
        0.05
      ]
    ],
    "pantry": [
      {
        "name": "Papryka mielona",
        "grams": 2
      }
    ],
    "steps": [
      "Kurczaka przypraw, usmaż i pokrój.",
      "Do miski włóż ryż, hummus i warzywa.",
      "Polej tahini i posyp papryką."
    ]
  },
  {
    "id": "h98",
    "title": "Pieczony ziemniak z kurczakiem i serem",
    "cuisines": [
      "fusion"
    ],
    "vibes": [
      "home-style",
      "protein-packed",
      "fakeway"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "stove",
      "oven"
    ],
    "minutes": 60,
    "protein": 52,
    "fat": 20,
    "carbs": 72,
    "kcal": 650,
    "paid": [
      [
        "ziemniaki",
        0.35
      ],
      [
        "kurczak",
        0.13
      ],
      [
        "cheddar",
        0.05
      ],
      [
        "jogurt-grecki",
        0.333
      ],
      [
        "cebula",
        0.02
      ],
      [
        "oliwa",
        0.005
      ]
    ],
    "pantry": [],
    "steps": [
      "Ziemniaka piecz 50–60 minut w 200°C.",
      "Kurczaka usmaż i pokrój.",
      "Ziemniaka rozkrój, rozluźnij miąższ i napełnij kurczakiem, serem, jogurtem i szczypiorkiem."
    ]
  },
  {
    "id": "h99",
    "title": "Ryż z chrupiącym kurczakiem i ostrym majonezem",
    "cuisines": [
      "asian"
    ],
    "vibes": [
      "fakeway",
      "protein-packed"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "oven"
    ],
    "minutes": 30,
    "protein": 52,
    "fat": 22,
    "carbs": 73,
    "kcal": 700,
    "paid": [
      [
        "kurczak",
        0.16
      ],
      [
        "ryz",
        0.064
      ],
      [
        "majonez",
        0.075
      ],
      [
        "sriracha",
        0.075
      ],
      [
        "panko",
        0.025
      ],
      [
        "jaja",
        0.1
      ],
      [
        "ogorki",
        0.08
      ],
      [
        "cebula",
        0.05
      ]
    ],
    "pantry": [],
    "steps": [
      "Kurczaka obtocz w jajku i panko, upiecz w frytkownicy albo w piekarniku, aż będzie chrupiący.",
      "Majonez wymieszaj ze srirachą.",
      "Podawaj kurczaka na ryżu z ogórkiem i ostrym majonezem."
    ]
  },
  {
    "id": "h100",
    "title": "Domowe burrito z kurczakiem",
    "cuisines": [
      "mexican"
    ],
    "vibes": [
      "fakeway",
      "family-favs"
    ],
    "proteins": [
      "chicken"
    ],
    "isVegan": false,
    "appliances": [
      "stove"
    ],
    "minutes": 30,
    "protein": 58,
    "fat": 24,
    "carbs": 82,
    "kcal": 760,
    "paid": [
      [
        "kurczak",
        0.17
      ],
      [
        "tortilla",
        0.167
      ],
      [
        "ryz",
        0.048
      ],
      [
        "fasola-czarna",
        0.333
      ],
      [
        "cheddar",
        0.035
      ],
      [
        "salsa",
        0.233
      ],
      [
        "awokado",
        0.313
      ],
      [
        "jogurt-grecki",
        0.267
      ]
    ],
    "pantry": [],
    "steps": [
      "Kurczaka usmaż i pokrój.",
      "Na tortillę nałóż ryż, fasolę, kurczaka, ser, salsę, awokado i jogurt.",
      "Zwiń ciasno i opiecz na patelni, szwem do dołu."
    ]
  }
];
