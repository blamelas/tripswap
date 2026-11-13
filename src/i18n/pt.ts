export const pt = {
  meta: {
    title: 'TripSwap — Small changes. Bigger journeys.',
    description:
      'TripSwap — pequenas mudanças, viagens maiores. Descobre as experiências que podes desbloquear mudando os pequenos hábitos do dia a dia.',
  },
  nav: {
    discover: 'Destinos',
    placesShort: 'Locais',
    swaps: 'As trocas',
    swapsShort: 'Trocas',
    unlocks: 'Os meus planos',
    unlocksShort: 'Planos',
    about: 'Sobre',
    skip: 'Saltar para o conteúdo',
    language: 'Idioma',
    menu: 'Navegação',
    toEnglish: 'Mudar para inglês',
    toPortuguese: 'Mudar para português',
  },
  price: {
    planningTarget: 'Objetivo de planeamento',
    fundedBySwaps: 'Financiado por trocas do dia a dia',
    metaphor:
      '€0* é uma metáfora. A viagem é paga com dinheiro poupado nas trocas que escolheres — não é um desconto nem uma viagem gratuita.',
    notAPrice: 'Não é um preço nem uma oferta.',
  },
  reward: {
    timeToReach: 'Tempo até chegar',
    months: 'meses',
    month: 'mês',
    selected: 'trocas escolhidas',
    unlocked: 'Desbloqueado na simulação',
    noPlan: 'Escolhe uma troca para começar.',
    destination: 'Destino',
    reachedEyebrow: 'Objetivo alcançado',
    reachedTitle: 'Isto agora é possível.',
    covered: 'As trocas escolhidas cobrem o objetivo de planeamento.',
    simulation: 'Simulação, não uma reserva.',
    unlockedShort: 'Alcançado',
  },
  common: {
    perMonth: '/mês',
    oneTime: 'uma vez',
    objective: 'Objetivo',
    save: 'Guardar',
    saved: 'Guardado',
    remove: 'Remover',
    open: 'Abrir',
    target: 'objetivo',
    today: 'hoje',
    nights: (n: number) => (n === 1 ? '1 noite' : `${n} noites`),
    reached: 'objetivo atingido',
  },
  footer: {
    explore: 'Explorar',
    catalogue: 'Destinos',
    swaps: 'As trocas',
    unlocks: 'Os meus planos',
    how: 'Sobre',
    honest: 'Nota honesta',
    honestBody:
      'Os orçamentos são objetivos ilustrativos de planeamento, não preços verificados nem ofertas. O €0* significa que a viagem seria paga com dinheiro poupado nas trocas escolhidas — não é grátis, nem um desconto.',
    project:
      'Projeto final do curso Building Digital Products with Generative AI · 2026.',
    blurb:
      'Uma experiência de descoberta de viagens que começa no desejo e acaba em pequenas decisões melhores.',
    tagline: 'Small changes. Bigger journeys.',
  },
  destinationCategories: {
    weekend: 'Escapadinha',
    city: 'Cidade',
    nature: 'Natureza e aventura',
    winter: 'Inverno',
    culture: 'Cultura',
    journey: 'Grande viagem',
  },
  habitCategories: {
    mobility: 'Mobilidade',
    food: 'Comida e bebida',
    entertainment: 'Lazer e subscrições',
    shopping: 'Compras e reparações',
    wellbeing: 'Bem-estar',
    games: 'Jogos de azar e apostas',
  },
  card: {
    aria: (name: string, country: string, budget: string) =>
      `${name}, ${country}. Objetivo de planeamento ${budget}. Ver como desbloquear.`,
    cta: 'Desbloquear esta experiência',
    withSwaps: 'com trocas',
  },
  discover: {
    eyebrow: 'Viagens financiadas por hábitos.',
    headline: {
      line1: 'O mundo',
      line2: 'é a',
      accent: 'recompensa.',
    },
    intro:
      'Escolhe um lugar. Muda pequenos hábitos. Vê em quanto tempo ele fica ao teu alcance.',
    ctaDestinations: 'Encontra o próximo lugar',
    ctaHow: 'Como funciona',
    stats: ['8 destinos', '25 trocas', 'Sem folhas de cálculo'],
    chapters: ['Sonhar', 'Trocar', 'Chegar'],
    featuredNote: (budget: string) =>
      `Objetivo ilustrativo de ${budget} · não é um preço`,
    steps: [
      {
        number: '01',
        title: 'Descobre',
        body: 'Um destino, uma imagem, um orçamento de planeamento claro. O desejo vem primeiro.',
      },
      {
        number: '02',
        title: 'Troca',
        body: 'Escolhe mudanças que farias mesmo. Sem salários, sem extratos, sem formulários.',
      },
      {
        number: '03',
        title: 'Desbloqueia',
        body: 'Vê a poupança e o prazo em tempo real. Um plano, não uma promessa.',
      },
    ],
    catalogueEyebrow: 'Destinos',
    catalogueTitle: 'Escolhe um lugar.',
    catalogueIntro:
      'Do fim de semana perto de casa à viagem que exige um ano de pequenas decisões.',
    zeroEyebrow: 'A nota dos €0*',
    zeroTitle: 'Não é grátis. É pago com escolhas.',
    zeroBody:
      'Cada destino tem um custo real. O €0* mostra o que aconteceria se esse custo fosse coberto pelo dinheiro poupado nas tuas trocas. Não é um desconto nem uma viagem gratuita.',
    ruleLabel: 'A regra do projeto',
    ruleQuote: '“Menos isto. Mais mundo.”',
    ruleBody:
      'A viagem continua a ter um preço. O que muda é quem a financia: as decisões pequenas, repetidas, que já fazem parte da tua semana.',
    ruleLink: 'Ler as premissas',
  },
  detail: {
    back: 'Catálogo',
    targetLine: 'Objetivo de planeamento:',
    fundedBySwaps: 'financiado por trocas',
    labels: {
      departure: 'Partida',
      travellers: 'Viajantes',
      nights: 'Noites',
      includes: 'Inclui',
    },
    illustrative:
      'Objetivo ilustrativo de planeamento. Não é um preço verificado, uma tarifa atual nem uma oferta de viagem. O TripSwap não reserva viagens.',
    presetsEyebrow: 'Planos sugeridos',
    presetsHint: 'Podes ajustar tudo depois',
    step2Eyebrow: '02 — Trocar',
    step2Title: 'O que mudarias?',
    step2Intro:
      'Escolhe só o que farias mesmo. Nada aqui é obrigatório e nada é enviado para fora do teu dispositivo.',
    projectionEyebrow: 'A projeção',
    unlockEyebrow: 'Desbloqueado na simulação',
    unlockSentence: (name: string, months: string) =>
      `Este plano coloca ${name} ao teu alcance em aproximadamente ${months}.`,
    unlockBody:
      'Ainda não poupaste nada — isto é o plano, não o saldo. Guarda-o para voltares quando quiseres rever as trocas.',
    unlockSave: 'Guardar este futuro',
    unlockSaved: 'Plano guardado',
    step3: '03 — Chegar',
    missingTitle: 'Este destino não existe.',
    missingBody:
      'O link pode estar incompleto. Volta ao catálogo e escolhe uma experiência.',
    monthsTarget: (budget: string) =>
      `para um objetivo de ${budget}. Projeção, não dinheiro já poupado.`,
  },
  habitSelector: {
    summary: (available: number, selected: number) =>
      `${available} ${available === 1 ? 'troca disponível' : 'trocas disponíveis'} · ${selected} ${selected === 1 ? 'selecionada' : 'selecionadas'}`,
  },
  habitCard: {
    replacement: (title: string) =>
      `Substitui “${title}” · mesmas despesas.`,
    overlap: 'Mesmas despesas · escolhe uma',
    details: 'Detalhes',
    assumptionLabel: 'Premissa',
  },
  panel: {
    states: {
      discover: {
        label: 'Descobrir',
        hint: 'Escolhe as primeiras trocas para ver o prazo.',
      },
      'on-the-way': {
        label: 'A caminho',
        hint: 'Há um plano válido. O prazo está calculado.',
      },
      unlocked: {
        label: 'Desbloqueado na simulação',
        hint: 'A poupança projetada chega ao objetivo no teu horizonte.',
      },
      unreachable: {
        label: 'Fora de alcance',
        hint: 'Com estas trocas, o objetivo não chega em 20 anos.',
      },
    },
    perMonth: 'Por mês',
    oneTime: 'Uma vez',
    horizon: 'Horizonte',
    targetNote: (budget: string) =>
      `para um objetivo de ${budget}. Projeção, não dinheiro já poupado.`,
    progress: (percent: string, horizon: string) => `${percent} em ${horizon}`,
    remaining: (amount: string) => `faltam ${amount}`,
    save: 'Guardar este plano',
    saved: 'Plano guardado',
    disclaimer:
      'Guardado apenas neste dispositivo. A viagem não é gratuita: o €0* é a metáfora de um custo coberto pelas trocas escolhidas.',
    saveNote: 'Projeção, não dinheiro já poupado.',
    monthsSuffix: (n: number): string => (n === 1 ? 'mês' : 'meses'),
  },
  presets: {
    essential: {
      label: 'Essencial',
      description: 'Duas trocas, sem mexer no resto.',
    },
    balanced: {
      label: 'Equilibrado',
      description: 'O plano sugerido para este destino.',
    },
    conscious: {
      label: 'Consciente',
      description: 'Mais trocas, incluindo reparar e beber melhor.',
    },
  },
  preset: {
    outOfReach: 'fora de alcance',
  },
  projection: {
    aria: (target: string, horizon: string) =>
      `Projeção de poupança ao longo de ${horizon} face a um objetivo de ${target}.`,
    note:
      'A linha soma a poupança recorrente mês a mês e as poupanças pontuais no início. Não é uma conta bancária real.',
  },
  receipt: {
    title: 'Como calculámos',
    subtitle: 'Cada linha é reproduzível a partir das premissas visíveis.',
    emptyTitle: 'Ainda não há trocas escolhidas.',
    emptyBody:
      'Escolhe uma troca acima — ou aplica um plano sugerido — para veres a conta completa, linha a linha.',
    headers: {
      swap: 'Troca',
      calculation: 'Cálculo',
      value: 'Valor',
    },
    recurringTotal: 'Poupança recorrente por mês',
    oneTimeTotal: 'Poupança pontual (uma só vez)',
    objective: 'Objetivo',
    inHorizon: (horizon: string) => `Em ${horizon}`,
    estimatedHorizon: 'Prazo estimado',
    notes: [
      'Poupança projetada = poupança mensal × meses + poupanças pontuais. As poupanças pontuais entram uma única vez e nunca são tratadas como rendimento mensal.',
      'Trocas que assumem as mesmas despesas pertencem ao mesmo grupo e só uma pode estar ativa. É por isso que escolher uma substitui a outra, em vez de somar.',
      'Valores ilustrativos, definidos para este projeto. Não são médias de mercado, nem poupança garantida, nem uma oferta de viagem.',
    ],
  },
  unlocks: {
    eyebrow: '03 — Chegar',
    title: 'Os meus planos',
    intro:
      'Planos guardados apenas neste dispositivo. São simulações de poupança, não reservas nem dinheiro já poupado.',
    clear: 'Limpar tudo',
    confirm:
      'Remover todos os planos guardados neste dispositivo? Esta ação não pode ser anulada.',
    emptyEyebrow: 'Ainda nada',
    emptyTitle: 'Ainda não guardaste nenhum futuro.',
    emptyBody:
      'Abre um destino, escolhe as trocas que farias e guarda o plano. Fica aqui, à espera de ser revisto.',
    emptyCta: 'Explorar destinos',
    savedOn: (date: string) => `guardado a ${date}`,
    estimatedHorizon: 'Prazo estimado',
    target: 'Objetivo',
    perMonth: 'Por mês',
    swaps: 'Trocas',
    openPlan: 'Abrir plano',
    remove: 'Remover',
  },
  about: {
    eyebrow: 'Sobre o TripSwap',
    titleA: 'Não é uma app de finanças.',
    titleB: 'É uma forma de ver o que',
    titleAccent: 'as pequenas decisões pagam.',
    intro:
      'O TripSwap parece uma plataforma de descoberta de viagens — e é. Por baixo, faz outra coisa: mostra que mudar hábitos comuns pode financiar experiências que pareciam distantes. Sem orçamentos, sem folhas de cálculo e sem culpa.',
    pillarsEyebrow: 'Os três pilares',
    pillarsTitle: 'O que está por baixo do catálogo',
    pillars: [
      {
        title: 'Gastar melhor',
        body: 'Menos transporte desnecessário, subscrições esquecidas e compras por impulso. O dinheiro fica para o que realmente queres.',
      },
      {
        title: 'Viver melhor',
        body: 'Mais caminhada, mais cozinha em casa, menos tabaco e menos bebidas açucaradas. Mudanças voluntárias, sem promessas médicas.',
      },
      {
        title: 'Consumir melhor',
        body: 'Reparar antes de substituir, reutilizar o que já existe e reduzir desperdício. Menos coisas, mais vida.',
      },
    ],
    pillarsNote:
      'Os benefícios além do dinheiro aparecem como etiquetas qualitativas. Não são alegações médicas, nem métricas de saúde, nem evidência científica.',
    transparencyEyebrow: 'Transparência',
    transparencyTitle: 'Como o número aparece',
    transparencyBody:
      'O motor é determinístico e vive no browser. Cada troca tem um custo original, uma alternativa e uma frequência. O resultado é sempre reproduzível a partir das premissas visíveis.',
    formulas: {
      recurringLabel: 'Poupança recorrente',
      recurringValue: '(custo original − alternativa) × frequência mensal',
      oneTimeLabel: 'Poupança pontual',
      oneTimeValue: 'custo evitado − custo da alternativa · uma única vez',
      projectionLabel: 'Projeção',
      projectionValue: 'poupança mensal × meses + poupanças pontuais',
    },
    overlapEyebrow: 'Sem duplicar',
    overlapBody1:
      'Duas trocas que assumem a mesma despesa nunca são somadas. Cada grupo de sobreposição — refeições, snacks, noites, subscrições, reparações, deslocações — só aceita uma escolha de cada vez.',
    overlapBody2:
      'Quando escolhes outra opção do mesmo grupo, a anterior é substituída, e a interface explica porquê.',
    groups: ['Refeições', 'Snacks', 'Noites', 'Subscrições', 'Reparações', 'Deslocações'],
    stats: (habits: number, destinations: number, min: string, max: string) =>
      `${habits} trocas no catálogo, ${destinations} destinos, ${min} a ${max} de objetivo ilustrativo.`,
    zeroEyebrow: 'uma metáfora, não um preço',
    zeroTitle: 'A viagem não é gratuita.',
    zeroBody1:
      'O €0* descreve um cenário: o custo do destino seria coberto pelo dinheiro que deixarias de gastar nas trocas selecionadas. O orçamento real continua visível em cada cartão e em cada detalhe.',
    zeroBody2: 'Não há desconto, nem preço anterior, nem oferta. Não há reserva. Há um plano.',
    limitsEyebrow: 'Limites explícitos',
    limitsTitle: 'O que este projeto não faz',
    limits: [
      'Não reserva viagens nem consulta tarifas em tempo real.',
      'Não pede salário, extratos bancários ou dados pessoais.',
      'Não guarda nada num servidor: os planos ficam no teu navegador.',
      'Não usa IA generativa para fazer aritmética.',
      'Não faz promessas de saúde, perda de peso ou emissões evitadas.',
      'Não apresenta valores ilustrativos como preços verificados.',
    ],
    assumptionsNote:
      'Os orçamentos assumem uma cidade de partida (Lisboa), dois viajantes e o âmbito indicado em cada destino. São valores fictícios de planeamento, não médias de mercado. A moeda é o euro e os cálculos usam aritmética simples, validada por testes.',
    creditsEyebrow: 'Fotografia',
    creditsTitle: 'Créditos das imagens',
    creditsNote:
      'Fotografias locais, servidas a partir do próprio site, para que a demonstração funcione sem rede externa. As licenças completas estão em docs/CREDITS.md.',
    closingEyebrow: 'Small changes. Bigger journeys.',
    closingLine:
      'Chega de poupar para nada. Escolhe uma viagem e vê o que já podes mudar.',
    closingCta: 'Ver o catálogo',
    languageNote:
      'A interface e a documentação estão disponíveis em português e inglês.',
  },
  notFound: {
    eyebrow: 'Erro 404',
    title: 'Página não encontrada.',
    body: 'O endereço pode estar incompleto. O catálogo continua à espera.',
    cta: 'Voltar ao catálogo',
  },
  games: {
    current: 'Gasto mensal atual',
    reduced: 'Gasto mensal que queres manter',
    save: 'Guardar valores',
    estimated: 'Poupança mensal estimada',
    hint: 'Indica os dois valores para ver a poupança.',
    invalid: 'O valor reduzido deve ser inferior ao atual.',
    setFirst: 'Define os teus valores mensais',
    example: 'Usar um exemplo conservador',
    exampleNote: 'Exemplo ilustrativo: 20 € atuais, 15 € reduzidos. Ajusta ao teu gasto.',
  },
  reminder: {
    add: 'Adicionar lembrete',
    edit: 'Editar lembrete',
    frequency: 'Periodicidade',
    daily: 'Diário',
    monthly: 'Mensal',
    time: 'Hora',
    day: 'Dia do mês',
    addToCalendar: 'Adicionar ao calendário',
    updateCalendar: 'Atualizar calendário',
    cancel: 'Cancelar',
    remove: 'Remover lembrete',
    note: 'Cria um evento de 15 minutos com lembrete à hora escolhida. Abre o ficheiro descarregado para o adicionar ao calendário.',
    saved: 'Lembrete guardado. Abre o ficheiro descarregado para o adicionar ao calendário.',
    removed: 'Lembrete removido.',
    summaryDaily: (time: string) => `Diário às ${time}`,
    summaryMonthly: (day: number, time: string) => `Mensal, dia ${day} às ${time}`,
    eventTitle: (destination: string) => `TripSwap — rever ${destination}`,
    eventDescription: (swaps: number, monthly: string, horizon: string, target: string) =>
      `${swaps} trocas · ${monthly}/mês · ${horizon} · objetivo ${target}. Simulação, não uma reserva.`,
  },
  swaps: {
    eyebrow: 'As trocas',
    headline: {
      line1: 'Menos do que não precisas.',
      line2: 'Mais do que queres viver.',
    },
    intro:
      'Escolhe as mudanças que te parecem valer a pena. Junta-as a um plano e vê onde te podem levar.',
    swapCount: 'trocas',
    categoryCount: 'categorias',
    selected: 'selecionadas',
    monthly: 'Por mês',
    oneTime: 'Uma vez',
    add: 'Adicionar ao meu plano',
    added: 'Adicionada',
    assumptions: 'Premissas e cálculo',
    alone: (name: string, months: string) =>
      `Sozinha, esta troca poderia cobrir ${name} em cerca de ${months}.`,
    start: (name: string) => `Um começo pontual para ${name}.`,
    leads: 'Adiciona a um plano para veres onde leva.',
    cta: 'Vê onde estas trocas te podem levar',
    ctaShort: 'Ver destinos',
    destinationsTitle: 'Escolhe um lugar.',
    destinationsIntro: 'Levamos as trocas escolhidas para o plano.',
    choose: 'Escolher este lugar',
    futureEyebrow: 'Roadmap',
    futureTitle: 'Constrói o teu plano de liberdade.',
    futureIntro:
      'Duas ferramentas estão em desenvolvimento para tornares o plano verdadeiramente teu.',
    createSwapTitle: 'Criar a minha troca',
    createSwapBody: 'Define um hábito, uma alternativa e a poupança que esperas.',
    dreamTripTitle: 'Adicionar a minha viagem de sonho',
    dreamTripBody: 'Dá ao teu plano um destino e um orçamento pessoais.',
    comingSoon: 'Em desenvolvimento',
    futureNote: 'Estas ferramentas estão em desenvolvimento. Ainda não estão ativas.',
  },
  a11y: {
    progress: 'Progresso para o objetivo',
    progressHorizon: (horizon: string) => `Progresso para o objetivo em ${horizon}`,
    progressPlan: (name: string) => `Progresso de ${name}`,
  },
}

export type Copy = typeof pt
