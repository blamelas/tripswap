export interface HabitText {
  title: string
  description: string
  assumptions: string
}

export interface DestinationText {
  quote: string
  description: string
  imageAlt: string
  includes: string[]
  country: string
}

export const habitEn: Record<string, HabitText> = {
  'uber-public-transport': {
    title: 'Replace half of Uber/TVDE rides with public transport',
    description:
      'Instead of hailing a car on every trip, you take the metro, bus or train half the time.',
    assumptions: '4 trips per month · €10 per trip · €2.50 on public transport.',
  },
  'walk-short-distances': {
    title: 'Walk instead of paying for short trips',
    description:
      'Small journeys you currently drive or take transport for become walks.',
    assumptions: '6 short trips per month · €7 each · a zero-cost alternative.',
  },
  'coffee-at-home': {
    title: 'Make coffee at home',
    description:
      'Your daily coffee is brewed at home with equipment you already own.',
    assumptions: '20 coffees per month · €2 outside · €0.40 at home.',
  },
  'replace-bought-snacks': {
    title: 'Swap bought snacks for cheaper alternatives',
    description:
      'Impulse snacks at the counter become bulk-bought or simpler options.',
    assumptions: '12 snacks per month · €3.50 · €0.80 alternative.',
  },
  'reduce-takeaway': {
    title: 'Order less takeaway',
    description: 'Four orders per month become meals cooked at home.',
    assumptions: '4 orders per month · €18 each · €8 in ingredients.',
  },
  'lunch-from-home': {
    title: 'Bring lunch from home',
    description: 'Twelve restaurant or canteen lunches become home-made.',
    assumptions: '12 lunches per month · €9 outside · €4 in ingredients.',
  },
  'reduce-alcohol': {
    title: 'Halve alcoholic drinks',
    description:
      'Eight drinks per month no longer happen, without changing the rest of your routine.',
    assumptions: '8 drinks avoided per month · €5 per drink.',
  },
  'water-instead-of-soft-drinks': {
    title: 'Swap some sugary drinks for water',
    description:
      'Sixteen drinks per month become water instead of soft drinks or juice.',
    assumptions: '16 swaps per month · €1.50 difference per drink.',
  },
  'cook-instead-of-ready-meals': {
    title: 'Cook instead of buying ready meals',
    description:
      'Eight ready meals per month are cooked from scratch at home.',
    assumptions: '8 meals per month · €5 difference per meal.',
  },
  'simpler-snacks': {
    title: 'Choose simpler processed snacks',
    description:
      'Twelve snacks per month move to a cheaper alternative in the same category.',
    assumptions: '12 swaps per month · €1.20 difference per snack.',
  },
  'half-nights-out': {
    title: 'Halve nights out',
    description:
      'Two weekends a month become a night in or a low-cost alternative.',
    assumptions: '2 nights avoided per month · €30 per night · €5 alternative.',
  },
  'cancel-streaming': {
    title: 'Borrow books and cancel one streaming service',
    description:
      'One monthly streaming subscription is cancelled; books come from the library.',
    assumptions: '1 subscription at €12/month · library at no cost.',
  },
  'smaller-tv-package': {
    title: 'Choose a smaller TV package',
    description: 'Keep the channels you use and reduce the package you pay for.',
    assumptions: 'Illustrative €15 monthly difference between packages.',
  },
  'cancel-forgotten-subscriptions': {
    title: 'Cancel forgotten subscriptions',
    description:
      'Two services you no longer use stop being charged every month.',
    assumptions: '2 distinct services · €8/month each.',
  },
  'repair-shoes': {
    title: 'Repair shoes instead of buying new',
    description:
      'A pair that still fits and feels good goes to the cobbler instead of being replaced.',
    assumptions: '€90 replacement avoided · €25 repair.',
  },
  'reduce-impulse-clothing': {
    title: 'Reduce impulse clothing purchases',
    description:
      'One purchase a month no longer happens; what you own gets worn again.',
    assumptions: '1 purchase avoided per month · €35 each.',
  },
  'repair-equipment': {
    title: 'Repair equipment before replacing it',
    description: 'Broken equipment is repaired instead of replaced.',
    assumptions: '€160 replacement avoided · €40 repair.',
  },
  'reduce-food-waste': {
    title: 'Reduce food waste with planning',
    description:
      'A simple meal plan avoids purchases that end up in the bin.',
    assumptions: '€15 of monthly groceries no longer wasted.',
  },
  'cheaper-mobile-plan': {
    title: 'Move to a simpler mobile plan',
    description: 'A plan with fewer data or services does the same job.',
    assumptions: 'Illustrative €10 monthly difference between plans.',
  },
  'repair-clothing': {
    title: 'Repair clothes instead of replacing them',
    description:
      'A piece you like is mended instead of replaced with a new one.',
    assumptions: '€55 replacement avoided · €15 repair.',
  },
  'second-hand-instead-of-new': {
    title: 'Buy one item second-hand',
    description:
      'One monthly purchase is made second-hand, with the same function.',
    assumptions: '1 purchase per month · €30 new · €10 second-hand.',
  },
  'sell-unused-items': {
    title: 'Sell things you no longer use',
    description:
      'A one-off sale of items sitting at home. Not recurring savings.',
    assumptions:
      'Illustrative one-off sale of €80. It does not repeat every month.',
  },
  'stop-tobacco': {
    title: 'Stop buying tobacco',
    description:
      'Twenty packs a month are no longer bought. Does not include cessation support costs.',
    assumptions:
      '20 packs per month · €6 per pack. Does not include cessation support.',
  },
  'games-betting': {
    title: 'Spend less on games of chance and betting',
    description:
      'Scratch cards, online betting and casino visits add up quietly. Swap part of that spend for board games or free plans, and put some of the budget toward a new experience.',
    assumptions:
      'Enter your current monthly spend on scratch cards, betting or casino, and the amount you would rather keep. Saving = current − reduced.',
  },
  'exercise-at-home': {
    title: 'Train at home instead of paying for a gym',
    description: 'Training moves home, with equipment you already own.',
    assumptions: '€30/month gym subscription · equipment already owned.',
  },
}

