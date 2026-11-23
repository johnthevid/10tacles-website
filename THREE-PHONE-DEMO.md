# 10Tacles — three-phone operations demo

This version uses an online D1 database. It is a **private shared simulation**, not a real payment/production delivery service. All three phones must sign into the **same ChatGPT account that owns this Site**. Different accounts get separate boards and are not automatically allowed into the private site. Do not share passwords with staff; this setup is for your own three phones.

Open these links in each phone's normal browser:

| Device | Link |
|---|---|
| Customer | https://tendril-delivery-jd.swoonyclove8.chatgpt.site/?role=customer |
| Kitchen | https://tendril-delivery-jd.swoonyclove8.chatgpt.site/?role=staff |
| Rider Marco | https://tendril-delivery-jd.swoonyclove8.chatgpt.site/?role=rider&rider=rider-1 |

These links select a view; they are not separate staff credentials. Platform authentication protects the private app and API. All three demo views operate within your own authenticated account. Production staff/customer authorization remains future work.

## Before starting

1. Sign in with the owning ChatGPT account on all three phones. If sign-in sends you to the menu, reopen that phone's role link.
2. Confirm every phone shows the green **Shared demo connected** indicator. If not, use Sign in or Reconnect. Internet is required; the phones may use different Wi-Fi/mobile networks.
3. Keep browser tabs visible during the test. Updates poll about every 3 seconds. Returning from a locked/background phone refreshes the view; this is not a push-notification service.
4. Use sample names, addresses and phone numbers. Test area distances, fees and payment references are samples. No GPS permission is requested and no real payment is collected.
5. Old browser-only demo orders are not imported. The cart remains local to each browser; placed orders are shared. Reloading does not erase the shared orders.

## Run one full order

1. **Customer:** choose a test area, add seafood, select standard or priority, and place the demo order. The wave confirms a server-acknowledged order. The current-order island appears.
2. **Customer:** submit the prefilled sample payment reference. Wait for the payment-review state.
3. **Kitchen:** within about 3 seconds, find the same order number. Check the demo payment acknowledgment and choose **Approve & start cooking**. The customer should see **Niluluto na!**.
4. **Kitchen:** mark ready, then assign Marco. The rider phone should show the same order and customer details.
5. **Rider:** choose **Collect order & start trip**. The customer should see **Papunta na sa ’yo!**. Try the simulated position buttons; they update all views but are not real GPS.
6. **Rider:** mark the order delivered and confirm. The customer sees **Delivered na**; the order moves out of the active island and into history. Kitchen's delivered count updates.

## Extra tests to record

| Test | Expected result | Notes |
|---|---|---|
| Different networks | Same order on all three phones | |
| Refresh each phone | Shared order and latest status remain | |
| Lock/unlock rider phone | Refreshes when visible again | |
| Two simultaneous customer orders | Both saved; no lost order | |
| Standard batching | Up to two ready same-zone orders share a trip | |
| Priority | Cannot share an active rider trip | |
| Turn off one phone's internet | Connection warning; no false save confirmation | |
| Retry uncertain save | Retry pending action uses the same request ID | |
| Invalid/duplicate payment reference | Rejected or flagged; no cooking before verification | |
| Submitted/paid order cancelled | Requires reconciliation/refund review | |

If a save is not confirmed, keep the page open and use **Retry pending action** when connected. Do not place the same order again manually while its result is uncertain. Check order history after a reload.

**Reset demo data** in Kitchen removes the shared sample orders on all three phones for this account after confirmation. It does not move real money or clear another account's board. Record observations first.

## What was verified by development tests

Domain rules and GPS-input validators; shared command validation/idempotency; unauthenticated API rejection; cross-origin mutation rejection; concurrent creates; payment-to-delivery flow using independent HTTP clients and browser role views. The owner's three physical phones and their particular OS/browser versions still need the above hands-on run.
