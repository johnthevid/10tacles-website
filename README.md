# Current standalone Cloudflare demo

Start with [START-HERE.md](START-HERE.md) and [cloudflare/STAGING.md](cloudflare/STAGING.md).
The current deployment is a public sample-data simulation at
https://10tacles-staging.johndavidceasar.workers.dev.
It uses the standalone Worker configuration, not the framework build described below.

The following section documents the earlier managed Sites implementation retained
in this source tree.

---

# 10Tacles shared operations demo

Read THREE-PHONE-DEMO.md for phone links and a full test script. This private Sites app uses Vinext route handlers and D1 for shared sample orders, scoped to the signed-in owner account. All demo phones sign into the same owning ChatGPT account; roles are simulated, not production staff permissions. No real payments or GPS.

Editable files: site.html (page), public/ (browser scripts/styles/assets), app/api/demo/route.ts (authenticated API), lib/demo-service.ts (commands), lib/domain.mjs (server domain rules), db/schema.ts and drizzle/ (shared DB migration). dist/ is generated and ignored. The original domain logic is also in public/domain.js for browser menu/quote previews; the server independently validates all submitted commands and prices.

Browser storage holds only the local cart and delivery choices. Orders are fetched from the shared API. Version-checked database writes and request identifiers protect against concurrent overwrites and duplicate retries. Polling runs every 3 seconds while visible; network failure is shown and uncertain actions can be retried with the same identifier.

Use npm run dev for local preview with portable mock sign-in at /signin-with-chatgpt?return_to=/. Generate/apply D1 migrations following the Sites starter instructions. Build/publish through Sites helpers.

Checks: node --test tests/domain.test.cjs tests/maps.test.cjs tests/shared-service.test.mjs. The optional local-only integration test runs with DEMO_HTTP_TEST=1 using tests/shared-http.test.mjs; it resets only the local test board on 127.0.0.1.

See GOOGLE-MAPS-SETUP.md and LAUNCH-PLAN.md for deferred production integrations. Earlier browser-local descriptions in planning documents are historical; this release now shares orders online, but is still a private demo.
