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
