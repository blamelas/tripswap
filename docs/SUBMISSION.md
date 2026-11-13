# TripSwap — submission pack

**Curso:** Building Digital Products with Generative AI · EUNICE Network, 2026
**Aluno:** Bruno Lamelas · **Projeto:** TripSwap
**One-liner:** small changes, bigger journeys — um plano de viagem financiado por trocas do dia a dia.
**URL:** https://tripswap-home.vercel.app · **Repo:** https://github.com/blamelas/tripswap
**Tag:** `v1.4.0` · **Deck:** [`TripSwap-Defense.pptx`](TripSwap-Defense.pptx)

---

## 1. Estado da submissão

| Item | Estado |
|---|---|
| URL pública | ✅ 200 |
| Repositório público | ✅ `blamelas/tripswap` |
| Descrição e homepage no GitHub | ✅ |
| 3+ PRs merged | ✅ 20 |
| CI em cada PR | ✅ `lint → typecheck → test → build` |
| 3+ branches | ✅ 29 branches remotas |
| 15+ commits convencionais | ✅ 109 |
| Tag `v1.0.0` | ✅ (e 17 tags até `v1.4.0`) |
| 3+ testes unitários | ✅ 42 |
| Deck 8–10 slides | ✅ 10 |
| Guião de demo | ✅ `docs/DEFENSE.md` |
| Q&A | ✅ `docs/QA.md` (22) |
| Vídeo de backup 3 min | ❌ gravar |
| 2 ensaios cronometrados | ❌ fazer |

> Este é o projeto **sem bloqueios formais**. Se o Keeply não ficar público e com PRs a
> tempo, apresenta o TripSwap. Ver `DECISAO-FINAL.md` na pasta de trabalho.

## 2. O que submeter

| Campo | Valor |
|---|---|
| Nome do projeto | TripSwap |
| One-liner | Small changes. Bigger journeys. |
| URL pública | https://tripswap-home.vercel.app |
| Repositório | https://github.com/blamelas/tripswap |
| Stack | React 19 · TypeScript · Vite 8 · Tailwind 3.4 · Vitest |
| Correr localmente | `npm ci && npm run dev` → http://localhost:5173 |
| Docker | `docker compose up` |
| Testes | 42 em 5 ficheiros |
| Deck | `docs/TripSwap-Defense.pptx` |
| Guião | `docs/DEFENSE.md` |
| Q&A | `docs/QA.md` |
| Vídeo (guião) | `docs/VIDEO.md` |

## 3. Requisitos do curso → evidência

| Requisito | Onde está | Estado |
|---|---|---|
| URL público em HTTPS | https://tripswap-home.vercel.app | ✅ 200 |
| 3+ user stories ponta a ponta | `docs/MVP.md` | ✅ 4 |
| Momento de valor <60 s | Escolher 3 trocas → 122 €/mês → 6 meses | ✅ |
| Insight calculado, não só CRUD | `src/lib/calc.ts` | ✅ |
| Empty / loading / error states | `/unlocks`, 404, image fallback | ✅ |
| Dados demo automáticos | `src/data/` | ✅ |
| README com one-liner, URL, stack, 1 comando | `README.md` / `README.pt.md` | ✅ |
| `CLAUDE.md` com stack, convenções, regras | `CLAUDE.md` | ✅ |
| `docs/MVP.md` com in/out e critérios | `docs/MVP.md` | ✅ |
| `docs/ITERATIONS.md` com 4+ ciclos | `docs/ITERATIONS.md` | ✅ 44 |
| `.gitignore` desde o início | `.gitignore` | ✅ |
| `.env.example` versionado | `.env.example` | ✅ |
| Zero segredos no histórico | ver §6 | ✅ |
| 15+ commits convencionais | 109 | ✅ |
| 3+ branches e 3+ PRs merged | 29 branches, 20 PRs | ✅ |
| Tag `v1.0.0` | 17 tags até `v1.4.0` | ✅ |
| `.devcontainer/devcontainer.json` | `.devcontainer/` | ✅ |
| `Dockerfile` + `docker-compose.yml` | raiz | ✅ |
| `docker compose up` de clone limpo | documentado e usado | ✅ |
| Node fixado | `.nvmrc`, `engines` | ✅ |
| Lockfile commitado | `package-lock.json` | ✅ |
| 3+ testes unitários | 42 | ✅ |
| lint / test / build verdes | CI + registo local | ✅ |
| Checklist manual 8–10 casos | `docs/TESTING.md` | ✅ 27 |
| Zero erros na consola | manual | ⚠️ confirmar |
| 2+ agentes | `.claude/agents/` (3) | ✅ |
| 2+ skills | `.claude/skills/` (3) | ✅ |
| `docs/PROMPTS.md` com prompts reais | `docs/PROMPTS.md` | ✅ |
| Uma falha do AI documentada | motor somava sobreposições | ✅ |
| 8–10 slides | `docs/TripSwap-Defense.pptx` | ✅ 10 |
| Guião de demo com cliques | `docs/DEFENSE.md` | ✅ |
| Vídeo de backup 3 min | `docs/VIDEO.md` | ❌ gravar |
| 2 ensaios cronometrados | — | ❌ fazer |
| 10 perguntas de Q&A | `docs/QA.md` (22) | ✅ |

