# Decisões

Sete decisões que explicam a forma do produto. Cada uma tem o custo assumido.

## 1. SPA estática em vez de Next.js

**Contexto:** não há backend, autenticação, dados por utilizador nem SEO crítico para
a demo.

**Decisão:** Vite + React + TypeScript, build estático, deploy na Vercel.

**Porquê:** build em menos de um segundo, zero runtime de servidor, deep links
resolvidos por rewrite, e o foco fica todo no cálculo e na interface.

**Trade-off:** sem SSR. Para um catálogo que se partilha por link, a pré-renderização
seria a próxima melhoria.

## 2. Dados locais tipados em vez de API

**Contexto:** o MVP precisa de 8 destinos e 24 trocas, todos fictícios.

**Decisão:** `src/data/*.ts` com tipos estritos e um teste que valida a integridade.

**Porquê:** a demonstração não depende de rede, latência ou disponibilidade de um
serviço. Os números são reproduzíveis offline.

**Trade-off:** atualizar conteúdo exige um deploy. Numa v2, um CMS geraria o mesmo
JSON sem mudar o motor.

## 3. Grupos exclusivos em vez de penalizações de sobreposição

**Contexto:** várias trocas assumem a mesma despesa (takeaway e refeições prontas,
álcool e noites fora, Uber e caminhadas).

**Decisão:** cada sobreposição é um `exclusiveGroup`; escolher uma troca substitui a
anterior. O motor também deduplica defensivamente.

**Porquê:** somar tudo inflacionaria a poupança; calcular deduções parciais exigiria
premissas que o utilizador não consegue verificar. Exclusivo é conservador e
explicável em uma frase.

**Trade-off:** o utilizador não pode combinar duas trocas parcialmente compatíveis.
Preferimos um número menor e defensável a um número maior e frágil.

## 4. localStorage em vez de conta de utilizador

**Contexto:** guardar planos é a quarta user story; não há requisito de sincronização.

**Decisão:** planos guardados em `localStorage`, atrás de `src/lib/storage.ts`, com
versão de chave e validação do formato.

**Porquê:** zero fricção, zero dados pessoais, zero backend. Funciona offline.

**Trade-off:** limpar os dados do browser apaga os planos. A interface diz isso.

## 5. Sem biblioteca de gráficos e sem Framer Motion

**Contexto:** o gráfico de projeção e as transições são simples.

**Decisão:** SVG próprio e transições CSS, com `prefers-reduced-motion`.

**Porquê:** menos 50–100 kB, controlo total do desenho e nenhuma dependência que
possa quebrar na demo.

**Trade-off:** animações mais elaboradas exigiriam código manual. Não são necessárias
para o valor central.

## 6. Orçamentos ilustrativos, nunca preços

**Contexto:** não há acesso a tarifas nem a disponibilidade.

**Decisão:** cada destino tem um objetivo de planeamento documentado com cidade de
partida, viajantes, noites e âmbito. A UI chama-lhe sempre "objetivo ilustrativo".

**Porquê:** evita a armadilha de apresentar valores inventados como preços reais e
mantém o produto honesto perante o júri e o utilizador.

**Trade-off:** o produto não serve para decidir uma compra hoje. Serve para decidir se
a viagem é possível.

## 7. Dicionários locais em vez de uma biblioteca de i18n

**Contexto:** a app tem dois públicos — o viajante em Lisboa e o júri internacional do
curso. A copy é extensa (24 trocas, 8 destinos, método) e os números não podem mudar
com o idioma.

**Decisão:** dois dicionários tipados (`src/i18n/pt.ts`, `en.ts`) e mapas de conteúdo
por id (`content.ts`). O inglês é o padrão; o português está a um clique. O idioma vive
num contexto React, persiste em `localStorage` (chave `v2`) e é aplicado por `useI18n`.
Sem `react-i18next`.

**Porquê:** zero dependências, paridade garantida pelo TypeScript e por um teste, e
controlo total do tom editorial. O motor de cálculo não sabe qual é o idioma.

**Trade-off:** cada nova string tem de ser adicionada nos dois dicionários; o teste de
paridade falha se faltar. As rotas não são localizadas (`/destination/...` é igual nos
dois idiomas).
