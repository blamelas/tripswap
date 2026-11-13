# Q&A — cartões de treino

Respostas curtas, para ensaiar em voz alta. Cada linha tem o artefacto que a prova.

## Pitch de 30 segundos

> Quem quer viajar já sabe para onde quer ir. O que falta é uma ponte entre o desejo e
> o dinheiro. O TripSwap mostra o custo real de planeamento, propõe trocas pequenas e
> calcula em quanto tempo a viagem fica ao alcance. Começa no desejo, não no orçamento.

## 17 perguntas

| # | Pergunta | Resposta curta | Artefacto |
|---|---|---|---|
| 1 | O que é o produto? | Um catálogo de viagens cujo resultado é um plano de poupança determinístico. | `/`, `src/lib/calc.ts` |
| 2 | Para quem? | Viajante em Lisboa, 25–40, com um destino em mente e sem paciência para folhas de cálculo. | `docs/MVP.md` |
| 3 | Isto não é só CRUD? | O CRUD é o meio; o valor é o número calculado e o prazo que muda em tempo real. | `docs/TESTING.md` |
| 4 | Os preços são reais? | Não. São objetivos ilustrativos com partida, viajantes, noites e âmbito declarados. | `docs/ASSUMPTIONS.md` |
| 5 | E o €0*? | É uma metáfora: custo coberto por poupança. Nunca um desconto, preço anterior ou oferta. | `Discover`, detalhe, `About` |
| 6 | Como evitas dupla contagem? | Seis grupos exclusivos; escolher uma troca substitui a anterior; o motor deduplica. | `conflicts.ts`, testes |
| 7 | Como tratas poupanças pontuais? | Entram uma vez, no início da projeção. Nunca como rendimento mensal. | `calc.test.ts` |
| 8 | Porque não pedes o salário? | O valor não depende de dados pessoais. Reduz fricção, risco e superfície de privacidade. | `types.ts` |
| 9 | O que a AI fez mal? | O motor somava trocas sobrepostas. Um teste falhou com 2 linhas onde esperava 1. Corrigi o motor. | `docs/PROMPTS.md` |
| 10 | Como reproduzo? | `docker compose up` ou `npm ci && npm run dev`. Node 20. | `README.md` |
| 11 | Como sabes que funciona? | 35 testes na lógica, checklist manual de 17 casos, CI em cada PR. | `docs/TESTING.md` |
| 12 | Onde está deployed? | Vercel, deploy automático a cada push para `main`. | `vercel.json`, `docs/PUBLISH.md` |
| 13 | Como escalarias? | Pré-renderização, contas e sync, recomendação calculada, testes e2e. | `docs/DECISIONS.md` |
| 14 | Qual foi a decisão mais difícil? | Excluir trocas sobrepostas em vez de penalizar. Perdi combinações, ganhei um número defensável. | `docs/DECISIONS.md` |
| 15 | O que ficou de fora? | Auth, booking, preços live, backend, mapas. Sem isso o valor central mantém-se. | `docs/MVP.md` |
| 16 | A app é bilingue? | Sim: inglês por omissão, português a um clique. Números iguais; copy e dados traduzidos. | `src/i18n`, `tests/i18n.test.ts` |
| 17 | Qual é a ideia visual? | “The world is the reward”: fotografia full-bleed, Barlow Condensed, ink/canvas/signal. A foto é a superfície de progresso. | `README.md`, `src/index.css`, `RewardPanel` |

## Frases a evitar

- “É grátis.” → “O custo é coberto pelas trocas.”
- “Vais poupar X.” → “A projeção é X, se as trocas se mantiverem.”
- “É saudável.” → “Reduz bebidas açucaradas” (facto, não promessa).
- “A IA calculou.” → “O motor calcula; a IA escreveu o código.”
- “Preço.” → “Objetivo ilustrativo de planeamento.”

## Se não souberes

> “Não validei isso. A minha hipótese é X. O próximo teste seria Y.”

## Números para saber de cor

| Cenário | Resultado |
|---|---|
| Paris, Essencial (Uber + almoço) | 90 €/mês · 8 meses |
| Paris, Equilibrado (Uber + almoço + café) | 122 €/mês · 6 meses |
| Paris, Consciente (+ água + sapatos) | 146 €/mês + 65 € pontuais · 5 meses |
| Café em casa | 32 €/mês |
| Almoço de casa | 60 €/mês |
| Reparar sapatos | 65 € uma vez |
| Deixar de comprar tabaco | 120 €/mês |
