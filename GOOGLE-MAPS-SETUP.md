# Google Maps and rider GPS setup

Current release: map and GPS adapters are prepared, but real Maps requests and GPS collection are not enabled. `dist/maps-config.js` deliberately has an empty key and `liveTrackingEnabled: false`. The app still stores demo orders in one browser. Do not use it to collect riders' real positions before shared storage and server-side authorization exist.

## Google Cloud setup

1. Create/select your Google Cloud project. For production Maps JavaScript API use, configure the billing account and enable Maps JavaScript API. Do not put a payment card or account password into this app.
2. Create a **browser** API key. Restrict application use to **Websites (HTTP referrers)**. Allow `https://tendril-delivery-jd.swoonyclove8.chatgpt.site/*` and only the approved production/custom domains. Add exact localhost origins only for development.
3. Restrict the key's APIs to **Maps JavaScript API**. Browser keys are delivered to the browser by design; referrer and API restrictions are required. Never reuse a private server credential.
4. Set appropriate quotas and billing alerts in Google Cloud. Alerts are not hard spending caps; verify quota controls separately.
5. Set `browserApiKey` in `dist/maps-config.js`. Use a production map ID if configured; the adapter falls back to Google's `DEMO_MAP_ID` for development. Retain `liveTrackingEnabled: false` until the backend and role checks are ready.
6. Publish and verify the correct domain, key restrictions, error states and the map on actual rider/customer devices. An API key alone does not turn on cross-device tracking.

Official setup: https://developers.google.com/maps/documentation/javascript/get-api-key
Security: https://developers.google.com/maps/api-security-best-practices

## What the prepared code does

`dist/maps.js` exposes `TenTaclesMaps.mount({container, fix, statusElement})`. A fix contains `latitude`, `longitude`, `accuracy` (meters), and `timestamp` (milliseconds). The adapter lazy-loads Google's script only when explicitly called, draws a rider marker and accuracy circle, and labels readings older than 60 seconds as last known location. Keep Google's attribution visible. `update(fix)` accepts a new valid reading; `destroy()` releases markers, interval and view content.

`createGpsTracker({onPosition, onError})` provides explicit `start()` and `stop()` methods around browser `watchPosition`. It requests high accuracy but cannot guarantee accuracy. It is not called by the current demo. Start must follow an explicit rider action and browser permission. It must run on HTTPS (or a permitted localhost context). Stop on logout, trip completion, leaving rider mode, or permission loss. Continuous background tracking is not guaranteed on mobile web; test actual devices and do not market it as always-on.

## Shared backend work required

- Authenticate riders and customers. Authorize every location read/write on the server against the current trip and order. Never trust the demo's role switch.
- Store an active trip's latest accepted GPS fix with server receipt time, rider ID and trip ID. Validate coordinates, timestamps, accuracy, assignment and reasonable update rate server-side.
- A rider uploads their own active-trip readings; the customer can only access the rider location for their own active delivery. Do not expose home/off-duty locations, other customers or all rider routes.
- Use HTTPS APIs with polling or authorized push updates. Distinguish GPS sample time from upload/receipt time. Handle stale samples, lost connectivity and denied permissions. End tracking and remove customer access after delivery/cancellation.
- Add the rider's explicit Start/Stop sharing controls and a clear active-sharing indicator. Wire the GPS adapter to that API, not to localStorage. Apply an agreed retention/deletion policy.
- Use a separate routing integration for road-distance quotes and ETA. The map marker alone does not calculate delivery mileage or validate coverage. Do not send addresses or route requests to third parties until those flows are configured.

No paid account was created, no API key provisioned, no rider permission requested, and no real location was collected during this change.
