import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { isMenuOnly, closedOrderingResponse, menuOnlyPage } from '../cloudflare/launch-state.mjs';

test('menu-only mode is explicit', () => {
  assert.equal(isMenuOnly({ LAUNCH_MODE: 'menu-only' }), true);
  assert.equal(isMenuOnly({}), false);
});
test('closed ordering does not expose orders', async () => {
  const response = closedOrderingResponse();
  assert.equal(response.status, 503);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  const payload = await response.json();
  assert.equal(payload.orderingOpen, false);
  assert.equal('orders' in payload, false);
});
test('menu page removes banner and role instructions and loads launch controls first', async () => {
  const html = menuOnlyPage(await readFile(new URL('../site.html', import.meta.url), 'utf8'));
  assert.ok(html.includes('data-launch-state="menu-only"'));
  assert.ok(!html.includes('INTERACTIVE DEMO'));
  assert.ok(!html.includes('One kitchen. Three views.'));
  assert.ok(!html.includes('delivery demo for Tanza'));
  assert.ok(html.includes('Online ordering opens soon.'));
  assert.ok(html.indexOf('src="launch.js"') < html.indexOf('src="app.js"'));
});
