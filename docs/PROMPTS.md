# Prompts reais

O desenvolvimento usou um agente de código (DeepSeek). Abaixo estão os prompts que
dirigiram o trabalho, o ciclo usado e uma falha real do agente.

## Prompt-mestre (5 blocos)

**Contexto**
> Projeto final do curso "Building Digital Products with Generative AI". Repositório
> vazio em `tripswap/`. Stack obrigatória: React + TypeScript + Vite + Tailwind,
> Lucide, dados locais, localStorage, sem backend, sem auth, sem APIs pagas. Existe
> um projeto irmão (`keeply-home`) cuja fundação — devcontainer, Docker, agentes,
> skills, docs — pode servir de referência, mas não deve ser copiada para dentro do
> novo produto.

**Objetivo**
> Construir o MVP do TripSwap: catálogo de 8 destinos, detalhe com 24 trocas,
> motor de poupança determinístico, projeção, planos guardados localmente, página
> de método. Tudo em pt-PT.

**Restrições**
> Não inventar preços; orçamentos são objetivos ilustrativos. Não usar IA para
> aritmética. Não fazer promessas de saúde. Não permitir dupla contagem de trocas
> sobrepostas. Não tratar poupanças pontuais como mensais. Sem emoji, sem gradientes
> azul-purple, sem glassmorphism, sem gamificação infantil.

**Critério de sucesso**
> Um utilizador entende o custo real e vê um prazo calculado em menos de 60 segundos.
> `lint`, `typecheck`, `test` e `build` verdes. Números reproduzíveis a partir de
> premissas visíveis. Zero erros na consola.

**Formato**
> Plano antes de código, uma story por ciclo, commits convencionais, docs no mesmo
> commit. No fim, handover com o que está feito, em risco e os próximos três passos.

## Ciclo 1 — motor de cálculo

**Prompt**
> "Cria `src/lib/calc.ts` com: `monthlySaving`, `oneTimeSaving`, `projectedSavings`,
> `monthsToTarget` e `calculatePlan`. Regras: recorrente =
> `(original − alternativa) × frequência`; pontual = diferença, contada uma vez;
> prazo = primeiro mês inteiro; devolve `null` acima de 240 meses. Não formata nada;
> não toca em componentes. Depois cria `tests/calc.test.ts` com os valores
> documentados e os casos-limite: zero seleções, só pontuais, alvo inalcançável,
> fronteira do horizonte. Corre os testes."

**Resultado:** motor e 21 testes. O único falhanço está documentado abaixo.

## Ciclo 2 — sobreposições

**Prompt**
> "Adiciona `exclusiveGroup` às trocas que assumem a mesma despesa e implementa
> `toggleHabit`/`sanitizeSelection` em `src/lib/conflicts.ts`. Escolher uma troca
> deve substituir a do mesmo grupo, não somar. O motor deve deduplicar mesmo que
> receba uma lista não sanitizada. Adiciona testes para substituição, toggle duplo e
> deep links com ids desconhecidos."

**Resultado:** grupos `short-trips`, `snacks`, `evening-meals`, `nightlife`,
`subscriptions`, `repairs`; testes de conflito e de recomendações.

## Ciclo 3 — interface editorial

**Prompt**
> "Desenha o catálogo com Tailwind: fundo creme, tinta quase preta, um acento
> terracota. Tipografia editorial (Fraunces) para títulos e Inter Tight para UI,
> numerais tabulares. Cartões com fotografia, €0* grande, orçamento visível. Sem
> gradientes decorativos, sem glassmorphism. Mobile-first."

**Resultado:** `Discover`, `DestinationCard`, `Layout`, tokens em `tailwind.config.ts`.

## Ciclo 4 — interface bilingue

**Prompt**
> "Adiciona um toggle PT/EN persistente. Cria dicionários tipados em `src/i18n` com a
> mesma forma nos dois idiomas, traduz as 24 trocas e os 8 destinos, e mantém o motor
> de cálculo independente do idioma. Formata EUR e meses por locale (`pt-PT` vs
> `en-IE`). Adiciona um teste de paridade de chaves e de conteúdo, e outro para os
> formatos. Não alteres nenhum número."

**Resultado:** `pt.ts`, `en.ts`, `content.ts`, `I18nProvider`, `useI18n`, `format.ts`
com locale, toggle no header, 35 testes. Paris continua **122 €/6 meses** em PT e
**€122/6 months** em EN.

## A falha do AI (real, detetada por teste)

**O que o agente fez mal.** Na primeira versão, `calculatePlan` somava todas as trocas
recebidas, mesmo quando duas partilhavam o mesmo `exclusiveGroup`. A interface
substituía corretamente, mas o motor aceitava uma lista não sanitizada. O agente
escreveu um teste que esperava uma única linha para duas trocas de snacks — e o teste
falhou com 2 linhas.

**Como foi detetado.** `npm test` falhou em `rounds monetary arithmetic to cents`
(`expected length 1, received 2`). O número só podia estar errado se a lista chegasse
suja: deep link, `localStorage` antigo ou um futuro chamador.

**Como foi corrigido.** O motor passou a deduplicar por `exclusiveGroup` antes de somar.
A asserção não foi alterada. Commit: `fix(calc): deduplicate overlapping swaps in the engine`.

**Porque isto importa.** É a prova de que o número não é "gerado por IA": é validado
por um teste que pode falhar. A correção está no motor, não na UI.

## A segunda falha do AI (i18n, detetada por `tsc`)

**O que o agente fez mal.** Tipou a função `monthsSuffix` do dicionário PT como
`(n: number) => (n === 1 ? 'mês' : 'meses')`. O TypeScript inferiu o tipo de retorno
como a união literal `"mês" | "meses"`, e a versão EN (`"month" | "months"`) deixou de
ser atribuível a `Copy`.

**Como foi detetado.** `npm run build` falhou:
`TS2322: Type '(n: number) => "month" | "months"' is not assignable to type
'(n: number) => "meses" | "mês"'`.

**Como foi corrigido.** Anotação explícita `: string` no retorno. A versão EN passou a
ser aceite e o teste de paridade valida o resto.

**Porque isto importa.** O dicionário é a interface entre idiomas; um tipo demasiado
estreito parte a app num deles. O build apanhou-o antes do deploy.

## O que o agente nunca fez

- Não calculou poupanças em runtime.
- Não escreveu preços de viagens.
- Não inventou benefícios de saúde.
- Não alterou os testes para os fazer passar.
