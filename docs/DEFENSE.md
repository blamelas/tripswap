# Defesa — guião completo

**Produto:** TripSwap · **URL pública:** https://tripswap-home.vercel.app/ · **Repo:** https://github.com/blamelas/tripswap
**Deck:** [`TripSwap-Defense.pptx`](TripSwap-Defense.pptx) · **Submissão:** [`SUBMISSION.md`](SUBMISSION.md)
**Duração:** 10 min de apresentação + Q&A · **Ensaios:** 2 cronometrados

---

## Abertura (30 s, decorar)

> “O problema que escolhi é simples: quem quer viajar já sabe para onde quer ir, mas
> não sabe se o consegue pagar. As apps de finanças começam em orçamentos e perdem a
> pessoa no primeiro ecrã. O TripSwap começa no desejo e responde a uma pergunta: em
> quanto tempo isto fica ao meu alcance? Vou mostrar o momento em que isso acontece.”

## Slides (10)

### 1. Título — 0:00
**TripSwap — Small changes. Bigger journeys.**
Nome, URL, repo. Visual: captura da homepage no deck.

### 2. Problema e utilizador — 0:40
- Utilizador: viajante em Lisboa, 25–40, com um destino em mente.
- Hoje: ou não planeia, ou abre uma folha de cálculo e desiste.
- Custo: a viagem fica no “um dia”.
- Visual: comparação “folha de cálculo vs. desejo”.

### 3. A ideia — 1:20
- O catálogo é a porta. O cálculo é o produto.
- €0\* = custo coberto por poupança; nunca um preço.
- Três pilares escondidos: gastar melhor, viver melhor, consumir melhor.
- Visual: um cartão com €0\* e o orçamento real.

### 4. Demo — 2:00 (ver guião abaixo)
**O momento de valor:** 3 trocas → 6 meses, com a maré a subir na fotografia e a linha coral a acompanhar.
Visual: ecrã real, não mockup.

### 5. Scope — 5:00
| Dentro | Fora |
|---|---|
| 8 destinos, 25 trocas, motor, swaps, unlocks, about | auth, booking, preços live, backend, mapas |
- Critério: “sem isto, o utilizador obtém o valor central?”
- Visual: tabela in/out de `docs/MVP.md`.

### 6. Arquitetura e design — 6:00
- Direção “The world is the reward”: Barlow Condensed, IBM Plex, ink/canvas/signal; fotografia como interface.
- SPA estática: React 19 + TS + Vite + Tailwind.
- Dados tipados → motor puro → UI. Sem servidor.
- `/swaps`: catálogo independente, 25 trocas, 6 categorias, jogos com valores do utilizador e roadmap não interativo.
- i18n local: dicionários PT/EN tipados, paridade testada, motor independente do idioma.
- `localStorage` atrás de uma camada de serviço.
- Visual: diagrama de 3 caixas.

### 7. O cálculo — 6:45
- Recorrente: `(original − alternativa) × frequência`.
- Pontual: diferença, uma vez.
- Prazo: primeiro mês inteiro.
- Sobreposições: grupos exclusivos, nunca soma.
- Visual: recibo real com uma linha e a fórmula.

### 8. Processo com AI — 7:45
- `CLAUDE.md`, 3 agentes, 3 skills, 44 ciclos em `ITERATIONS.md`.
- 45 testes; dois deles apanharam erros reais do agente. 109 commits, 20 PRs merged, CI em cada PR.
- Visual: `git log --oneline`, ficheiros de agentes, teste a falhar.

### 9. Qualidade e deploy — 8:45
- lint + typecheck + test + build verdes; CI em cada PR.
- Deploy automático de `main`; rollback por redeploy anterior.
- Visual: badge/CI e dashboard.

### 10. Limitações e próximo passo — 9:30
- Orçamentos ilustrativos, sem preços reais.
- Sem contas nem sincronização.
- Próximo: pré-renderização + recomendação calculada + teste e2e.
- Fecho (15 s): “O produto está em [URL]. O código está em [repo]. O que ficou de fora
  está no slide 5, e porquê. A próxima coisa que eu faria era testes end-to-end.”

