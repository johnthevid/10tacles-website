// Fills the generated regions of site.html from data/menu.json and data/business.json.
// Run after changing either file: node scripts/build-home.mjs
import { readFile, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const read = async (p) => JSON.parse(await readFile(new URL(p, root), 'utf8'));
const menu = await read('data/menu.json');
const biz = await read('data/business.json');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const peso = (n) => '₱' + Number(n).toLocaleString('en-US');
const icon = (d) => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
const ICONS = {
  pin: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  out: '<path d="M14 5h5v5M19 5l-8 8M18 14v5H5V6h5"/>'
};

const cats = [{ id: 'signature', label: '10TACLES' }, ...menu.categories];
const catsHtml = cats.map((c) => `<a href="#cat-${c.id}" data-cat="${c.id}">${esc(c.label)}</a>`).join('\n        ');

const PERSON = '<svg viewBox="0 0 16 20"><circle cx="8" cy="5" r="3.6"/><path d="M1.5 19.5c0-4.2 2.9-7 6.5-7s6.5 2.8 6.5 7z"/></svg>';
const people = (serves) => { const n = Number((serves.match(/\d+/) || [])[0]); return n ? PERSON.repeat(n) : PERSON.repeat(3) + '<span class="plus">+</span>'; };
const sig = menu.signature;
const sigHtml = `<section class="menu-panel" id="cat-signature" aria-labelledby="sig-title" data-cat-panel="signature">
          <article class="signature">
            <div class="signature-visual">
              <img src="assets/home/squid-single-520.webp" srcset="assets/home/squid-single-520.webp 494w, assets/home/squid-single-1040.webp 987w" sizes="(min-width: 1080px) 30vw, 70vw" width="987" height="1040" loading="lazy" decoding="async" alt="Isang 10TACLES deep-fried squid sa stick">
              <span class="badge">Signature</span>
            </div>
            <div class="signature-body">
              <h3 id="sig-title">${esc(sig.name)}</h3>
              <p>${esc(sig.description)}</p>
              <ul class="sizes" role="list">
${sig.sizes.map((s, i) => `                <li class="size size-${i + 1}"><span class="size-people" aria-hidden="true">${people(s.serves)}</span><span class="size-name">${esc(s.size)}</span><span class="size-serves">${esc(s.serves)}</span><span class="price">${peso(s.price)}</span></li>`).join('\n')}
              </ul>
            </div>
          </article>
        </section>`;

const panels = menu.categories.map((c) => `<section class="menu-panel" id="cat-${c.id}" aria-labelledby="h-${c.id}" data-cat-panel="${c.id}">
          <h3 id="h-${c.id}">${esc(c.label)}</h3>
          <ul class="menu-list" role="list">
${c.items.map(([name, variant, price]) => `            <li><div><p class="item-name">${esc(name)}</p>${variant ? `<p class="item-variant">${esc(variant)}</p>` : ''}</div><p class="price">${peso(price)}</p></li>`).join('\n')}
          </ul>
        </section>`).join('\n        ');

const partner = (name, url) => url
  ? `<li><span class="partner-name">${name}</span><a class="partner-status is-live" href="${esc(url)}" rel="noopener" target="_blank">Order sa ${name} ${icon(ICONS.out)}<span class="sr-only"> (opens in a new tab)</span></a></li>`
  : `<li><span class="partner-name">${name}</span><span class="partner-status"><span class="dot" aria-hidden="true"></span>Coming soon</span></li>`;
const anyLive = biz.grabFoodUrl || biz.foodpandaUrl;
const deliveryHtml = `<p>${anyLive ? 'Pwede nang ma-order online. Piliin ang app mo:' : 'Inaayos pa namin ang online ordering. Ilalagay namin dito ang links kapag live na.'}</p>
      <ul class="partners" role="list">
        ${partner('GrabFood', biz.grabFoodUrl)}
        ${partner('foodpanda', biz.foodpandaUrl)}
      </ul>`;

const fact = (ic, term, value, fallback) => `<div class="fact">${icon(ICONS[ic])}<dt>${term}</dt><dd${value ? '' : ' class="is-pending"'}>${value ? value : fallback}</dd></div>`;
const visitHtml = `<dl class="visit-facts">
      ${fact('pin', 'Address', esc(biz.streetAddress ? `${biz.streetAddress}, ${biz.locality}` : biz.locality) + (biz.streetAddress ? '' : '<span class="pending-note">Exact address: ia-post namin dito.</span>'), '')}
      ${fact('clock', 'Oras', biz.hours ? esc(biz.hours) : `Grand opening: ${esc(biz.openingLabel)}<span class="pending-note">Daily hours: ia-post namin dito.</span>`, '')}
      ${fact('phone', 'Contact', [biz.phone && `<a href="tel:${esc(biz.phone.replace(/[^+\d]/g, ''))}">${esc(biz.phone)}</a>`, biz.facebookUrl && `<a href="${esc(biz.facebookUrl)}" rel="noopener" target="_blank">Facebook page<span class="sr-only"> (opens in a new tab)</span></a>`].filter(Boolean).join('<br>'), 'Number at Facebook page: ia-post namin dito.')}
    </dl>`;
const actions = [biz.phone && `<a class="btn btn-outline" href="tel:${esc(biz.phone.replace(/[^+\d]/g, ''))}">Call store</a>`, biz.mapUrl && `<a class="btn btn-primary" href="${esc(biz.mapUrl)}" rel="noopener" target="_blank">Get directions<span class="sr-only"> (opens in a new tab)</span></a>`].filter(Boolean);
const visitActions = `<div class="visit-actions">${actions.length ? actions.join('') : '<a class="btn btn-primary" href="#menu">View menu</a>'}</div>`;

const jsonld = {
  '@context': 'https://schema.org', '@type': 'Restaurant', name: biz.name, servesCuisine: ['Seafood', 'Filipino'],
  slogan: 'Seafood Sarap!', priceRange: '₱20–₱999',
  address: { '@type': 'PostalAddress', addressLocality: 'Tanza', addressRegion: 'Cavite', addressCountry: 'PH', ...(biz.streetAddress ? { streetAddress: biz.streetAddress } : {}) },
  ...(biz.phone ? { telephone: biz.phone } : {})
};
const jsonldHtml = `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>`;

let html = await readFile(new URL('site.html', root), 'utf8');
const fill = (key, value) => {
  const re = new RegExp(`<!-- ${key}:start -->[\\s\\S]*?<!-- ${key}:end -->`);
  if (!re.test(html)) throw new Error(`Missing region ${key} in site.html`);
  html = html.replace(re, () => `<!-- ${key}:start -->${value}<!-- ${key}:end -->`);
};
fill('jsonld', jsonldHtml);
fill('cats', `\n        ${catsHtml}\n        `);
fill('menu', `\n        ${sigHtml}\n        ${panels}\n        `);
fill('delivery', `\n      ${deliveryHtml}\n      `);
fill('visit', `\n    ${visitHtml}\n    `);
fill('visit-actions', visitActions);
await writeFile(new URL('site.html', root), html);
const count = menu.signature.sizes.length + menu.categories.reduce((n, c) => n + c.items.length, 0);
console.log(`site.html updated: ${count} menu lines in ${cats.length} categories.`);
