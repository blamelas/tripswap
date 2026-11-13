# Publicar

A app é estática: não há segredos, base de dados nem variáveis obrigatórias.

## Deploy atual: GitHub Pages

- **URL:** <https://blamelas.github.io/tripswap/>
- **Workflow:** [`.github/workflows/pages.yml`](../.github/workflows/pages.yml) — corre
  em cada push para `main`: instala, lint, testa, constrói com `VITE_BASE=/tripswap/`,
  copia `index.html` para `404.html` e publica o artefacto.
- **Subpath:** `src/lib/base.ts` prefixa imagens e o `basename` do router trata das
  rotas.
- **Deep links:** o GitHub Pages serve `404.html` (a mesma app), por isso
  `/destination/paris-city-break` abre corretamente. O estado HTTP é 404; num host com
  rewrites (Vercel) seria 200.

Para ativar num repositório novo:

```bash
gh api -X POST repos/<owner>/<repo>/pages -f build_type=workflow
gh workflow run pages.yml --ref main
```

### Atualizar o deploy

```bash
git checkout main
git merge --no-ff develop
git push origin main
```

O workflow publica sozinho. Acompanhar com `gh run watch` ou na aba **Actions**.

## Alternativa: Vercel

1. Importa o repositório em <https://vercel.com/new>.
2. Framework: **Vite**. Build: `npm run build`. Output: `dist`.
   O [`vercel.json`](../vercel.json) já define isto e o rewrite de SPA.
3. Variáveis: nenhuma. Se quiseres, `VITE_APP_NAME=TripSwap`.
4. Deploy. O URL de produção passa a ser o do README.

Neste caso o build corre com `VITE_BASE=/` (omitir a variável).

## GitHub: repositório e metadados

```bash
gh repo create <owner>/tripswap --public --source=. --remote=origin --push
git push origin --all
git push origin --tags
```

Ou, no browser, cria o repositório vazio e:

```bash
git remote add origin https://github.com/<owner>/tripswap.git
git push -u origin main
git push origin --all --tags
```

No “About” do repositório: descrição, homepage e tópicos
`react`, `typescript`, `vite`, `tailwindcss`, `travel`, `local-first`.

## Verificação pós-deploy

```bash
curl -I https://<host>/
curl -s https://<host>/destination/paris-city-break | grep -c 'id="root"'
```

- Abrir em incógnito e no telemóvel.
- Testar `…/destination/paris-city-break?h=coffee-at-home,lunch-from-home`.
  Esperado: **92 €/mês** e **8 meses**.
- Testar `…?h=coffee-at-home,lunch-from-home,uber-public-transport`.
  Esperado: **122 €/mês** e **6 meses**.
- Confirmar zero erros na consola e imagens carregadas.

## Rollback

- **Pages:** Actions → escolher o run anterior do workflow → **Re-run all jobs**.
  Ou reverter o merge em `main` e fazer push.
- **Vercel:** Deployments → versão anterior → **Promote to Production**.
  Sem base de dados, o rollback é imediato.

## Se o deploy falhar

- Confirmar `npm run build` local com Node 20.
- Confirmar `base` correto: `/` para domínio raiz, `/tripswap/` para Pages.
- Deep links a 404 num host sem SPA fallback: verificar `404.html` ou o rewrite.