---

## Guião de demo (3 min, cliques exatos)

Preparação: janela limpa, zoom 110%, `/unlocks` vazio, `/` aberto.

| Tempo | Ação | O que dizer |
|---|---|---|
| 0:00 | `/` | “Oito destinos. Cada um com um objetivo real de planeamento — e um €0* que é uma metáfora, não um preço.” |
| 0:20 | Abrir **Paris City Break** | “650 € para planear. Dois viajantes, três noites, partida de Lisboa.” |
| 0:35 | Clicar **Balanced** | “Três trocas comuns: café em casa, almoço de casa, metade dos Uber. **€122 por mês. Seis meses.** O próprio cartão fica laranja: *this is now possible*, sem mudar de altura.” |
| 0:55 | Abrir **How we calculated** | “A conta está aqui: (€2.00 − €0.40) × 20. Nada disto é gerado por IA.” |
| 1:10 | Clicar **Walk** | “Substitui o Uber — as duas assumem as mesmas viagens. O produto recusa somar.” |
| 1:25 | Voltar a **Balanced**, mudar horizonte para **3m** | “Com três meses, ainda não está desbloqueado. O produto não mente.” |
| 1:40 | Horizonte **12m**, **Save this plan** | “Guardado neste dispositivo. Sem conta, sem servidor.” |
| 1:55 | Abrir **My unlocks** | “O plano está aqui, com o prazo e o progresso recalculados.” |
| 2:10 | Clicar **Open plan** | “O deep link devolve exatamente as mesmas trocas — o número é reproduzível.” |
| 2:20 | Em **My unlocks**, clicar **Add to calendar** | “Escolho diário às 08:30 e descarrego o `.ics`: evento de 15 minutos com alarme. Sem conta, sem servidor.” |
| 2:30 | Toggle **PT** | “A mesma conta, em português: 122 € / 6 meses. Os números não mudam.” |
| 2:38 | Abrir **Sobre** | “Método, limites e créditos. O €0* explicado outra vez.” |
| 2:50 | Fecho | “Não é uma app de finanças. É uma forma de ver o que as pequenas decisões pagam.” |

**Se algo falhar:** “Isto é o produto real; tenho o vídeo de backup” e continua. Não
pedir desculpa mais de uma vez.

---

## Mapa afirmação → artefacto

| Afirmação | Onde provar |
|---|---|
| “Os números são determinísticos” | `src/lib/calc.ts`, `tests/calc.test.ts` |
| “Nunca soma trocas sobrepostas” | `src/lib/conflicts.ts`, teste “replaces a habit…” |
| “Poupanças pontuais não são mensais” | teste “never mixes a one-time saving…” |
| “O €0* é explicado” | `Discover`, detalhe, rodapé, `About` |
| “Sem dados financeiros pessoais” | nenhum formulário; `types.ts` |
| “Trabalho com AI é auditável” | `CLAUDE.md`, `.claude/`, `docs/PROMPTS.md` |
| “Duas falhas reais corrigidas” | `docs/PROMPTS.md` + commits `fix(calc)` e `fix(i18n)` |
| “Reproduzível numa máquina limpa” | `Dockerfile`, `docker-compose.yml`, README |
| “Deploy automático” | Vercel + `main` |
| “Lembretes sem servidor” | `src/lib/reminders.ts`, `tests/reminders.test.ts`, `.ics` com `VALARM` |
| “Mobile funciona” | checklist caso 10, captura em `docs/assets/mobile.jpg` |
| “É bilingue” | `src/i18n/`, `tests/i18n.test.ts`, toggle no header |

---

## Q&A (16 perguntas)

**1. Isto não é só um CRUD?**
> “O CRUD é o meio. O produto é o número: um motor que transforma escolhas em prazo,
> com sobreposições resolvidas e premissas visíveis. O ecrã de detalhe é a prova.”

**2. O que a AI fez mal?**
> “Somou duas trocas do mesmo grupo no motor, apesar de a UI as substituir. O teste
> falhou com duas linhas onde esperava uma. Corrigi o motor, não o teste.”

