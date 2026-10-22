# 10Tacles Seafood Kitchen — direct ordering pilot

Confirmed direction: one restaurant serving Tanza and selected outskirts; own motorcycles; customer and rider web experiences; staff verifies full payment before cooking. Payment details and actual service boundaries are intentionally unconfigured. The current release is a same-browser workflow demo, not a live ordering service.

## Pilot scope

One responsive application with three entry points sharing a server-side order database: customer ordering and tracking; protected staff payment/dispatch desk; protected rider assignments. Separate native apps are unnecessary for the first pilot. Production roles must be authorized on every API operation; a UI role switch is only suitable for demos.

Customer workflow: menu → check delivery area → lock price/fee quote → checkout → payment instructions → submit reference/proof → staff confirmation → cooking → ready → rider pickup → delivery. Separate payment state from fulfillment state. No automatic cooking from a receipt screenshot or customer assertion.

Payment workflow: show the owner's confirmed receiving QR and account name, exact payable amount and unique order reference. Staff must check funds actually received using their own payment account, and match amount/reference; proof upload is supporting evidence only. Store who verified and when. Duplicate reference checks, retry-safe submissions and audit records are necessary. Unmatched/late payments go to review; cancellation after submission or verification requires reconciliation/refund handling. Never mark actual money refunded from a UI click alone. Confirm account suitability and limits with the provider before accepting real sales. Cards and automatic QR reconciliation are later integrations that require provider onboarding and credentials.

Dispatch: begin with staff assigning riders. Standard trips may group at most two nearby orders, subject to capacity and food readiness; priority trips are exclusive. Enforce exclusivity on the server transactionally. Once a trip has departed, do not append stops. For an initial pilot, single-order trips are a sensible operational default until real delivery tests establish timing and capacity. The current demo also exercises two-stop grouping.

Coverage and fees: obtain the exact restaurant pickup coordinates and agreed coverage polygon/barangays. Validate a customer's pin against service boundaries server-side, with an address/landmark fallback reviewed by staff. Use road-route distance, not straight-line distance, for a mileage quote. Confirm base fee, included distance, rounding, outer-area treatment and priority surcharge. Show and retain the exact accepted quote. Current test zones use fixed 2/5/8 km examples; rates of PHP40 for 2 km, PHP10/additional km, and PHP40 priority are unapproved demonstration values only.

Rider location: first pilot can work with explicit pickup/on-the-way/delivered updates. Live GPS needs rider consent, location timestamps, stale-location indicators, and visibility limited to the assigned customer during the active delivery. Mobile web background tracking is not a reliable continuous tracking solution; evaluate actual rider devices before promising background location. The demo collects no GPS and uses a labeled schematic simulation.

## Engineering needed before real orders

- Shared structured storage for menu, quotes, orders, items, payments, order events, riders, trips, stops, and roles. Private object storage if payment evidence is introduced.
- Server-authoritative prices, coverage, quote expiry, stock and availability; staff hours/pause controls; a preparation estimate rather than a guaranteed arrival time.
- Customer order access via authenticated identity or a deliberately designed private tracking mechanism. Staff/rider accounts with server-side permissions. Never expose all orders through a customer API.
- Transactional/idempotent order creation, payment verification and dispatch; optimistic concurrency or conditional updates to prevent double assignment and duplicate cooking.
- Clear cancellation, reconciliation, refund and failed-delivery procedures agreed by the owner.
- Input limits, upload checks if enabled, restricted access to contact/address/proof data, appropriate retention, error handling, recovery, and backups/export.
- Production hosting/audience setup and real-device end-to-end verification. The current private Sites deployment and browser-local data are for review.

## Proposed four-day pilot sequence

This is a planning target after configuration is supplied, not an unconditional launch guarantee.

1. Confirm menu, pickup pin, hours, coverage, fee rules and prepaid policy; implement customer ordering and shared server storage.
2. Secure staff/rider roles, manual payment review, audit history, kitchen availability and dispatch; test authorization and state transitions.
3. Exercise checkout/payment retries, outside-area rejection, sold-out items, delayed payments, cancellation/refund review, rider capacity and cross-device delivery updates.
4. Run a small controlled set of test orders and actual motorcycle routes, reconcile the payment log, fix failures, then decide whether to accept a limited number of real orders.

Defer card acceptance, automated route optimization, promotions, loyalty, native apps and continuous background GPS until the basic paid-order-to-delivery process is proven.

## Demo acceptance cases

No cooking before verification; no duplicate reference; outside test coverage blocked; totals recalculate with zone and priority; full trip pickup updates both stops; priority never batches; customer cannot change submitted payments; wrong demo rider cannot deliver; cancellation with uncertain/verified payment requires reconciliation; activity history survives reload in this browser.

The demo's Node domain tests cover these workflow invariants. They do not establish secure authentication, real payment processing, cross-device synchronization or real-world coverage.
