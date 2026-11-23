// Provision the staging hostname before configuring Cloudflare Access.
// Never serve the app, assets, or database through this temporary entry point.
export default {
  async fetch() {
    return new Response('10Tacles staging is being configured. Ordering is not available yet.', {
      status: 503,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
        'Retry-After': '3600'
      }
    });
  }
};
