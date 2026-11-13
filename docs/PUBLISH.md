# Publicar

A app é estática: não há segredos, base de dados nem variáveis obrigatórias.

## Vercel

O [`vercel.json`](../vercel.json) define framework
Vite, build `npm run build`, output `dist` e o rewrite de SPA (deep links com 200).

**Estado:** já ligado ao repositório `blamelas/tripswap` (team
`filipes-projects-ba4328b8`). Cada push para `main` publica; cada PR cria um preview.
A build de produção está verde.

**URL público:** <https://tripswap-home.vercel.app/>

> Deployment Protection desativada. O URL responde 200 em `/`, `/destination/...`,
> `/unlocks` e `/about`.

### 1. Login (alternativa por CLI)

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
- Confirmar que o rewrite de SPA está ativo (`vercel.json`); os deep links devem dar 200.
- Confirmar o framework Vite e o output `dist` no dashboard.
