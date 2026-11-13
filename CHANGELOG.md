# Changelog

Formato: [Keep a Changelog](https://keepachangelog.com/pt-PT/1.1.0/) ·
Versionamento semântico.

## [1.0.5] — 2026-11-13

### Alterado

- URL público passa a ser o deploy de produção na Vercel:
  <https://tripswap-kappa.vercel.app/>. O GitHub Pages mantém-se como fallback.
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
