# Testes

## Automáticos

```bash
npm test
```

26 testes em Vitest, todos sobre a lógica central e os dados. Não há snapshots de
componentes: o risco do produto está na aritmética e nas sobreposições.

### `tests/calc.test.ts` (21)

- Catálogo: 24 trocas, ids únicos, `saving` igual à fórmula documentada.
- Frequência mensal apenas em trocas recorrentes.
- Uma reparação nunca entra no total mensal.
- Valores publicados (café 32 €, almoço 60 €, tabaco 120 €, sapatos 65 €, etc.).
- Primeiro mês inteiro até ao objetivo.
- Poupanças pontuais contam uma vez, no início.
- Só pontuais que não chegam ao alvo → `null`.
- Pontuais que já cobrem o alvo → mês 1.
- Alvo inalcançável em 240 meses → `null`.
- Projeção soma recorrente e pontual sem duplicar.
- Zero seleções.
- Bloqueado quando o prazo excede o horizonte.
- Desbloqueia exatamente na fronteira do horizonte.
- Arredondamento ao cêntimo.
- Substituição dentro do mesmo grupo.
- Toggle duplo remove.
- Deep link com ids desconhecidos e duplicados é sanitizado.
- Recomendações de todos os destinos são livres de conflito.
- 8 destinos com orçamento, viajantes, noites e âmbito válidos.

### `tests/format.test.ts` (5)

- EUR sem decimais quando o valor é inteiro.
- Cêntimos preservados quando existem.
- Formato compacto forçado.
- Singular/plural de meses.
- Percentagens.

## Checklist manual (10 casos)

Executar em http://localhost:5173 e repetir no URL público.

| # | Caso | Esperado |
|---|---|---|
| 1 | Abrir `/` | 8 destinos, nota do €0\*, zero erros na consola |
| 2 | Abrir Paris | Hero, orçamento 650 €, três presets com prazos |
| 3 | Clicar "Equilibrado" | 122 €/mês, 6 meses, estado "Desbloqueado na simulação" |
| 4 | Desselecionar café | Muda para 90 €/mês e o prazo sobe; a barra de progresso mexe |
| 5 | Clicar em "Caminhar" com Uber ativo | Uber desativa e aparece a explicação de substituição |
| 6 | Escolher "Reparar sapatos" | 65 € aparecem em "uma vez", nunca em "por mês" |
| 7 | Horizonte 3 meses numa combinação longa | Estado "A caminho", "faltam X €", desbloqueio falso |
| 8 | Abrir `?h=coffee-at-home,lunch-from-home` | Mesmo plano, mesmo número, após refresh |
| 9 | Guardar plano e abrir `/unlocks` | Plano presente; remover funciona; "limpar tudo" pede confirmação |
| 10 | Telemóvel 390 px | Sem scroll horizontal; barra inferior visível; nav legível |

Casos adicionais: `/destination/nao-existe` (404), `/unlocks` sem planos (empty state),
imagem inexistente (fallback), `prefers-reduced-motion` (sem animações).

## Regressão

Depois de cada merge:

1. `npm run lint && npm run typecheck && npm test && npm run build`.
2. Repetir os casos 1–4 e 8 no URL público.
3. Confirmar que o número de Paris com o plano equilibrado continua a ser 6 meses.

## O que não está coberto

- Testes end-to-end de browser (o checklist manual cobre a demo).
- Acessibilidade automatizada (feita por inspeção: foco visível, `aria-pressed`,
  `role="progressbar"`, alt text, `prefers-reduced-motion`).
- Persistência multi-browser (a chave é versionada e o formato validado).
