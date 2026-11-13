# Publicar

Dois passos: GitHub e um host estático. Nenhum segredo é necessário — a app é estática.

## Deploy atual: GitHub Pages

O workflow [`.github/workflows/pages.yml`](../.github/workflows/pages.yml) constrói,
testa e publica a app em cada push para `main`, com `VITE_BASE=/tripswap/`.

- URL: <https://blamelas.github.io/tripswap/>
- Deep links funcionam através de `dist/404.html` (cópia de `index.html`), a convenção
  de SPA do GitHub Pages.
- O subpath é suportado por `src/lib/base.ts` e pelo `basename` do router.

Para reativar Pages num clone novo:

```bash
gh api -X POST repos/<owner>/<repo>/pages -f build_type=workflow
gh workflow run pages.yml
```

## Alternativa: Vercel

## 1. GitHub

`gh` não está instalado por omissão nesta máquina.

```bash
brew install gh
gh auth login
```

Depois, na raiz do projeto:

```bash
gh repo create tripswap --public --source=. --remote=origin --description "TripSwap — small changes, bigger journeys."
git push -u origin main
git push origin develop
```

Se preferires o browser: cria o repositório vazio `tripswap`, e depois

```bash
git remote add origin https://github.com/<utilizador>/tripswap.git
git push -u origin main
git push origin develop
```

### Branches e PRs

O histórico local já inclui branches de feature e merges. Para a evidência no GitHub,
publica todas as branches:

```bash
git push origin --all
```

E abre PRs (ou usa os merges já existentes como prova de fluxo):

```bash
gh pr create --base develop --head feature/calc-engine --title "feat(calc): deterministic savings engine" --fill
gh pr create --base develop --head feature/detail-flow --title "feat(detail): swap selector and funding projection" --fill
gh pr create --base main --head develop --title "release: v1.0.0" --fill
```

No “About” do repositório: descrição, URL do deploy e tópicos
`react`, `typescript`, `vite`, `tailwindcss`, `travel`, `local-first`.

## 2. Vercel

1. Importa o repositório em <https://vercel.com/new>.
2. Framework: **Vite**. Build: `npm run build`. Output: `dist`.
   (O `vercel.json` já define isto.)
3. Variáveis: nenhuma é necessária. Se quiseres, define `VITE_APP_NAME=TripSwap`.
4. Deploy. O URL fica no README, no topo e no “About” do repo.

O deploy de produção é automático a cada push para `main`. Os PRs geram previews.

## 3. Verificação pós-deploy

```bash
curl -I https://<projeto>.vercel.app
curl -I https://<projeto>.vercel.app/destination/paris-city-break   # deve devolver 200
```

- Abrir em incógnito.
- Abrir no telemóvel.
- Testar o deep link `…/destination/paris-city-break?h=coffee-at-home,lunch-from-home`.
- Confirmar que o número é 8 meses e 92 €/mês.
- Confirmar ausência de erros na consola.

## 4. Rollback

Vercel → Deployments → escolher a versão anterior → **Promote to Production**.
Como não há base de dados, o rollback é imediato e sem migrações.

## 5. Se o deploy falhar

- Confirmar que `npm run build` passa localmente (Node 20).
- Confirmar `outputDirectory` = `dist` e framework = Vite.
- O rewrite de SPA está em `vercel.json`; se os deep links derem 404, é esse ficheiro.
