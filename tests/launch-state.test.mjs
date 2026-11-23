import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { isMenuOnly, closedOrderingResponse } from '../cloudflare/launch-state.mjs';

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
test('homepage ships the masterlist menu and no ordering controls', async () => {
  const html = await readFile(new URL('../site.html', import.meta.url), 'utf8');
  const menu = JSON.parse(await readFile(new URL('../data/menu.json', import.meta.url), 'utf8'));
  const peso = (n) => '₱' + n.toLocaleString('en-US');
  for (const s of menu.signature.sizes) assert.ok(html.includes(peso(s.price)), `missing ${s.size}`);
  for (const c of menu.categories) {
    assert.ok(html.includes(`id="cat-${c.id}"`), `missing category ${c.id}`);
    for (const [name, , price] of c.items) {
      const escaped = name.replace(/&/g, '&amp;');
      assert.ok(html.includes(`${escaped}</p>`) && html.includes(peso(price)), `missing ${name}`);
    }
  }
  assert.ok(html.includes('<span class="h1-line">Seafood</span>') && html.includes('h1-accent">Sarap</span>'));
  assert.ok(html.includes('datetime="2026-12-08"'));
  assert.ok(html.includes('Coming soon'), 'delivery partners stay labelled coming soon until links are confirmed');
  for (const banned of ['app.js', 'Add to bag', 'Checkout', 'INTERACTIVE DEMO', '/api/']) assert.ok(!html.includes(banned), banned);
});
