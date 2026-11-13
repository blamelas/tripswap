# Publicar

A app é estática: não há segredos, base de dados nem variáveis obrigatórias.

## Vercel

Destino principal do projeto. O [`vercel.json`](../vercel.json) já define framework
Vite, build `npm run build`, output `dist` e o rewrite de SPA (deep links com 200).

### 1. Login (uma vez)

O CLI não tem sessão iniciada nesta máquina.

```bash
npx vercel login
```

Escolhe GitHub, email ou SSO. O browser abre para confirmar. Verifica com:

```bash
npx vercel whoami
```

### 2. Primeiro deploy de produção

```bash
cd tripswap
npx vercel link --yes --project tripswap
npx vercel --prod --yes
```

No fim, o CLI imprime o URL de produção (algo como
`https://tripswap-<hash>.vercel.app`). Confirma com:

```bash
npx vercel ls tripswap
```

### 3. Deploys automáticos a partir do GitHub

1. <https://vercel.com/new> → importar `blamelas/tripswap`.
2. Framework **Vite** (detetado). Build `npm run build`. Output `dist`.
3. **Não** definir `VITE_BASE` (o domínio raiz usa `/`).
4. Deploy. Cada push para `main` publica; cada PR gera um preview.

Opcional: `gh repo edit blamelas/tripswap --homepage <url-vercel>` e atualizar o README
e o `docs/DEFENSE.md` com o URL final.

### 4. Verificação

```bash
curl -I https://<projeto>.vercel.app
curl -I https://<projeto>.vercel.app/destination/paris-city-break   # 200
curl -I https://<projeto>.vercel.app/unlocks                          # 200
```

- Abrir em incógnito e no telemóvel.
- `…/destination/paris-city-break?h=coffee-at-home,lunch-from-home` → **92 €/mês · 8 meses**.
- `…?h=coffee-at-home,lunch-from-home,uber-public-transport` → **122 €/mês · 6 meses**.
- Zero erros na consola; imagens carregadas.

### 5. Rollback

Vercel → Deployments → versão anterior → **Promote to Production**. Sem base de dados,
o rollback é imediato.

## GitHub Pages (fallback atual, já no ar)

- **URL:** <https://blamelas.github.io/tripswap/>
- **Workflow:** [`.github/workflows/pages.yml`](../.github/workflows/pages.yml) — corre
  em cada push para `main`: instala, lint, testa, constrói com `VITE_BASE=/tripswap/`,
  copia `index.html` para `404.html` e publica.
- **Subpath:** `src/lib/base.ts` prefixa imagens e o `basename` do router trata das
  rotas.
- **Deep links:** o Pages serve `404.html` (a mesma app), por isso
  `/destination/paris-city-break` abre corretamente. O estado HTTP é 404; na Vercel é
  200.

Para reativar num repositório novo:

```bash
gh api -X POST repos/<owner>/<repo>/pages -f build_type=workflow
gh workflow run pages.yml --ref main
```

## GitHub: repositório e metadados

```bash
gh repo create <owner>/tripswap --public --source=. --remote=origin --push
git push origin --all
git push origin --tags
```

No “About” do repositório: descrição, homepage e tópicos
`react`, `typescript`, `vite`, `tailwindcss`, `travel`, `local-first`.

## Se o deploy falhar

- Confirmar `npm run build` local com Node 20.
- Confirmar `base` correto: `/` na Vercel, `/tripswap/` no Pages.
- Deep links a 404 num host sem SPA fallback: verificar `404.html` ou o rewrite.
