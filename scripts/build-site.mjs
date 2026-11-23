// Builds the public launch site into dist/ for Cloudflare (Workers static assets).
// Cloudflare runs this through wrangler.jsonc's build.command (and `npm run build`).
import { cp, mkdir, rm, writeFile, readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

const root = new URL('../', import.meta.url);
const out = new URL('dist/', root);

// 1. Render menu and business details into site.html.
execFileSync(process.execPath, [new URL('scripts/build-home.mjs', root).pathname], { stdio: 'inherit' });

// 2. Fresh output folder holding only what the homepage uses.
await rm(out, { recursive: true, force: true });
await mkdir(new URL('fonts/', out), { recursive: true });
await cp(new URL('site.html', root), new URL('index.html', out));
for (const f of ['home.css', 'home.js', 'favicon.svg']) await cp(new URL(`public/${f}`, root), new URL(f, out));
for (const f of ['gilroy-heavy', 'gilroy-light', 'gilroy-mediumitalic', 'oswald-semibold']) {
  await cp(new URL(`public/fonts/${f}.woff2`, root), new URL(`fonts/${f}.woff2`, out));
}
await cp(new URL('public/assets/home/', root), new URL('assets/home/', out), { recursive: true });

// 3. Cache and security headers (Cloudflare static assets reads _headers).
await writeFile(new URL('_headers', out), `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/
  Cache-Control: public, max-age=300

/index.html
  Cache-Control: public, max-age=300

/home.css
  Cache-Control: public, max-age=3600

/home.js
  Cache-Control: public, max-age=3600

/assets/*
  Cache-Control: public, max-age=604800

/fonts/*
  Cache-Control: public, max-age=31536000, immutable
`);

// 4. Sanity check: every local file the page references exists in dist/.
const html = await readFile(new URL('index.html', out), 'utf8');
const css = await readFile(new URL('home.css', out), 'utf8');
const refs = new Set([
  ...[...html.matchAll(/(?:src|href)="([^"#:]+?)"/g)].map((m) => m[1]),
  ...[...html.matchAll(/srcset="([^"]+)"/g)].flatMap((m) => m[1].split(',').map((s) => s.trim().split(' ')[0])),
  ...[...css.matchAll(/url\("([^"]+)"\)/g)].map((m) => m[1])
]);
const { access } = await import('node:fs/promises');
const missing = [];
for (const r of refs) {
  if (/^(https?:|mailto:|tel:)/.test(r)) continue;
  try { await access(new URL(r.replace(/^\//, ''), out)); } catch { missing.push(r); }
}
if (missing.length) { console.error('Missing files in dist/:', missing); process.exit(1); }
console.log(`dist/ ready: ${refs.size} files referenced, all present.`);