## 4. Run sheet da defesa (10 min)

| Tempo | Bloco | Nota |
|---|---|---|
| 0:00 | Abertura | Desejo vs. dinheiro; a pergunta do produto |
| 0:40 | Problema | Banco/folha de cálculo perdem a pessoa |
| 1:20 | A ideia | €0* é metáfora; o custo real fica visível |
| 2:00 | Demo | Paris → Balanced → 122 €/6 meses |
| 5:00 | Scope | 8 destinos, 25 trocas; fora auth/booking/preços live |
| 6:00 | Arquitetura e design | Dados → motor puro → UI; “the world is the reward” |
| 7:00 | O cálculo | Fórmula, sobreposições, poupanças pontuais |
| 7:45 | Processo com AI | 120+ commits, 21 PRs, 3 agentes, a falha do motor |
| 8:45 | Qualidade e deploy | CI, 45 testes, Vercel, rollback |
| 9:30 | Limitações e fecho | Orçamentos ilustrativos; próximo passo |

## 5. Demo (3 min, cliques exatos)

Preparação: janela limpa, zoom 110%, `/unlocks` vazio, `/` aberto.

| Tempo | Ação | O que dizer |
|---|---|---|
| 0:00 | `/` | “Oito destinos. Cada um com um objetivo real de planeamento — e um €0* que é uma metáfora, não um preço.” |
| 0:20 | Abrir **Paris City Break** | “650 € para planear. Dois viajantes, três noites, partida de Lisboa.” |
| 0:35 | Clicar **Balanced** | “Café em casa, almoço de casa, metade dos Uber. **122 € por mês. Seis meses.** O cartão fica laranja: *this is now possible*.” |
| 0:55 | Abrir **How we calculated** | “A conta está aqui: (10 − 2,50) × 4, (9 − 4) × 12, (2 − 0,40) × 20. Nada disto é gerado por IA.” |
| 1:10 | Clicar **Walk** | “Substitui o Uber — as duas assumem as mesmas viagens. O produto recusa somar.” |
| 1:25 | Voltar a **Balanced**, horizonte **3m** | “Com três meses, ainda não está desbloqueado. O produto não mente.” |
| 1:40 | Horizonte **12m**, **Save this plan** | “Guardado neste dispositivo. Sem conta, sem servidor.” |
| 1:55 | Abrir **My unlocks** | “O plano está aqui, com o prazo e o progresso recalculados.” |
| 2:10 | Clicar **Open plan** | “O deep link devolve exatamente as mesmas trocas — o número é reproduzível.” |
| 2:20 | Clicar **Add to calendar** | “Diário às 08:30, `.ics` com evento de 15 minutos e alarme. Sem conta, sem servidor.” |
| 2:30 | Toggle **PT** | “A mesma conta, em português: 122 € / 6 meses. Os números não mudam.” |
| 2:38 | Abrir **Sobre** | “Método, limites e créditos. O €0* explicado outra vez.” |
| 2:50 | Fecho | “Não é uma app de finanças. É uma forma de ver o que as pequenas decisões pagam.” |

**Se algo falhar:** “Isto é o produto real; tenho o vídeo de backup.” Continua.

## 6. Segurança

- Sem backend, sem contas, sem dados pessoais e sem chaves de API.
- `.env.example` existe por convenção; o produto não precisa de variáveis.
- `localStorage` guarda apenas planos fictícios (`tripswap:unlocks:v1`).
- Verificação rápida:

```bash
git log -p | grep -iE "api[_-]?key|secret|password|token" | head
```

## 7. Comandos a verificar antes

```bash
npm ci
npm run lint
npm run typecheck
npm test          # 45 testes
npm run build
npm run preview   # http://localhost:4173
docker compose up
```

Resultado registado no repo:

```text
Test Files  5 passed (5)
Tests       42 passed (42)
```

## 8. Plano B na sala

| Situação | O que fazer |
|---|---|
| URL não abre | `npm run build && npm run preview` local; senão vídeo |
| Vercel em baixo | Mostra o build local; o deploy é automático de `main` |
| Deep link falha | Abre `/unlocks` e explica que a seleção é sanitizada no motor |
| Demo de guardar falha | Mostra um plano já guardado; o cálculo já está visível |
| Sem internet | Vídeo + slides + Docker local |
| Pergunta sem resposta | “Não validei; a minha hipótese é X; o próximo teste seria Y.” |

## 9. Últimos 30 minutos

- [ ] URL aberta em incógnito e no telemóvel.
- [ ] `/unlocks` limpo para a demo.
- [ ] Deep link de Paris testado.
- [ ] Deck aberto no modo de apresentação.
- [ ] Vídeo de backup aberto offline.
- [ ] `docs/DEFENSE.md` e `docs/QA.md` noutro separador.
- [ ] `git log --oneline` e os PRs abertos.
- [ ] Zoom 110%, notificações desligadas.
- [ ] Água.
