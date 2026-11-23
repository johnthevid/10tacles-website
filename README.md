# 10TACLES Seafood House website

A fast, static website for 10TACLES Seafood House Dasma, built from the
**10TACLES Brand Design System** (see `DESIGN.md`) and hosted on Cloudflare.

Live address after deploy: https://10tacles-staging.johndavidceasar.workers.dev

## What's here

| Path | What it is |
| --- | --- |
| `site/` | The whole website, served as-is. `index.html` (home + full menu + visit), `404.html`, `styles.css`, `assets/`, `fonts/`. |
| `data/menu.json` | The menu: every item, size and price, copied from the **Menu Masterlist** (sheet "Menu"). |
| `scripts/build-menu.mjs` | Writes `data/menu.json` into `site/index.html`. |
| `wrangler.jsonc` | Cloudflare hosting config. |
| `.github/workflows/deploy.yml` | Publishes the site whenever `main` changes. |

## Change a price or add a dish

1. Edit `data/menu.json` (or ask Claude to re-copy it from the Menu Masterlist).
2. Run:
   ```bash
   npm run menu
   ```
3. Commit and push. The deploy workflow publishes it.

A dish only gets a photo card if it has an entry under `photos` in `data/menu.json`;
otherwise it is listed on a menu board. A category needs a slot in `order`.

## Preview locally

```bash
npm install
npm run dev
```

Then open http://localhost:8787.

## Deploy

**Automatic:** add a repository secret `CLOUDFLARE_API_TOKEN` (a Cloudflare API token with
the *Edit Cloudflare Workers* template) under GitHub → Settings → Secrets and variables →
Actions. Every push to `main` then deploys.

**Manual, from your computer:**

```bash
npx wrangler login
npm run deploy
```

The Worker name `10tacles-staging` is the same as the old ordering demo, so deploying
replaces it at the same address. The old demo's D1 database is not deleted; it is just no
longer used. The old ordering app's code is in git history (commit `abd6283`).
