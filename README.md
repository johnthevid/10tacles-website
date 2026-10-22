# 10Tacles Seafood Kitchen — workflow demo

Responsive buildless customer, kitchen and rider demo. Serve `dist` with any static HTTP server. Menu imagery comes from the restaurant's supplied local menu images. The six seafood test dishes and prices require confirmation before real use.

Use the workspace buttons to test: customer checkout → simulated payment reference → kitchen verification → cooking/ready → rider assignment → pickup/position simulation → delivery. Standard orders may share a two-stop trip in one test zone. Priority delivery requires an exclusive trip. Submitted and verified payment cancellations enter reconciliation review.

Data is stored under `10tacles-demo-v1` in this browser's localStorage. Tabs of the same browser can receive storage updates. Different devices and browser profiles do not sync. The role switch is not authentication; all data is sample data. Real payment collection, uploads, secure roles, server storage, road routing, actual coverage and GPS are not connected. Demo rates and distances are unapproved examples. No cash-on-delivery option is offered.

Run `node --test tests/domain.test.cjs` for workflow checks, and `node --check dist/app.js` for script syntax. See `LAUNCH-PLAN.md` for the production pilot scope and dependencies.
