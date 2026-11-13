# Iterações

Cada linha é um ciclo do módulo 05: requisito → prompt → plano → execução → teste →
commit. Os tempos são reais e incluem revisão manual.

| # | Data | Ciclo | Prompt (resumo) | Resultado | Commit | Tempo |
|---|---|---|---|---|---|---|
| 1 | 13 Nov 03:15 | Fundação | Scaffold Vite/React/TS + Tailwind, fonte local, sem backend | App vazio a compilar | `chore: scaffold vite react typescript` | 20 min |
| 2 | 13 Nov 03:17 | Fotografia | Obter 8 imagens licenciadas, converter para WebP 1600 px | `public/images/*.webp` + créditos | `chore(assets): add licensed destination photography` | 15 min |
| 3 | 13 Nov 03:19 | Dados | 8 destinos + 24 trocas com fórmulas, grupos e benefícios | `src/data/*.ts` tipados | `feat(data): add destination catalogue and 24 everyday swaps` | 25 min |
| 4 | 13 Nov 03:20 | Motor | `calc.ts`, `conflicts.ts`, `format.ts` | Poupança, prazo, deduplicação | `feat(calc): add deterministic savings engine` | 30 min |
| 5 | 13 Nov 03:23 | Testes | 26 testes: fórmulas, fronteiras, conflitos, formatação | `npm test` verde | `test(calc): cover formulas overlaps and edge cases` | 20 min |
| 6 | 13 Nov 03:24 | Descobrir | Hero editorial, catálogo assimétrico, nota do €0* | `/` completa | `feat(ui): add editorial destination catalogue` | 35 min |
| 7 | 13 Nov 03:25 | Detalhe | Presets, seletor de trocas, painel, recibo, gráfico | `/destination/:id` completa | `feat(detail): add swap selector and funding projection` | 40 min |
| 8 | 13 Nov 03:26 | Unlocks | Persistência local, empty state, deep link | `/unlocks` completa | `feat(unlocks): persist plans locally with deep links` | 25 min |
| 9 | 13 Nov 03:27 | Método | Página Sobre, limites, créditos, acessibilidade | `/about` completa | `feat(about): document method limits and credits` | 25 min |
| 10 | 13 Nov 03:28 | Correção | Teste de sobreposição falhou; deduplicar no motor | 26/26 verdes | `fix(calc): deduplicate overlapping swaps in the engine` | 10 min |
| 11 | 13 Nov 03:29 | Mobile | Nav partida a 390 px; barra fixa; labels `/mês` | Sem scroll horizontal | `fix(ui): make navigation and funding bar work on mobile` | 15 min |
| 12 | 13 Nov 03:31 | Ambiente | DevContainer, Docker multi-stage, compose, CI | `docker compose up` documentado | `chore(env): add devcontainer docker and ci` | 20 min |
| 13 | 13 Nov 03:33 | Evidência | README, MVP, pressupostos, decisões, testes, prompts, defesa | Repo defensável | `docs: add mvp decisions testing and defense pack` | 35 min |
| 14 | 13 Nov 03:35 | Release | Lint, typecheck, test, build, tag | `v1.0.0` | `chore(release): v1.0.0` | 10 min |
| 15 | 13 Nov 03:36 | Precisão | Recibo com dois decimais; sufixo `/mês` acessível | 27/27 verdes | `fix(receipt): show cents and fix value suffix spacing` | 10 min |
| 16 | 13 Nov 03:37 | Patch | Bump 1.0.1, changelog, tag | `v1.0.1` | `chore(release): v1.0.1` | 5 min |
| 17 | 13 Nov 03:38 | Deploy | GitHub Pages, subpath, SPA fallback | URL público | `feat(deploy): support subpath hosting and github pages` | 20 min |
| 18 | 13 Nov 03:40 | Release | URL no README, bump 1.0.2, tag | `v1.0.2` | `chore(release): v1.0.2` | 5 min |
| 19 | 13 Nov 03:41 | Imagens | Testes de integridade dos assets locais | 29/29 verdes | `test(assets): verify destination images are local and present` | 10 min |
| 20 | 13 Nov 03:42 | Evidência | QA flashcards + PR template + release | `v1.0.3` | `chore(release): v1.0.3` | 15 min |
| 21 | 13 Nov 04:35 | Deploy | Remover GitHub Pages; Vercel como único alvo | `v1.0.6` | `chore(deploy): remove github pages` | 15 min |
| 22 | 13 Nov 04:50 | Domínio | `tripswap-home.vercel.app` como URL público | `v1.0.7` | `chore(deploy): set public domain` | 10 min |
| 23 | 13 Nov 04:10 | i18n base | Dicionários PT/EN tipados, contexto, formatação por locale | `useI18n` funcional | `feat(i18n): add typed dictionaries and locale provider` | 30 min |
| 24 | 13 Nov 04:18 | i18n conteúdo | 24 trocas, 8 destinos, benefícios e todas as vistas traduzidas | Toggle completo | `feat(i18n): translate catalogue and calculation flow` | 40 min |
| 25 | 13 Nov 04:22 | i18n testes | Paridade de chaves, conteúdo EN, formatação localizada | 35/35 verdes | `test(i18n): cover parity and localised formatting` | 15 min |
| 26 | 13 Nov 04:25 | Release | Changelog, versão e deploy | `v1.1.0` | `chore(release): v1.1.0` | 10 min |
| 27 | 13 Nov 04:30 | Design system | Barlow Condensed, IBM Plex, canvas/ink/signal, remover Fraunces | Tokens novos | `feat(design): establish the new art direction` | 30 min |
| 28 | 13 Nov 04:36 | Homepage | Hero assimétrico, catálogo flagship, €0* sky band | Nova homepage | `feat(home): rebuild hero and editorial catalogue` | 45 min |
| 29 | 13 Nov 04:44 | Detalhe | Reward window com maré/rail, price block, hábitos em linhas | Nova interação | `feat(detail): add the reward window interaction` | 45 min |
| 30 | 13 Nov 04:50 | QA | Imagens novas, contraste, mobile, screenshots e docs | 35/35 verdes | `docs: update art direction evidence` | 30 min |
| 31 | 13 Nov 04:55 | Release | Changelog, versão e deploy | `v1.2.0` | `chore(release): v1.2.0` | 10 min |
| 32 | 13 Nov 05:00 | Feedback | Estado de sucesso, ícones, favicon, €0* CTA nos cartões | Interação clara | `feat(ui): make the reward and the €0* explicit` | 40 min |
| 33 | 13 Nov 05:05 | QA | Contraste, mobile, screenshots, docs | 35/35 verdes | `docs: update success state evidence` | 20 min |
| 34 | 13 Nov 05:10 | Release | Changelog, versão e deploy | `v1.3.0` | `chore(release): v1.3.0` | 10 min |
| 35 | 13 Nov 05:20 | Estabilidade | Cartão de recompensa com altura fixa; sucesso como transformação | 753/462 px constantes | `fix(reward): keep the card height stable on unlock` | 30 min |
| 36 | 13 Nov 05:28 | Hierarquia | Categorias discretas; atividades com detalhes progressivos | Lista mais calma | `feat(habits): quiet categories and progressive details` | 30 min |
| 37 | 13 Nov 05:32 | Release | QA, screenshots, changelog e tag | `v1.3.1` | `chore(release): v1.3.1` | 10 min |
| 38 | 13 Nov 05:38 | Clareza | Planos sugeridos em faixa sky; ícones na meta e categorias | Zona clara | `feat(detail): separate suggested plans from trip data` | 25 min |
| 39 | 13 Nov 05:42 | Release | Changelog, versão e deploy | `v1.3.3` | `chore(release): v1.3.3` | 10 min |
| 40 | 13 Nov 05:55 | Categorias | Capítulos 21/44px, cinco cores, resumo live e colapso | Navegação clara | `feat(habits): editorial category chapters` | 35 min |
| 41 | 13 Nov 06:00 | Release | QA, screenshots, changelog e deploy | `v1.3.4` | `chore(release): v1.3.4` | 10 min |
| 42 | 13 Nov 08:50 | Lembretes | Form diário/mensal, hora, dia, `.ics` e storage | Evento + alarme | `feat(plans): add calendar reminders` | 45 min |
| 43 | 13 Nov 09:00 | QA | Testes de ICS, fluxo de edição/remoção e docs | 42/42 verdes | `test(reminders): cover ics generation` | 20 min |
| 44 | 13 Nov 09:05 | Release | Changelog, versão e deploy | `v1.4.0` | `chore(release): v1.4.0` | 10 min |
| 45 | 13 Nov 09:30 | Catálogo | Página `/swaps`, cartões editoriais, resumo e seleção | 25/6 | `feat(swaps): add the swaps catalogue` | 60 min |
| 46 | 13 Nov 09:45 | Jogos | Valores atuais/reduzidos, cálculo efetivo e transporte para o plano | Sem média inventada | `feat(games): user-defined games estimate` | 40 min |
| 47 | 13 Nov 09:55 | Release | Testes, docs, screenshots e deploy | `v1.5.0` | `chore(release): v1.5.0` | 20 min |
| 48 | 13 Nov 10:05 | Refinamento | Ícones por atividade, jogos de azar, exemplo conservador e premissas ocultas | `v1.5.1` | `feat(swaps): refine activity cards and games copy` | 25 min |
| 49 | 13 Nov 11:05 | Simplificação | Jogos com estimativa fixa; inputs removidos; sorriso ao selecionar | `v1.5.2` | `feat(swaps): simplify games estimate and add selection feedback` | 25 min |
| 50 | 13 Nov 11:30 | Refinamento | Jogos a 20 €/mês; faixa Wikimedia mascarada; check monocromático; categorias em acordeão | `v1.5.3` | `feat(swaps): raise games estimate and add masked image edge` | 30 min |
| 51 | 13 Nov 11:50 | Refinamento | Faixa Wikimedia full-width no topo, sem blur/fade | `v1.5.4` | `feat(swaps): use full-width photo strips` | 15 min |
| 52 | 13 Nov 12:00 | Refinamento | Barra sólida com a cor da categoria; imagens removidas | `v1.5.5` | `feat(swaps): replace photo strips with category colours` | 10 min |

## O que aprendi

- O teste de sobreposição apanhou um erro que a interface escondia. Sem ele, o número
  estaria errado em qualquer deep link antigo.
- O maior ganho de tempo não foi escrever componentes, foi ter os dados e as fórmulas
  fechados antes de desenhar.
- O maior risco não foi código: foi a fotografia. Resolver as imagens cedo evitou um
  catálogo feio à última hora.

## Dívida assumida

- Sem testes end-to-end de browser; o checklist manual cobre a demo.
- Sem pré-renderização: links partilhados não têm preview rico.
- Presets fixos por destino, em vez de recomendação calculada.
