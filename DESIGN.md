# 10TACLES website design

Source of truth: the **10TACLES Brand Design System** canvas
(https://claude.ai/artifact/4yPsM71mGD59MwoChGVhBJ). This file records how the website applies it.
Tokens live at the top of `site/styles.css`.

## Color (screen values of the CMYK spec)

| Token | Hex | Use on the web |
| --- | --- | --- |
| Squid Purple | `#6A2F90` | Primary buttons, section pills, item names, prices |
| Deep Ink | `#3E2557` | Text, domes, badges, info panel, footer |
| Tentacle Plum | `#502A6A` | Inner dome, pressed/hover on dark |
| Lavender | `#8D599F` | Smallest size tier |
| Wave Blue | `#27AAE1` | Small accents only: NEW tag, open-now dot, focus ring. Never a fill behind text blocks |
| Grid Lilac | `#BDB6DB` | The graph-paper grid |
| Mist | `#E8E6F4` | Chips, hairlines |
| Paper | `#FAFAF4` | Page ground |

Proportion: about 55% Paper + grid, 25% Squid Purple, 15% Deep Ink, 5% Wave.

## Type

- **Oswald 700, caps**: display headlines (hero, section titles), arched footer type. Oswald 600 for info-panel heads.
- **Urbanist** (free stand-in for Gilroy): everything else. Item names 800, descriptors 300,
  eyebrow 200 italic caps, body 400 at 1.45.
- **Prices**: ₱ in 800, number in 300 italic.
- Fonts are self-hosted in `site/fonts/` (OFL, notices included).

## Signature elements used

Grid (32 px cells) behind the hero and menu · Dome (Deep Ink with Plum inner) under the hero squid
and in the footer · Section pills · Size tiers light→dark = small→big · Info panel with the
24/24/24/70 corner · Badge · Arched type (footer only) · Hero cutout with soft purple shadow.

## Rules kept

Buttons and chips ≥ 44–48 px tall · visible focus ring · reduced motion turns off the hero entrance
and card lift · no captions under food photos · the logo is never recolored.
