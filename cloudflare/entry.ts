import html from '../site.html';
import { authenticate, AccessError } from './access.mjs';
import { demoApi } from './demo-api';
import { isMenuOnly, closedOrderingResponse } from './launch-state.mjs';

export default {
  async fetch(request: Request, env: any) {
    try {
      // Public simulation has its own board; authenticated demo data stays private.
      const publicDemo = env.PUBLIC_DEMO === 'true';
      const owner = publicDemo ? 'public-demo-v1' : await authenticate(request, env);
      const url = new URL(request.url);
      if (isMenuOnly(env) && url.pathname.startsWith('/api/')) return closedOrderingResponse();
      if (url.pathname === '/api/demo') return demoApi(request, env.DB, owner);
      if (url.pathname === '/signin-with-chatgpt') return Response.redirect(`${url.origin}/`, 303);
      if (!['GET', 'HEAD'].includes(request.method)) return new Response('Method not allowed', { status: 405 });
      if (url.pathname === '/' || url.pathname === '/index.html') {
        // The public homepage is a static launch page; ordering stays closed (menu-only).
        return new Response(request.method === 'HEAD' ? null : html, { headers: {
          'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=300',
          'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin'
        } });
      }
      const asset = await env.ASSETS.fetch(request);
      // Keep shared managed-Site assets intact; tailor only standalone login copy.
      if (url.pathname === '/shared.js' && asset.ok && request.method === 'GET') {
        const headers = new Headers(asset.headers); headers.delete('content-length'); headers.delete('etag');
        headers.set('Cache-Control', 'no-store');
        return new Response((await asset.text()).replaceAll('ChatGPT account', 'Cloudflare Access email'), { headers });
      }
      const headers = new Headers(asset.headers);
      const longLived = /^\/(assets|fonts)\//.test(url.pathname);
      headers.set('Cache-Control', longLived ? 'public, max-age=604800' : 'public, max-age=300');
      return new Response(asset.body, { status: asset.status, headers });
    } catch (e) {
      const status = e instanceof AccessError ? e.status : 503;
      const error = e instanceof AccessError ? e.message : 'Staging is temporarily unavailable.';
      return Response.json({ error }, { status, headers: { 'Cache-Control': 'no-store' } });
    }
  }
};
