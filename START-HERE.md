# Current deployment: Tanza launch homepage (menu only)

The homepage (`site.html`) is the public launch page for 10TACLES Seafood House Tanza.
Menu prices live in `data/menu.json` and business details in `data/business.json`; after
editing either, run `node scripts/build-home.mjs`, then deploy with Wrangler as below.
See DESIGN.md › "Tanza launch homepage" for the design system and open items.

# Current deployment: public menu only

`LAUNCH_MODE=menu-only` is enabled in `cloudflare/wrangler.staging.jsonc`.
Visitors can browse dishes and build a local bag. Checkout, payment submission,
order reads/writes, role shortcuts, and staff/rider screens are unavailable.
Existing database records are retained but are not returned to public visitors.

The backend rejects all `/api/` requests with HTTP 503 while this mode is active.
Do not remove menu-only mode for a public launch until staff authorization,
private customer tracking, payment verification, and real menu/service details
are implemented and verified. Removing customer-facing labels does not complete
those integrations. The older testing instructions below describe retained code.

---

# 10Tacles - updated source code

This package contains the current public Cloudflare demo, including the whole-card
jump-and-drop cart animation, official logo, Taglish/English selection, order update
messages, optional sound and supported vibration, and simple order confirmation.

Live demo: https://10tacles-staging.johndavidceasar.workers.dev

## Start locally on Windows

Install Node.js 22.13 or newer. Open PowerShell in this extracted project folder:

```powershell
npm.cmd ci
npx.cmd wrangler d1 migrations apply DB --local --config cloudflare/wrangler.staging.jsonc
npx.cmd wrangler dev --local --config cloudflare/wrangler.staging.jsonc --port 8787
```

Open http://localhost:8787/?role=customer, http://localhost:8787/?role=staff,
and http://localhost:8787/?role=rider&rider=rider-1 on the development computer.
Local mode uses a local database, not the online demo orders.

## Update the existing Cloudflare demo

```powershell
npx.cmd wrangler login
npx.cmd wrangler deploy --dry-run --config cloudflare/wrangler.staging.jsonc
npx.cmd wrangler deploy --config cloudflare/wrangler.staging.jsonc
```

The included staging config targets the owner's EXISTING Worker and database.
Do not run remote migrations to recreate its existing table. For a different account
or installation, create a new database and update account_id, database_id and name
before applying migrations remotely. These identifiers are configuration, not secrets.
No login credentials or API tokens are included. Cloudflare dashboard ZIP upload
cannot deploy this TypeScript project; use Wrangler.

PUBLIC_DEMO=true intentionally opens the shared simulation board and all roles.
Use sample details only. It is not a production authorization system. Setting it to
false restores application-level Access checks, with dashboard Access protection
configured separately. See cloudflare/STAGING.md for details.

## Source locations

- site.html: interface markup
- public/app.js: menu, bag, checkout and role views
- public/feedback.js and feedback.css: cart animation, sound, vibration, language
- public/feedback-events.js: role-specific notification rules
- public/shared.js: order synchronization and retry handling
- cloudflare/entry.ts and demo-api.ts: standalone Worker and shared-order API
- lib/demo-service.ts and lib/domain.mjs: server order validation and transitions
- cloudflare/wrangler.staging.jsonc: current deployment configuration
- drizzle/: database migration

The app/ and worker/ directories preserve the earlier managed Sites implementation;
its login and deployment instructions are separate from the current standalone demo.
The old THREE-PHONE-DEMO.md describes that managed Site, not the current Cloudflare URL.
No production GCash API, screenshot upload, OCR or real rider GPS is connected.

## Checks

```powershell
node --test tests/feedback.test.cjs tests/cloudflare-access.test.mjs tests/domain.test.cjs tests/maps.test.cjs tests/shared-service.test.mjs
```

24 checks passed when this package was prepared. Sound needs a user tap; vibration
varies by browser. Alerts run in the open app; locked-screen push is not implemented.
Dependencies, generated builds, Git history, local databases, and credentials are
excluded. Install dependencies before running the package.
