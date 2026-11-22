export const isMenuOnly = env => env.LAUNCH_MODE === 'menu-only';
export function closedOrderingResponse() {
  return Response.json({ error: 'Online ordering is not open yet.', orderingOpen: false }, {
    status: 503, headers: { 'Cache-Control': 'no-store', 'Retry-After': '3600' }
  });
}
export function menuOnlyPage(html) {
  return html.replace('<body>', '<body data-launch-state="menu-only">')
    .replace('direct ordering and delivery demo for Tanza.', 'seafood menu for Tanza.')
    .replace(/<div class="demo-bar">[\s\S]*?<\/div>/, '<button id="aboutDemo" hidden>About ordering</button>')
    .replace('Demo tools', 'Workspace')
    .replace('Connecting to shared demo…', 'Online ordering opens soon')
    .replace(/<section class="service-strip">[\s\S]*?<\/section>/, '<section class="launch-notice" role="status"><button id="areaButton" hidden>Delivery areas</button><strong>Online ordering opens soon.</strong><p>Browse our seafood menu. Prices and availability will be confirmed before ordering opens.</p></section>')
    .replace('Test menu · sample ordering lang muna', 'Seafood favorites from our kitchen')
    .replace('Demo & launch notes ↗', 'About ordering ↗')
    .replace(/<dialog id="detailsDialog"[\s\S]*?<\/dialog>/, '<dialog id="detailsDialog"><button class="close" data-close="detailsDialog" aria-label="Close information">×</button><h2>Ordering opens soon.</h2><p>You can browse our seafood menu while we prepare online ordering. Payments and deliveries cannot be booked through this website yet.</p></dialog>')
    .replace('<script src="app.js">', '<script src="launch.js"></script><script src="app.js">')
    .replace(/>([^<]*)</g, (_match, text) => '>' + text.replace(/\bdemo\b/gi, '').trim() + '<');
}
