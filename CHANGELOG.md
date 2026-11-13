# Changelog

Formato: [Keep a Changelog](https://keepachangelog.com/pt-PT/1.1.0/) ·
Versionamento semântico.

## [1.5.4] — 2026-11-13

### Alterado

- A faixa fotográfica dos cartões passa de uma **edge vertical de 12 px com fade** para
  uma **faixa horizontal de 36 px, de largura total, no topo**. Sem blur, sem máscara
  desfocada; a imagem é apenas cortada de forma limpa.
- 42 testes.

## [1.5.3] — 2026-11-13

### Alterado

- **Jogos de azar e apostas**: estimativa ilustrativa de **40 € → 20 € = 20 €/mês**
  (antes 5 €/mês), sem inputs.
- Cada cartão de troca recebe uma **faixa fotográfica estreita e mascarada** na edge
  esquerda, a partir do Wikimedia Commons. A faixa é textura; a fotografia grande
  continua reservada aos destinos. Créditos em `docs/IMAGE-CREDITS.md`.
- O feedback de seleção passa a ser um **check monocromático** no canto; o sorriso
  animado do v1.5.2 foi removido.
- As categorias do catálogo começam **fechadas**; abrir uma fecha as restantes.
- 42 testes.

## [1.5.2] — 2026-11-13

### Alterado

- **Jogos de azar e apostas** passa a usar uma estimativa fixa e conservadora: 20 €
  atuais, 15 € reduzidos, **5 €/mês**. O cartão deixa de pedir valores ao utilizador.
- Ao adicionar uma troca ao plano, um sorriso sobe dentro do cartão e desaparece; a
  animação respeita `prefers-reduced-motion`.
- 42 testes: removidos os três casos do cálculo personalizado de jogos.

### Removido

- `GamesFields`, o estado `tripswap:games:v1`, `customExpense`, `GamesEstimate` e o
  snapshot de jogos nos planos guardados. Planos antigos continuam válidos; o campo
  extra é simplesmente ignorado.

## [1.5.1] — 2026-11-13

### Alterado

- Cartões de swap com um ícone próprio por atividade, na cor da categoria. A fotografia
  continua reservada aos destinos, evitando 25 tiles de stock repetidos.
- Categoria renomeada para **Jogos de azar e apostas** / **Games of chance & betting**.
  O copy nomeia raspadinhas, apostas online e casino e sugere jogos de tabuleiro ou
  planos gratuitos como alternativa.
- Botão “Usar um exemplo conservador” preenche 20 € → 15 € e guarda a estimativa de
  5 €/mês, sem obrigar a escrever valores.
- As premissas de cálculo ficam ocultas no cartão de jogos.

## [1.5.0] — 2026-11-13

### Adicionado

- Página `/swaps` — “As trocas” / “The swaps” — com as 25 trocas em 6 categorias,
  independente de destinos, grelha editorial, resumo fixo e seleção persistente.
- **Jogos e apostas**: categoria própria; o utilizador introduz gasto mensal atual e
  reduzido. A poupança é a diferença, sem médias universais e sem número até os valores
  existirem.
- Transporte das trocas escolhidas para qualquer plano de destino, via deep link e
  seleção global; o plano guarda um snapshot dos valores de jogos.
- Dois cartões de roadmap com bordas tracejadas: “Criar a minha troca” e “Adicionar a
  minha viagem de sonho” — não interativos, marcados como em desenvolvimento.
- 45 testes (novos casos para valores personalizados e resumo de poupança).

### Alterado

- Estatísticas do produto passam a 25 trocas / 6 categorias.
- Navegação principal inclui “As trocas”; no mobile, About passa para o footer.

## [1.4.0] — 2026-11-13

### Adicionado

- Lembretes por plano guardado: botão “Add reminder”, periodicidade diária ou mensal,
  hora escolhida e dia do mês (1–28).
- Exportação `.ics` com evento de 15 minutos, `VALARM` à hora escolhida, `RRULE`
  diária/mensal e link profundo para o plano.
- Preferência de lembrete guardada em `localStorage`, com resumo, edição e remoção;
  remover o plano ou limpar tudo remove também o lembrete.
- 7 testes novos para datas, RRULE, alarme e escape de texto.

### Notas

- Não há push notifications nem backend. O calendário do utilizador é o mecanismo de
  lembrete; o ficheiro `.ics` é descarregado e aberto pelo utilizador.

## [1.3.4] — 2026-11-13

### Adicionado

- Cabeçalhos de categoria como capítulos editoriais: 21px, ícone de 44px, cinco cores
  (azul/teal, damasco, violeta, sálvia, rosa), regra de 2px e resumo ao vivo
  “N trocas disponíveis · N selecionadas”.
- Secções colapsáveis, expandidas por omissão, com `aria-expanded` e contagem de
  selecionadas visível no cabeçalho. As seleções mantêm-se ao colapsar.

## [1.3.3] — 2026-11-13

### Alterado

- Zona de planos sugeridos separada dos dados da viagem: passa para o início do passo
  “What would you change?”, com fundo sky e a etiqueta “Suggested plans”.
- Removido “You can adjust everything afterwards”.
- Removido o parágrafo “Illustrative planning target…” do detalhe.
- Ícones pequenos nos dados da viagem (partida, viajantes, noites, inclui) e nas
  categorias de hábitos.

## [1.3.2] — 2026-11-13

### Corrigido

- Região `aria-live` anuncia o estado de sucesso (“This is now possible. 6 months”)
  sem alterar o layout do cartão.

## [1.3.1] — 2026-11-13

### Corrigido

- O cartão de recompensa mantém a mesma altura em todos os estados. O sucesso é uma
  transformação do próprio cartão (signal, check, tipografia) e não uma secção extra.
  Medido: 753 px no desktop e 462 px no mobile, de 0 a 4 trocas.
- Categorias de hábitos reduzidas a etiquetas discretas; removidos ícones, numeração e
  separadores pesados.
- Atividades com hierarquia nome → poupança → seleção. Descrições, premissas e
  benefícios passam para divulgação progressiva (chevron).
- Nota de sobreposição reduzida a “mesmas despesas · escolhe uma”.

## [1.3.0] — 2026-11-13

### Adicionado

- Estado de sucesso explícito: bloco signal **“This is now possible.”** no painel e no
  fluxo, com check, meses, trocas escolhidas e objetivo. A barra mobile fica signal e
  mostra check.
- Ícones nas categorias de hábitos (rota, talheres, bilhete, ferramenta, pulso) e nos
  botões de guardar (bookmark / bookmark check).
- Favicon novo (signal com horizonte ink/canvas) e `apple-touch-icon`.

### Alterado

- Cartões de destino: €0* muito maior, orçamento riscado acima e CTA explícito
  “Unlock this experience” por baixo.

## [1.2.1] — 2026-11-13

### Corrigido

- Signal afinado para `#F04A28` (texto grande) e `accent-dark` `#B83417` para labels
  pequenos, garantindo contraste AA em canvas e sky.
- Opacidades de texto secundário sobre ink e sky reforçadas.
- Tab do destino no hero passou a fundo canvas para ser legível sobre a fotografia.

## [1.2.0] — 2026-11-13

### Alterado

- Nova direção de arte **“The world is the reward”**: Barlow Condensed, IBM Plex Sans e
  IBM Plex Mono; canvas `#F7F6F2`, ink `#151A19`, signal `#FF5936` e azul pálido
  `#D8E8EE`. Removidos Fraunces, bege e terracota.
- Homepage reconstruída: hero assimétrico, fotografia full-bleed, grelha editorial com
  destino flagship e capítulos Dream / Swap / Arrive.
- Detalhe reconstruído: bloco €0* com orçamento riscado, reward window com maré e linha
  de progresso sobre a fotografia, meses animados e lista de trocas em linhas.
- My plans, About, 404, header, footer e favicon redesenhados.
- Nova fotografia para Lisboa, Barcelona e Islândia, com créditos atualizados.
- Testes manuais de design e contraste em `docs/TESTING.md`.

### Adicionado

- `PriceBlock` e `RewardPanel` como componentes-assinatura.
- Sistema tipográfico e tokens documentados no README.

### Removido

- `FundingPanel` e `ProgressRail` (substituídos pela reward window).
- Dependências de Fraunces, Inter Tight e JetBrains Mono.

## [1.1.0] — 2026-11-13

### Adicionado

- Toggle **PT/EN** no cabeçalho, persistente em `localStorage`, com `<html lang>`,
  título e meta description atualizados. **Inglês por omissão**; português a um clique.
- Dicionários tipados em `src/i18n` (PT e EN) e conteúdo traduzido para as 24 trocas,
  os 8 destinos, as categorias, os benefícios e todas as vistas.
- Formatação por locale: EUR (`650 €` / `€650`) e meses (`6 meses` / `6 months`).
- `tests/i18n.test.ts` com paridade de chaves, conteúdo completo e formatação.

### Alterado

- `formatEUR`, `formatMonths` e `formatDate` aceitam `locale`.
- README e documentação atualizados para 35 testes e interface bilingue.

## [1.0.7] — 2026-11-13

### Alterado

- O domínio público passa a ser <https://tripswap-home.vercel.app>, adicionado ao
  projeto na Vercel e a seguir produção. O alias anterior continua a redirecionar.

## [1.0.6] — 2026-11-13

### Removido

- Deploy no GitHub Pages e respetivo workflow. O único alvo é a Vercel.
- Suporte de subpath (`VITE_BASE`, `basename`, `withBase`). O build assume o domínio raiz.
- Badge e referências ao Pages no README, guia de publicação e Q&A.

## [1.0.5] — 2026-11-13

### Alterado

- URL público passa a ser o deploy de produção na Vercel:
  <https://tripswap-kappa.vercel.app/>. (O GitHub Pages foi removido na 1.0.6.)
- README e guião de defesa alinhados com o URL final.

## [1.0.4] — 2026-11-13

### Corrigido

- Se uma fotografia falhar, o cartão mantém a forma e mostra a legenda em vez de um
  ícone de imagem quebrada. O fundo neutro do contentor serve de placeholder de
  carregamento.

## [1.0.3] — 2026-11-13

### Adicionado

- Dois testes de integridade das imagens locais (ficheiro presente, tamanho mínimo,
  sem dependência de domínios externos). Total: 29 testes.
- `docs/QA.md` com pitch, 15 perguntas, frases a evitar e números de referência.
- Template de pull request com as regras de cálculo, honestidade do €0* e claims.

## [1.0.2] — 2026-11-13

### Adicionado

- Deploy automático no GitHub Pages, com build testado em cada push para `main`.
- Suporte de subpath (`VITE_BASE`), `basename` no router e `withBase` para imagens.
- Fallback `404.html` para deep links em hosting estático.
- `aria-label` nos links de navegação para nomes acessíveis sem duplicação.

## [1.0.1] — 2026-11-13

### Alterado

- As fórmulas do recibo mostram sempre dois decimais (`2,00 € − 0,40 €`), para que a
  conta seja legível linha a linha.
- O sufixo de valor passou a `/mês` (sem espaço) e ganhou um espaço textual antes,
  para leitura por screen readers.

### Testes

- 27 testes (novo caso para formatação com dois decimais).

## [1.0.0] — 2026-11-13

### Adicionado

- Catálogo editorial com 8 destinos e objetivos ilustrativos de planeamento.
- Detalhe de destino com presets (Essencial, Equilibrado, Consciente), 24 trocas em 5
  categorias, painel de financiamento e barra fixa no telemóvel.
- Motor determinístico de poupança: recorrente, pontual, projeção e primeiro mês
  inteiro até ao objetivo.
- Grupos exclusivos de sobreposição com substituição explicada na interface.
- Recibo de cálculo linha a linha e gráfico de projeção em SVG.
- Planos guardados em `localStorage`, lista em `/unlocks`, remoção e deep link `?h=`.
- Página Sobre com método, limites, três pilares e créditos de fotografia.
- Empty state, 404, fallback de imagem e `prefers-reduced-motion`.
- 26 testes Vitest sobre o motor, dados e formatação.
- DevContainer, Dockerfile multi-stage, docker compose e CI GitHub Actions.
- Documentação: MVP, pressupostos gerados do código, decisões, testes, prompts,
  iterações, créditos e guião de defesa.

### Corrigido

- O motor somava duas trocas do mesmo grupo quando recebia uma lista não sanitizada.
  Passou a deduplicar antes de calcular.
- Navegação e barra de financiamento em ecrãs de 390 px.
- Sufixos de valor (`/mês`, `uma vez`) deixaram de ser forçados a maiúsculas.

### Notas

- Os orçamentos são fictícios e ilustrativos. Não há preços verificados, reservas ou
  pagamentos.
- A aritmética é determinística e local; a IA não calcula valores em runtime.
