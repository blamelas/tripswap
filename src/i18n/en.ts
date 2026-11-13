import type { Copy } from './pt'

export const en: Copy = {
  meta: {
    title: 'TripSwap — Small changes. Bigger journeys.',
    description:
      'TripSwap — small changes, bigger journeys. Discover the experiences you could unlock by changing the small habits of everyday life.',
  },
  nav: {
    discover: 'Destinations',
    placesShort: 'Places',
    unlocks: 'My plans',
    unlocksShort: 'Plans',
    about: 'About',
    skip: 'Skip to content',
    language: 'Language',
    menu: 'Navigation',
    toEnglish: 'Switch to English',
    toPortuguese: 'Switch to Portuguese',
  },
  price: {
    planningTarget: 'Planning target',
    fundedBySwaps: 'Funded by everyday swaps',
    metaphor:
      '€0* is a metaphor. The trip is paid with money saved through the swaps you choose — not a discount or a free trip.',
    notAPrice: 'Not a price or an offer.',
  },
  reward: {
    timeToReach: 'Time to reach',
    months: 'months',
    month: 'month',
    selected: 'swaps selected',
    unlocked: 'Unlocked in simulation',
    noPlan: 'Choose a swap to start.',
    destination: 'Destination',
  },
  common: {
    perMonth: '/mo',
    oneTime: 'one-time',
    objective: 'Target',
    save: 'Save',
    saved: 'Saved',
    remove: 'Remove',
    open: 'Open',
    target: 'target',
    today: 'today',
    nights: (n: number) => (n === 1 ? '1 night' : `${n} nights`),
    reached: 'target reached',
  },
  footer: {
    explore: 'Explore',
    catalogue: 'Destinations',
    unlocks: 'My plans',
    how: 'About',
    honest: 'Honest note',
    honestBody:
      'Budgets are illustrative planning targets, not verified prices or offers. €0* means the trip would be paid for with money saved through the chosen swaps — it is not free, and it is not a discount.',
    project:
      'Final project for Building Digital Products with Generative AI · 2026.',
    blurb:
      'A travel discovery experience that starts with desire and ends with small, better decisions.',
    tagline: 'Small changes. Bigger journeys.',
  },
  destinationCategories: {
    weekend: 'Weekend escape',
    city: 'City',
    nature: 'Nature & adventure',
    winter: 'Winter',
    culture: 'Culture',
    journey: 'Big journey',
  },
  habitCategories: {
    mobility: 'Mobility',
    food: 'Food & drink',
    entertainment: 'Leisure & subscriptions',
    shopping: 'Shopping & repairs',
    wellbeing: 'Wellbeing',
  },
  card: {
    aria: (name: string, country: string, budget: string) =>
      `${name}, ${country}. Planning target ${budget}. See how to unlock.`,
    cta: 'Unlock this experience',
    withSwaps: 'with swaps',
  },
  discover: {
    eyebrow: 'Travel, funded by habits.',
    headline: {
      line1: 'The world',
      line2: 'is the',
      accent: 'reward.',
    },
    intro:
      'Pick a place. Change a few everyday habits. See how soon it becomes possible.',
    ctaDestinations: 'Find your next place',
    ctaHow: 'How it works',
    stats: ['8 destinations', '24 swaps', 'No spreadsheets'],
    chapters: ['Dream', 'Swap', 'Arrive'],
    featuredNote: (budget: string) =>
      `Illustrative target of ${budget} · not a price`,
    steps: [
      {
        number: '01',
        title: 'Discover',
        body: 'A destination, an image, a clear planning target. Desire comes first.',
      },
      {
        number: '02',
        title: 'Swap',
        body: 'Choose changes you would actually make. No salaries, no statements, no forms.',
      },
      {
        number: '03',
        title: 'Unlock',
        body: 'See the savings and the horizon in real time. A plan, not a promise.',
      },
    ],
    catalogueEyebrow: 'Destinations',
    catalogueTitle: 'Choose a place.',
    catalogueIntro:
      'From a weekend close to home to the trip that takes a year of small decisions.',
    zeroEyebrow: 'The €0* note',
    zeroTitle: 'It is not free. It is paid with choices.',
    zeroBody:
      'Every destination has a real cost. €0* shows what would happen if it were covered by the money you save through your swaps. Not a discount, not a free trip.',
    ruleLabel: 'The project rule',
    ruleQuote: '“Less of this. More of the world.”',
    ruleBody:
      'The trip still has a price. What changes is who funds it: the small, repeated decisions already part of your week.',
    ruleLink: 'Read the assumptions',
  },
  detail: {
    back: 'Catalogue',
    targetLine: 'Planning target:',
    fundedBySwaps: 'funded by swaps',
    labels: {
      departure: 'Departure',
      travellers: 'Travellers',
      nights: 'Nights',
      includes: 'Includes',
    },
    illustrative:
      'Illustrative planning target. Not a verified price, a current fare or a travel offer. TripSwap does not book trips.',
    presetsEyebrow: 'Start with a plan',
    presetsHint: 'You can adjust everything afterwards',
    step2Eyebrow: '02 — Swap',
    step2Title: 'What would you change?',
    step2Intro:
      'Pick only what you would actually do. Nothing here is mandatory and nothing leaves your device.',
    projectionEyebrow: 'The projection',
    unlockEyebrow: 'Unlocked in simulation',
    unlockSentence: (name: string, months: string) =>
      `This plan brings ${name} within reach in about ${months}.`,
    unlockBody:
      'You have not saved anything yet — this is the plan, not the balance. Keep it to return when you want to revisit the swaps.',
    unlockSave: 'Save this future',
    unlockSaved: 'Plan saved',
    step3: '03 — Arrive',
    missingTitle: 'This destination does not exist.',
    missingBody:
      'The link may be incomplete. Go back to the catalogue and choose an experience.',
    monthsTarget: (budget: string) =>
      `for a target of ${budget}. A projection, not money already saved.`,
  },
  habitSelector: {
    count: (n: number) => `${n} swaps`,
  },
  habitCard: {
    replacement: (title: string) =>
      `Replaces “${title}” · same spending.`,
  },
  panel: {
    states: {
      discover: {
        label: 'Discover',
        hint: 'Choose the first swaps to see the horizon.',
      },
      'on-the-way': {
        label: 'On the way',
        hint: 'A valid plan exists. The horizon is calculated.',
      },
      unlocked: {
        label: 'Unlocked in simulation',
        hint: 'Projected savings reach the target within your horizon.',
      },
      unreachable: {
        label: 'Out of reach',
        hint: 'With these swaps, the target is not reached in 20 years.',
      },
    },
    perMonth: 'Per month',
    oneTime: 'One-time',
    horizon: 'Horizon',
    targetNote: (budget: string) =>
      `for a target of ${budget}. A projection, not money already saved.`,
    progress: (percent: string, horizon: string) => `${percent} in ${horizon}`,
    remaining: (amount: string) => `${amount} to go`,
    save: 'Save this plan',
    saved: 'Plan saved',
    disclaimer:
      'Saved only on this device. The trip is not free: €0* is the metaphor for a cost covered by the chosen swaps.',
    saveNote: 'A projection, not money already saved.',
    monthsSuffix: (n: number) => (n === 1 ? 'month' : 'months'),
  },
  presets: {
    essential: {
      label: 'Essential',
      description: 'Two swaps, without touching the rest.',
    },
    balanced: {
      label: 'Balanced',
      description: 'The suggested plan for this destination.',
    },
    conscious: {
      label: 'Conscious',
      description: 'More swaps, including repairing and drinking better.',
    },
  },
  preset: {
    outOfReach: 'out of reach',
  },
  projection: {
    aria: (target: string, horizon: string) =>
      `Savings projection over ${horizon} against a target of ${target}.`,
    note:
      'The line adds recurring savings month by month and one-time savings at the start. It is not a real bank account.',
  },
  receipt: {
    title: 'How we calculated',
    subtitle: 'Every line is reproducible from the visible assumptions.',
    emptyTitle: 'No swaps selected yet.',
    emptyBody:
      'Choose a swap above — or apply a suggested plan — to see the full calculation, line by line.',
    headers: {
      swap: 'Swap',
      calculation: 'Calculation',
      value: 'Value',
    },
    recurringTotal: 'Recurring savings per month',
    oneTimeTotal: 'One-time savings (once)',
    objective: 'Target',
    inHorizon: (horizon: string) => `In ${horizon}`,
    estimatedHorizon: 'Estimated horizon',
    notes: [
      'Projected savings = monthly savings × months + one-time savings. One-time savings enter once and are never treated as monthly income.',
      'Swaps that assume the same spending belong to the same group and only one can be active. That is why choosing one replaces the other instead of adding up.',
      'Illustrative values defined for this project. They are not market averages, guaranteed savings or a travel offer.',
    ],
  },
  unlocks: {
    eyebrow: '03 — Arrive',
    title: 'My plans',
    intro:
      'Plans saved only on this device. They are savings simulations, not bookings or money already saved.',
    clear: 'Clear all',
    confirm:
      'Remove every plan saved on this device? This cannot be undone.',
    emptyEyebrow: 'Nothing yet',
    emptyTitle: 'You have not saved a future yet.',
    emptyBody:
      'Open a destination, choose the swaps you would make and save the plan. It stays here, waiting to be revisited.',
    emptyCta: 'Explore destinations',
    savedOn: (date: string) => `saved on ${date}`,
    estimatedHorizon: 'Estimated horizon',
    target: 'Target',
    perMonth: 'Per month',
    swaps: 'Swaps',
    openPlan: 'Open plan',
    remove: 'Remove',
  },
  about: {
    eyebrow: 'About TripSwap',
    titleA: 'This is not a finance app.',
    titleB: 'It is a way of seeing what',
    titleAccent: 'small decisions pay for.',
    intro:
      'TripSwap looks like a travel discovery platform — and it is. Underneath, it does something else: it shows that changing ordinary habits can fund experiences that felt out of reach. No budgets, no spreadsheets and no guilt.',
    pillarsEyebrow: 'The three pillars',
    pillarsTitle: 'What sits under the catalogue',
    pillars: [
      {
        title: 'Spend smarter',
        body: 'Less unnecessary transport, fewer forgotten subscriptions and fewer impulse purchases. The money stays for what you really want.',
      },
      {
        title: 'Live healthier',
        body: 'More walking, more home cooking, less tobacco and fewer sugary drinks. Voluntary changes, without medical promises.',
      },
      {
        title: 'Consume consciously',
        body: 'Repair before replacing, reuse what already exists and reduce waste. Fewer things, more life.',
      },
    ],
    pillarsNote:
      'Benefits beyond money appear as qualitative tags. They are not medical claims, health metrics or scientific evidence.',
    transparencyEyebrow: 'Transparency',
    transparencyTitle: 'How the number appears',
    transparencyBody:
      'The engine is deterministic and lives in the browser. Every swap has an original cost, an alternative and a frequency. The result is always reproducible from the visible assumptions.',
    formulas: {
      recurringLabel: 'Recurring savings',
      recurringValue: '(original cost − alternative) × monthly frequency',
      oneTimeLabel: 'One-time savings',
      oneTimeValue: 'avoided cost − alternative cost · once',
      projectionLabel: 'Projection',
      projectionValue: 'monthly savings × months + one-time savings',
    },
    overlapEyebrow: 'No double counting',
    overlapBody1:
      'Two swaps that assume the same spending are never added together. Each overlap group — meals, snacks, nights out, subscriptions, repairs, trips — accepts only one choice at a time.',
    overlapBody2:
      'Choosing another option in the same group replaces the previous one, and the interface explains why.',
    groups: ['Meals', 'Snacks', 'Nights out', 'Subscriptions', 'Repairs', 'Trips'],
    stats: (habits: number, destinations: number, min: string, max: string) =>
      `${habits} swaps in the catalogue, ${destinations} destinations, ${min} to ${max} illustrative target.`,
    zeroEyebrow: 'a metaphor, not a price',
    zeroTitle: 'The trip is not free.',
    zeroBody1:
      '€0* describes a scenario: the destination cost would be covered by the money you would no longer spend on the selected swaps. The real budget remains visible on every card and every detail page.',
    zeroBody2:
      'There is no discount, no previous price and no offer. There is no booking. There is a plan.',
    limitsEyebrow: 'Explicit limits',
    limitsTitle: 'What this project does not do',
    limits: [
      'It does not book trips or query live fares.',
      'It does not ask for salary, bank statements or personal data.',
      'It stores nothing on a server: plans stay in your browser.',
      'It does not use generative AI for arithmetic.',
      'It makes no health, weight-loss or avoided-emissions promises.',
      'It does not present illustrative values as verified prices.',
    ],
    assumptionsNote:
      'Budgets assume a departure city (Lisbon), two travellers and the scope stated for each destination. They are fictional planning values, not market averages. The currency is the euro and the calculations use simple arithmetic, validated by tests.',
    creditsEyebrow: 'Photography',
    creditsTitle: 'Image credits',
    creditsNote:
      'Local photography, served from the site itself so the demo works without an external network. Full licences are in docs/CREDITS.md.',
    closingEyebrow: 'Small changes. Bigger journeys.',
    closingLine:
      'Stop saving for nothing. Choose a trip and see what you can already change.',
    closingCta: 'See the catalogue',
    languageNote:
      'The interface and documentation are available in Portuguese and English.',
  },
  notFound: {
    eyebrow: 'Error 404',
    title: 'Page not found.',
    body: 'The address may be incomplete. The catalogue is still here.',
    cta: 'Back to the catalogue',
  },
  a11y: {
    progress: 'Progress towards the target',
    progressHorizon: (horizon: string) => `Progress towards the target in ${horizon}`,
    progressPlan: (name: string) => `${name} progress`,
  },
}
