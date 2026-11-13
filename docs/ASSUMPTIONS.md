# Pressupostos de cálculo

> Documento gerado a partir de `src/data/habits.ts` e `src/data/destinations.ts` com
> `node scripts/assumptions.mjs > docs/ASSUMPTIONS.md`. Não editar à mão.

Todos os valores são **ilustrativos e fictícios**, definidos para este projeto. Não são médias de mercado, não são preços verificados e não representam uma oferta de viagem.

## Fórmulas

- **Recorrente:** `(custo original − alternativa) × frequência mensal`
- **Pontual:** `custo original − alternativa`, aplicado uma única vez
- **Projeção:** `poupança mensal × meses + poupanças pontuais`
- **Prazo:** o primeiro mês inteiro em que a projeção atinge o objetivo

## Trocas

| ID | Categoria | Tipo | Original | Alternativa | Freq. | Poupança | Grupo |
|---|---|---|---:|---:|---:|---:|---|
| `uber-public-transport` | Mobilidade | mensal | 10 € | 2,5 € | 4/mês | 30 € | short-trips |
| `walk-short-distances` | Mobilidade | mensal | 7 € | 0 € | 6/mês | 42 € | short-trips |
| `coffee-at-home` | Comida e bebida | mensal | 2 € | 0,4 € | 20/mês | 32 € | — |
| `replace-bought-snacks` | Comida e bebida | mensal | 3,5 € | 0,8 € | 12/mês | 32,4 € | snacks |
| `reduce-takeaway` | Comida e bebida | mensal | 18 € | 8 € | 4/mês | 40 € | evening-meals |
| `lunch-from-home` | Comida e bebida | mensal | 9 € | 4 € | 12/mês | 60 € | — |
| `reduce-alcohol` | Comida e bebida | mensal | 5 € | 0 € | 8/mês | 40 € | nightlife |
| `water-instead-of-soft-drinks` | Comida e bebida | mensal | 2,5 € | 1 € | 16/mês | 24 € | — |
| `cook-instead-of-ready-meals` | Comida e bebida | mensal | 9 € | 4 € | 8/mês | 40 € | evening-meals |
| `simpler-snacks` | Comida e bebida | mensal | 2,2 € | 1 € | 12/mês | 14,4 € | snacks |
| `half-nights-out` | Lazer e subscrições | mensal | 30 € | 5 € | 2/mês | 50 € | nightlife |
| `cancel-streaming` | Lazer e subscrições | mensal | 12 € | 0 € | 1/mês | 12 € | subscriptions |
| `smaller-tv-package` | Lazer e subscrições | mensal | 15 € | 0 € | 1/mês | 15 € | — |
| `cancel-forgotten-subscriptions` | Lazer e subscrições | mensal | 8 € | 0 € | 2/mês | 16 € | subscriptions |
| `repair-shoes` | Compras e reparações | pontual | 90 € | 25 € | — | 65 € | repairs |
| `reduce-impulse-clothing` | Compras e reparações | mensal | 35 € | 0 € | 1/mês | 35 € | — |
| `repair-equipment` | Compras e reparações | pontual | 160 € | 40 € | — | 120 € | repairs |
| `reduce-food-waste` | Compras e reparações | mensal | 15 € | 0 € | 1/mês | 15 € | — |
| `cheaper-mobile-plan` | Lazer e subscrições | mensal | 10 € | 0 € | 1/mês | 10 € | — |
| `repair-clothing` | Compras e reparações | pontual | 55 € | 15 € | — | 40 € | — |
| `second-hand-instead-of-new` | Compras e reparações | mensal | 30 € | 10 € | 1/mês | 20 € | — |
| `sell-unused-items` | Compras e reparações | pontual | 80 € | 0 € | — | 80 € | — |
| `stop-tobacco` | Bem-estar | mensal | 6 € | 0 € | 20/mês | 120 € | — |
| `games-betting` | undefined | mensal | 0 € | 0 € | 1/mês | 0 € | — |
| `exercise-at-home` | Bem-estar | mensal | 30 € | 0 € | 1/mês | 30 € | — |

> **Jogos de azar e apostas:** `games-betting` não tem valor fixo. A poupança é
> `gasto mensal atual − gasto mensal reduzido`, introduzida pelo utilizador; sem
> valores não existe poupança numérica. Não é usada qualquer média universal.

## Destinos

| ID | Destino | Partida | Viajantes | Noites | Objetivo | Inclui |
|---|---|---|---:|---:|---:|---|
| `douro-escape` | Douro Escape (Portugal) | Lisboa | 2 | 2 | 420 € | Transporte, Alojamento, Pequeno-almoço |
| `lisbon-weekend` | Lisbon Weekend (Portugal) | Lisboa | 2 | 2 | 480 € | Alojamento, Refeições, Transporte local |
| `paris-city-break` | Paris City Break (França) | Lisboa | 2 | 3 | 650 € | Transporte, Alojamento, Pequeno-almoço |
| `barcelona-weekend` | Barcelona Weekend (Espanha) | Lisboa | 2 | 2 | 560 € | Transporte, Alojamento, Transporte local |
| `rome-discovery` | Rome Discovery (Itália) | Lisboa | 2 | 4 | 700 € | Transporte, Alojamento, Refeições básicas |
| `alps-winter-escape` | French Alps Winter Escape (França) | Lisboa | 2 | 4 | 1200 € | Transporte, Alojamento, Forfait de esqui |
| `northern-lights` | Northern Lights Adventure (Islândia) | Lisboa | 2 | 6 | 1900 € | Transporte, Alojamento, Aluguer de carro |
| `india-discovery` | India Discovery (Índia) | Lisboa | 2 | 12 | 2400 € | Voos, Alojamento, Transporte interno |

## Grupos de sobreposição

Duas trocas do mesmo grupo assumem a mesma despesa. Só uma pode estar ativa; escolher outra substitui a anterior.

- **short-trips**: Trocar metade dos Uber/TVDE por transporte público · Caminhar em vez de pagar deslocações curtas
- **snacks**: Trocar snacks comprados por alternativas mais baratas · Escolher snacks processados mais simples
- **evening-meals**: Reduzir refeições de takeaway · Cozinhar em vez de comprar refeições prontas
- **nightlife**: Reduzir bebidas alcoólicas para metade · Reduzir metade das noites fora
- **subscriptions**: Emprestar livros e cancelar um serviço de streaming · Cancelar subscrições esquecidas
- **repairs**: Reparar sapatos em vez de comprar novos · Reparar equipamento antes de substituir

Total: 25 trocas, 8 destinos.