**3. Como sabes que o utilizador quer isto?**
> “É uma hipótese, não um estudo. A lógica: o destino é o motivo, o plano é a
> objeção. O próximo teste seria cinco entrevistas com pessoas que já viajaram nos
> últimos 12 meses.”

**4. O que ficou de fora e porquê?**
> “Auth, booking, preços reais, backend e mapas. Sem qualquer um deles o utilizador
> ainda obtém o valor central: perceber o custo e o prazo.”

**5. Como reproduzo isto numa máquina limpa?**
> “`docker compose up`. Ou `npm ci && npm run dev`. Está no README, secção Run.”

**6. E se a AI apagar tudo?**
> “Trabalhei em branches, com commits pequenos e PRs. `git checkout` resolve. Nunca
> trabalhei diretamente em `main`.”

**7. Os orçamentos são reais?**
> “Não. São objetivos ilustrativos, com cidade de partida, viajantes, noites e âmbito
> declarados. A UI chama-lhes isso em todos os ecrãs. Não há tarifas.”

**8. Porque não usaste uma API de voos?**
> “Três razões: custo, instabilidade na demo e a distinção entre preço verificado e
> objetivo de planeamento. O produto não precisa de tarifas para provar o conceito.”

**9. Como garantes que não há dupla contagem?**
> “Seis grupos exclusivos. Escolher uma troca remove a anterior e a UI explica. O
> motor também deduplica, para deep links e dados antigos.”

**10. Porque localStorage e não uma base de dados?**
> “Zero fricção e zero dados pessoais. O custo é não sincronizar. Para o MVP, o
> benefício supera. A camada `storage.ts` permite trocar por API sem tocar nas vistas.”

**11. Como escalarias?**
> “Primeiro pré-renderização para partilha; depois contas e sincronização; depois
> recomendação calculada por perfil; por fim testes end-to-end e observabilidade.”

**12. Que decisão foi mais difícil?**
> “Excluir trocas sobrepostas em vez de aplicar uma penalização. Perdi combinações,
> ganhei um número que consigo defender linha a linha.”

**13. Porque PT e EN?**
> “O produto é para Lisboa, mas o júri e o repo são internacionais. A interface tem
> toggle, os dados estão traduzidos e um teste garante paridade. Os números não mudam
> com o idioma.”

**14. Porque `.ics` e não notificações?**
> “Um `.ics` funciona em qualquer calendário, sem conta, permissão de push ou backend.
> O custo é ser local e manual; para o MVP, é a solução com menos fricção e menos
> superfície de falha.”

**15. Porque mudaste o visual?**
> “A primeira versão era competente mas previsível. O produto é sobre desejo; a fotografia tinha de ser o interface e o mecanismo financeiro a consequência. A reward window liga as trocas à imagem.”

**16. O que é a página The swaps?**
> “Um catálogo independente das 25 trocas, com seis categorias. Jogos e apostas usa valores introduzidos pelo utilizador, sem médias inventadas. A seleção segue para qualquer destino e há dois cartões de roadmap claramente não interativos.”

**Se não souberes:** “Não validei isso. A minha hipótese é X; o próximo teste seria Y.”

---

## Cronometragem

| Bloco | Alvo | Máximo |
|---|---|---|
| Abertura | 0:30 | 0:40 |
| Slides 2–3 | 0:45 | 1:00 |
| Demo | 2:30 | 3:00 |
| Slides 5–8 | 2:30 | 2:45 |
| Slides 9–10 | 1:15 | 1:30 |
| **Total** | **9:00** | **10:00** |

## Antes de entrar

- [ ] URL aberto em incógnito e no telemóvel
- [ ] `/unlocks` limpo para a demo
- [ ] Deep link de Paris testado
- [ ] Vídeo de backup abre offline
- [ ] `git log --oneline` e PRs abertos noutro separador
- [ ] `CLAUDE.md` e `docs/ITERATIONS.md` abertos
- [ ] Zoom 110%, notificações desligadas
- [ ] Água
