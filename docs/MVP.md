# TripSwap — MVP

**One-liner:** descobre as experiências que podes desbloquear mudando as pequenas
coisas que fazes todos os dias.

## Problema

As ferramentas financeiras começam em despesas e orçamentos. Quem quer viajar começa
no desejo. O TripSwap traduz desejo em plano: um destino, um objetivo de planeamento e
um conjunto de trocas realistas com um prazo calculado.

## Utilizador

Viajante em Lisboa, 25–40 anos, com um destino em mente e pouca paciência para
folhas de cálculo. Quer perceber se a viagem é possível sem introduzir salário,
extratos ou dados bancários.

**Momento de valor:** ao escolher o primeiro conjunto de trocas, vê em menos de 60
segundos quantos meses faltam para o objetivo — com a conta visível.

## User stories e critérios de aceitação

### US1 — Descobrir destinos

Como visitante, quero descobrir destinos inspiradores com orçamentos de planeamento
transparentes.

- [ ] A homepage mostra 8 destinos, cada um com imagem, país, duração, categoria e
      objetivo de planeamento.
- [ ] Cada cartão usa **€0\*** e o orçamento real continua visível.
- [ ] A nota do €0\* está presente na homepage e no rodapé.
- [ ] Nenhum valor aparece como preço verificado, tarifa ou oferta.

### US2 — Escolher trocas sem dados financeiros

Como visitante, quero selecionar mudanças realistas sem introduzir informação
financeira pessoal.

- [ ] Existem 25 trocas em 6 categorias.
- [ ] É possível selecionar e remover trocas com um clique.
- [ ] Não existe nenhum campo para salário, rendimento, despesas ou dados bancários.
- [ ] Duas trocas do mesmo grupo de sobreposição nunca ficam ativas ao mesmo tempo;
      a interface explica a substituição.

### US3 — Entender a poupança e o prazo

Como visitante, quero entender como as trocas escolhidas se traduzem em poupança e
quanto tempo podem levar a financiar a viagem.

- [ ] A poupança mensal e as poupanças pontuais aparecem separadas.
- [ ] O prazo é o primeiro mês inteiro em que a projeção atinge o objetivo.
- [ ] O horizonte (3, 6, 12, 24 meses) altera o progresso e o estado, não o prazo.
- [ ] Um recibo lista cada troca com a fórmula usada.
- [ ] Uma poupança pontual nunca é somada como valor mensal.
- [ ] Alvos inalcançáveis em 240 meses mostram "sem prazo estimado".

### Transversal — Idioma

Como visitante, quero ler a experiência no meu idioma.

- [ ] O inglês é o idioma por omissão; o português está a um clique.
- [ ] Um toggle PT/EN no cabeçalho muda toda a interface, incluindo as 25 trocas e os
      8 destinos.
- [ ] Os números, prazos e fórmulas mantêm-se idênticos nos dois idiomas.
- [ ] A escolha persiste após refresh e atualiza `<html lang>` e o título do documento.
- [ ] Um teste garante paridade de chaves e conteúdo traduzido.

### US4 — Guardar planos

Como visitante, quero guardar objetivos e planos para voltar mais tarde.

- [ ] Guardar persiste destino, trocas escolhidas, horizonte e data.
- [ ] `/unlocks` lista os planos com prazo, poupança e progresso recalculados.
- [ ] Um plano pode ser removido, e "limpar tudo" pede confirmação.
- [ ] O plano abre no detalhe com as mesmas trocas ativas (deep link `?h=`).
- [ ] Sem planos, existe um empty state claro com CTA.
- [ ] Nada é enviado para um servidor.

## Dentro do MVP

- Catálogo de 8 destinos com dados tipados.
- Detalhe com presets, 25 trocas, painel de financiamento e recibo.
- Página `/swaps` com catálogo independente, jogos com valores do utilizador e roadmap.
- Motor determinístico com grupos de sobreposição.
- Gráfico de projeção em SVG.
- `/unlocks` com persistência local.
- `/about` com método, limites e créditos.
- Empty state, erro 404 e fallback de imagem.
- Interface bilingue PT/EN com toggle persistente.
- Lembretes locais por plano com exportação `.ics` (evento + alarme).
- Responsivo até 360 px, com barra de financiamento fixa no telemóvel.
- Testes, lint, typecheck e build verdes.

## Fora do MVP

- Autenticação, multiusuário, sincronização.
- Reservas, pagamentos, preços em tempo real, integrações de companhias.
- Mapas, clima, uploads, push notifications, email.
- Chatbot ou geração de texto em runtime.
- Criar trocas pessoais ou viagens de sonho (apenas roadmap nesta fase).
- Gamificação com pontos, moedas ou recompensas.
- Filtros, pesquisa, favoritos sociais, dark mode.

## Modelo de dados

```ts
Destination {
  id, name, country, category, duration,
  image, imageAlt, imageCredit, quote, description,
  budget, departureCity, travelers, nights, includes[],
  recommendedHabitIds[]
}

Habit {
  id, title, description, category, kind,     // recurring | one-time
  originalCost, alternativeCost, monthlyFrequency?,
  saving, assumptions, exclusiveGroup?, benefits[]
}

SavedPlan {
  destinationId, habitIds[], horizonMonths, savedAt
}
```

## Não-objetivos

- Não provar que o utilizador poupa dinheiro.
- Não medir impacto ambiental ou de saúde.
- Não substituir aconselhamento financeiro.
- Não maximizar o número de destinos ou de trocas.

## Definição de pronto

- As 4 user stories funcionam de ponta a ponta, sem tocar no código.
- Os 45 testes passam; lint, typecheck e build verdes.
- O URL público abre em incógnito e no telemóvel.
- O toggle PT/EN funciona e persiste.
- Zero erros na consola.
- O guião de demo em [`DEFENSE.md`](DEFENSE.md) foi ensaiado duas vezes.
