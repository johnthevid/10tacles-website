# Standalone Cloudflare demo

## Current mode: public simulation

`PUBLIC_DEMO` is explicitly `true` at the owner's request. All visitors share
the separate `public-demo-v1` board and can use all three simulated roles.
Use sample details only. Real payments and live GPS remain disconnected.
Private Access boards are not exposed or imported. Cloudflare's external Access
policy must also be disabled for this Worker to allow anonymous visitors.
To restore private mode, set `PUBLIC_DEMO` to `false`, deploy, and re-enable the
Worker's Access policy. The private setup instructions below apply to that mode.

Worker: https://10tacles-staging.johndavidceasar.workers.dev

The standalone Worker uses the existing interface and server order rules directly;
it does not require the Vinext build. The existing managed Site is unchanged.

## Complete setup

1. Keep Cloudflare Access enabled for this Worker, including deployment URLs.
2. In Zero Trust > Access > Applications, open this Worker's Access application.
   Copy the Application Audience (AUD) and team domain (`name.cloudflareaccess.com`).
3. Set `ACCESS_TEAM_DOMAIN` and `ACCESS_AUD` in `wrangler.staging.jsonc`.
   `ACCESS_EMAIL` must be the single allowed demo owner's email. These are not secrets.
   Keep the Access allow policy restricted to that email too.
4. Run `npx.cmd wrangler deploy --dry-run --config cloudflare/wrangler.staging.jsonc`.
5. Run `npx.cmd wrangler deploy --config cloudflare/wrangler.staging.jsonc`.

Do not use the generated managed-Site deployment configuration. Missing Access
configuration returns 503. Missing/invalid signed JWT returns 401; another email
returns 403. All assets run through this check. Never add an authentication bypass.
The application verifies Access JWT signatures, issuer, audience, expiry and email;
it does not trust incoming platform identity headers.

## Three phones

Sign in using the SAME allowed Cloudflare Access email on each phone:

- Customer: `https://10tacles-staging.johndavidceasar.workers.dev/?role=customer`
- Kitchen: `https://10tacles-staging.johndavidceasar.workers.dev/?role=staff`
- Rider: `https://10tacles-staging.johndavidceasar.workers.dev/?role=rider&rider=rider-1`

Use sample contact details and payment references. Create an order, submit its demo
payment reference, approve in Kitchen, mark ready and assign Marco, then collect and
deliver in Rider. Check Customer after each step. Foreground tabs poll every three
seconds. Refresh phones and test disconnection/retry. The two other phones must see
the same order number and status; do not manually recreate an uncertain order.

These views simulate roles within one authenticated demo account. They are not
production customer/staff permissions. No real payment or live GPS is connected.
The standalone database is separate from the managed Site; existing Site orders
will not appear here. Kitchen reset deletes this owner's staging orders only.

## Costs and checks

Keep Workers and Zero Trust on their Free plans. Allowances are shared across the
account, including other projects. No paid product is required by this configuration.

Unit checks: `node --test tests/cloudflare-access.test.mjs tests/domain.test.cjs tests/maps.test.cjs tests/shared-service.test.mjs`.
Deployment dry-run does not prove cloud login or database connectivity. Verify those
after deployment, then run the physical three-phone flow before calling the demo ready.


## Order feedback and language

Use Language to switch between Taglish and English. The choice is saved per browser.
Tap Enable sounds on each device (or Tap to activate sound after reopening). Sound
can be muted. Vibration can be disabled and is only available in supported browsers;
physical devices must be checked, especially iPhones. No push notification permission
is requested. Alerts are in-page, with sounds while the browser permits playback;
background or locked devices do not receive guaranteed notifications.

Updates shows the latest 30 events in this page session. First load establishes a
baseline without replaying old orders. Unchanged polls and position-only updates do
not repeat sounds. The public demo's customer view shares all test orders. Kitchen
receives new orders and status/payment updates; Rider receives changes affecting the
selected rider. The order confirmation waits for acknowledgment and follows the
server save. Reduced-motion settings disable transition effects.

Official logo is supplied restaurant artwork. The provided image files include the
wordmark but no webfont; interface text keeps the existing readable typefaces.
