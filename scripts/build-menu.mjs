// Writes the menu from data/menu.json into site/index.html.
// Run after changing prices or items:  node scripts/build-menu.mjs
// Only the text between the <!-- …:start --> and <!-- …:end --> markers is replaced.
import { readFileSync, writeFileSync } from 'node:fs';

const root = new URL('..', import.meta.url);
const data = JSON.parse(readFileSync(new URL('data/menu.json', root), 'utf8'));
const pagePath = new URL('site/index.html', root);
let page = readFileSync(pagePath, 'utf8');

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const slug = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const peso = n => `<span class="price"><b>₱</b><span>${n.toLocaleString('en-US')}</span></span>`;
const tagFor = t => (t === 'New' ? '<span class="tag tag-new">NEW</span>' : '');

// Group rows into items (one item can have several sizes / variants), keeping sheet order.
const byCategory = new Map();
for (const row of data.items) {
  if (!byCategory.has(row.category)) byCategory.set(row.category, []);
  const list = byCategory.get(row.category);
  let item = list.find(i => i.name === row.item);
  if (!item) list.push(item = { name: row.item, rows: [] });
  item.rows.push(row);
}

// --- Signature tiers ---
const tiers = (byCategory.get('Signature') || [])[0];
if (!tiers) throw new Error('No Signature item in data/menu.json');
const tiersHtml = tiers.rows.map(r =>
  `            <li class="tier"><span class="tier-name"><strong>${esc(r.variant.toUpperCase())}</strong><span>${esc((r.serves || '').replace(/^Good/, 'good').replace(/\s*\(.*\)$/, ''))}</span></span>${peso(r.price)}</li>`
).join('\n');

// --- Menu groups ---
const order = data.order.filter(c => byCategory.has(c));
const missing = [...byCategory.keys()].filter(c => c !== 'Signature' && !order.includes(c));
if (missing.length) throw new Error('Add these categories to "order" in data/menu.json: ' + missing.join(', '));

const label = c => c.replace(' – ', ': ');
const chips = order.map(c => `          <a href="#${slug(c)}">${esc(label(c))}</a>`).join('\n');

const photoGroups = [], boardGroups = [];
for (const c of order) {
  const items = byCategory.get(c);
  const allPhotos = items.every(i => data.photos[i.name]);
  if (allPhotos) {
    const wide = items.length <= 2 ? ' wide' : '';
    const cards = items.map(i => {
      const p = data.photos[i.name], r = i.rows[0];
      const sub = r.variant ? r.variant.toLowerCase() : '';
      return `          <article class="card">
            <div class="card-photo"><img src="${p.src}" alt="${esc(p.alt)}" width="${p.w}" height="${p.h}" loading="lazy">${tagFor(r.tag)}</div>
            <div class="card-body"><div class="card-name"><strong>${esc(i.name)}</strong>${sub ? `<span>${esc(sub)}</span>` : ''}</div>${peso(r.price)}</div>
          </article>`;
    }).join('\n');
    photoGroups.push(`      <div class="menu-group" id="${slug(c)}">
        <h3 class="pill">${esc(label(c))}</h3>
        <div class="cards${wide}">
${cards}
        </div>
      </div>`);
  } else {
    const rows = items.map(i => {
      const isNew = i.rows.some(r => r.tag === 'New');
      if (i.rows.length === 1) {
        const r = i.rows[0];
        return `            <li class="board-item"><span class="board-name"><strong>${esc(i.name)}</strong>${isNew ? ' <span class="tag tag-new">NEW</span>' : ''}${r.variant ? `<span>${esc(r.variant)}</span>` : ''}</span>${peso(r.price)}</li>`;
      }
      const variants = i.rows.map(r => `<li><span>${esc(r.variant)}</span>${peso(r.price)}</li>`).join('');
      return `            <li class="board-item board-multi"><span class="board-name"><strong>${esc(i.name)}</strong></span><ul class="board-variants">${variants}</ul></li>`;
    }).join('\n');
    boardGroups.push(`        <div class="board" id="${slug(c)}">
          <h3 class="pill">${esc(label(c))}</h3>
          <ul class="board-list">
${rows}
          </ul>
        </div>`);
  }
}

const menuHtml = `${photoGroups.join('\n\n')}

      <div class="boards">
${boardGroups.join('\n')}
      </div>`;

function replaceBetween(name, html) {
  const re = new RegExp(`(<!-- ${name}:start -->)[\\s\\S]*?(\\s*<!-- ${name}:end -->)`);
  if (!re.test(page)) throw new Error(`Marker ${name}:start / ${name}:end not found in site/index.html`);
  page = page.replace(re, `$1\n${html}$2`);
}
replaceBetween('tiers', tiersHtml);
replaceBetween('menu-chips', chips);
replaceBetween('menu', menuHtml);
writeFileSync(pagePath, page);

const count = data.items.length;
console.log(`Menu written: ${count} prices, ${order.length + 1} categories.`);
