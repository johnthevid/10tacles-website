# 10Tacles interface conventions

This is an Operate surface: customers order food, kitchen staff process and dispatch
orders, and riders complete stops. Preserve the restaurant's supplied purple/cyan
identity, official logo, existing seafood menu, Taglish/English choice, and prepaid
verification flow. The current public deployment is a sample-data simulation.

## Visual system

- Warm off-white canvas, white task surfaces, purple primary actions; cyan-blue focus.
- `public/refinement.css` owns shared refinement tokens and responsive overrides.
  Existing structural, ordering and feedback styles remain earlier in the cascade.
- Oswald 700 uppercase display headlines; Urbanist for headings, menu items and body.
  Self-hosted fonts and OFL notices are extracted from the supplied brand system.
  Preserve the official logo artwork rather than recreating it with text.
- Secondary text uses `--muted`; use semantic warning/success colors for order state.
- 14px card radius, 10px action radius, 12px floating dock radius. No decorative halos.
- Touch actions are approximately 44px or larger; inputs use 16px type to avoid mobile
  focus zoom. Visible keyboard focus, skip link, and readable form labels are retained.

## Composition

Customer: compact header and connection status, quiet language/preferences/updates
row, brief introduction, delivery-area selector, then search/categories/menu. Food
appears early. Three columns on wide screens, two on intermediate screens, and
horizontal photo/detail rows on phones. Floating bag and active-order dock persists.

Kitchen: clear title, flat four-stat overview (two-by-two on phones), accessible
filters, and readable order cards with status, customer, items, then next action.
Mobile filters wrap into a two-by-two layout rather than hiding a tab off-screen.

Rider: large rider selector, explicit simulation notice, trip status, stop list,
and large pickup/delivery actions. Map styling never implies real GPS is connected.

Dialogs: focused tasks, consistent fields and totals; phone dialogs are bottom
sheets, while order confirmation remains a centered acknowledgement.

## Imagery, motion, and constraints

Food photography comes from existing restaurant menu posters. Crop only the relevant
dish using CSS, with separate positions for desktop and mobile card geometry. Keep
accessible image descriptions. UI icons use a consistent authored SVG stroke style.

The whole-card jump-and-drop into the bag is the primary authored animation.
Avoid repeated entrances on order cards during polling. Retain brief dialog motion,
sound/vibration opt-ins, and reduced-motion support. Alert messages never prove a
payment; cooking still follows the server's payment-verification rules.

Refined against desktop and 390px phone layouts. Physical phone sound/vibration,
production authorization, GCash integration, and live GPS remain separate work.


## Signature-squid hero (public homepage)

The menu-only homepage is now a Persuade surface within the established brand:
large purple product-led typography, the supplied signature-squid photography,
and a direct menu anchor. English/Taglish hero copy follows the language selector.
The menu remains below as a catalog. Bag and Add controls are hidden while ordering
work is paused; the server-side menu-only gate continues blocking order APIs.
The original restaurant artwork is displayed without modifying its image contents.


## Authoritative brand system (November 2026)

Source: the owner's `10TACLES Brand Design System.html`. Its visual rules supersede
older incumbent colors/type above. The tagline is **Seafood Sarap**, unchanged in
both English and Taglish. The source includes Dasmariñas content examples; those
addresses, hours, prices, promotions and contact details are not Tanza business facts.

Screen colors: Squid Purple #6A2F90, Deep Ink #3E2557, Tentacle Plum #502A6A,
Lavender #8D599F, Wave Blue #27AAE1, Grid Lilac #BDB6DB, Mist #E8E6F4,
Paper #FAFAF4. Use screen HEX values for the website, not CMYK print values.
Wave Blue stays in the logo and small accents. Paper/lilac grid and purple dome
are supplied brand motifs, intentionally overriding generic decorative-grid guidance.

Oswald display: 700, uppercase, zero tracking. Urbanist: body 400; item names 800;
headings 900; descriptors and italic prices 300. UI actions have 48px touch height
and pill shapes; catalog cards have 24px corners and soft offset shadows.
`public/brand.css` is the authoritative token/style layer, following refinement.css.
The supplied transparent squid WebP is used unchanged. Local fonts and their
license notices are in public/fonts. No exported reference scripts are executed
or shipped; only selected fonts and the food cutout are reused.

Stageshow from benjitaylor/skills was installed in the user's skill library. It is
for authored faux-product UI illustrations and cursor walkthroughs; no ordering
mockup is introduced into the food-first homepage while ordering is paused.


## Tanza launch homepage (November 2026)

`site.html` is now the public launch page for the Tanza branch (opening December 8, 2026),
replacing the ordering demo UI. Ordering stays paused: the Worker still returns 503 for
`/api/*` in menu-only mode and the page loads no ordering scripts (`app.js` etc. remain in
`public/` but are unused).

- Mode: Persuade. Squid-first hero (three-squid crest on the Deep Ink / Plum dome over the
  lilac grid), cyan "Bukas na sa Dec 8" stamp, then sharing picks, menu, restaurant + cloud
  kitchen story, delivery (Coming soon) and visit details.
- Type: Oswald 600 uppercase display; Gilroy Heavy (900) headings/item names, Gilroy Light
  (300) body, Gilroy Medium Italic (500) prices. Gilroy is a commercial face: confirm a web
  licence before public launch, or swap `--sans` back to Urbanist in `public/home.css`.
- Paper #FAFAF4 is the pinned brand ground; the detector's "cream palette" warning is
  intentionally overridden by the brand system.
- Content sources: `data/menu.json` (copied exactly from the Menu Masterlist sheet, Menu tab)
  and `data/business.json` (confirmed facts only; null fields render as "ia-post namin dito"
  and hide the Call/Directions buttons; partner URLs switch "Coming soon" to order links).
  Run `node scripts/build-home.mjs` after editing either file.
- Menu: one category at a time with JS (chips on phones, sticky sidebar from 1080px); without
  JS every category is shown and chips are anchor links. Deep links: `#cat-<id>`.
- Motion: squid rise + stamp settle on load, panel fade on category change, button press
  scale, pick-card lift on desktop hover. All removed under prefers-reduced-motion.
- Styles: `public/home.css` only (older css files are not loaded by the homepage).

### Taste-skill pass (November 2026)

Checked with tasteskill 2.5.1 (`copy-lint`, `consistency.mjs`) as a **place** page. Adopted: hero fills
the first screen alone and enters on load (h1 line by line, lede, buttons, stamp); one primary and one
secondary button style; one h2 scale (Oswald 44px phone / 76px desktop); headings that name things;
straight date stamp; real 2px lift and 1.03 photo zoom on the linked sharing picks (which open their
menu category); party-size glyphs on the 10TACLES size tiles; restaurant + delivery merged into one
section with a squid close-up photograph; "Coming soon" no longer looks like a button; purple focus ring
(paper on dark bands); phones stack the picks instead of a snapping carousel; tagline set without "!".
Kept on purpose (client brand / approved mockup over the kit's defaults): the Squid Purple palette (the
kit bans violet), the squid breaking out of its dome, full-bleed bands, sections sized by content rather
than exactly one or two screens, the purple footer as a fourth ground, and no dealt scroll moment
(the brief asked for restrained motion). Only five client photographs exist; the kit wants 12–20 on a
place page, so more real food and interior photos are the biggest remaining upgrade.