export const destinationEn: Record<string, DestinationText> = {
  'douro-escape': {
    quote: 'Two days among terraces, water and silence.',
    description:
      'A slow escape through the Douro valley: a quinta, a wine tasting and time to do nothing. The kind of trip paid for by small decisions in ordinary weeks.',
    imageAlt: 'Terraced vineyards above the Douro river at dusk',
    includes: ['Transport', 'Accommodation', 'Breakfast'],
    country: 'Portugal',
  },
  'lisbon-weekend': {
    quote: 'The city you see by climbing, slowly.',
    description:
      'Viewpoints, pastry shops and streets that are on no map. A city small enough to walk and large enough to surprise.',
    imageAlt: 'Rooftops of Alfama and the Tagus river seen from a viewpoint in Lisbon',
    includes: ['Accommodation', 'Meals', 'Local transport'],
    country: 'Portugal',
  },
  'paris-city-break': {
    quote: 'Three nights to believe in cities again.',
    description:
      'A long weekend between museums, the Seine and cafés where time slows down. The destination that opens the catalogue and the conversation.',
    imageAlt: 'Eiffel Tower lit at dusk above Paris',
    includes: ['Transport', 'Accommodation', 'Breakfast'],
    country: 'France',
  },
  'barcelona-weekend': {
    quote: 'Architecture, sea and a longer night.',
    description:
      'Gaudí in the morning, the beach in the afternoon and narrow neighbourhoods at night. A city that adapts to your pace, even on a weekend.',
    imageAlt: 'Barcelona skyline seen from Park Güell',
    includes: ['Transport', 'Accommodation', 'Local transport'],
    country: 'Spain',
  },
  'rome-discovery': {
    quote: 'Four days walking inside history.',
    description:
      'Rome is not to be rushed. Squares, ruins and neighbourhood trattorias — a four-night plan for coming back with tired feet and a full head.',
    imageAlt: 'The Colosseum in Rome in daylight',
    includes: ['Transport', 'Accommodation', 'Basic meals'],
    country: 'Italy',
  },
  'alps-winter-escape': {
    quote: 'Four days surrounded by snow.',
    description:
      'A mountain village, cold air and days that begin with snow at the window. The most ambitious winter trip in the catalogue — and the one that grows most with small swaps.',
    imageAlt: 'The French Alps covered in snow',
    includes: ['Transport', 'Accommodation', 'Ski pass'],
    country: 'France',
  },
  'northern-lights': {
    quote: 'Six nights looking for the right sky.',
    description:
      'A road trip through southern Iceland, with auroras as the goal and winter as company. A bigger plan, for anyone who wants a bigger reason.',
    imageAlt: 'Green aurora borealis above red-roofed cabins in Iceland',
    includes: ['Transport', 'Accommodation', 'Car rental'],
    country: 'Iceland',
  },
  'india-discovery': {
    quote: 'Twelve nights to change the scale.',
    description:
      'The big leap in the catalogue: several cities, a whole country and a twelve-night plan. Not for tomorrow — for the day you decide it is worth it.',
    imageAlt: 'Taj Mahal in Agra, India, reflected in the garden',
    includes: ['Flights', 'Accommodation', 'Internal transport'],
    country: 'India',
  },
}

export const benefitEn: Record<string, string> = {
  'Mais caminhada': 'More walking',
  'Menos desperdício': 'Less waste',
  'Mais cozinha em casa': 'More home cooking',
  'Menos bebidas açucaradas': 'Fewer sugary drinks',
  'Reparar e reutilizar': 'Repair & reuse',
  'Consumo consciente': 'Conscious spending',
  'Mais movimento': 'More movement',
  'Menos tabaco comprado': 'Less tobacco bought',
}
