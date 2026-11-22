# 10Tacles interface conventions

This is an Operate surface: customers order food, kitchen staff process and dispatch
orders, and riders complete stops. Preserve the restaurant's supplied purple/cyan
identity, official logo, existing seafood menu, Taglish/English choice, and prepaid
verification flow. The current public deployment is a sample-data simulation.

## Visual system

- Warm off-white canvas, white task surfaces, purple primary actions; cyan-blue focus.
- `public/refinement.css` owns shared refinement tokens and responsive overrides.
  Existing structural, ordering and feedback styles remain earlier in the cascade.
- DM Sans body and Manrope headings preserve existing typography. Do not substitute
  the logo's lettering with text or claim an official webfont has been supplied.
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
