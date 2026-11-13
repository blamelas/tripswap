# Changelog

Formato: [Keep a Changelog](https://keepachangelog.com/pt-PT/1.1.0/) ·
Versionamento semântico.

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
