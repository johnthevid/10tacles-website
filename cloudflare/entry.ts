import html from '../site.html';
import { authenticate, AccessError } from './access.mjs';
import { demoApi } from './demo-api';

export default {
  async fetch(request: Request, env: any) {
    try {
      // Public simulation has its own board; authenticated demo data stays private.
      const publicDemo = env.PUBLIC_DEMO === 'true';
      const owner = publicDemo ? 'public-demo-v1' : await authenticate(request, env);
      const url = new URL(request.url);
      if (url.pathname === '/api/demo') return demoApi(request, env.DB, owner);
      if (url.pathname === '/signin-with-chatgpt') return Response.redirect(`${url.origin}/`, 303);
      if (!['GET', 'HEAD'].includes(request.method)) return new Response('Method not allowed', { status: 405 });
      if (url.pathname === '/') {
        let page = html.replaceAll('ChatGPT account', 'Cloudflare Access email')
          .replaceAll('/signin-with-chatgpt?return_to=%2F', '/');
        if (publicDemo) page = page
          .replace('Private shared demo · same account on all phones · no real payments', 'PUBLIC DEMO · Sample details lang · Walang totoong bayad')
          .replace('Orders now sync online across phones signed into the SAME Cloudflare Access email.', 'Orders sync across all phones without signing in.')
          .replace('This is a private operations simulation, not separate production staff/customer accounts.', 'Anyone with this link can use Customer, Kitchen, and Rider and change demo orders.')
          .replace('Shared backend is active for this private demo.', 'Everyone shares this public demo board.')
          .replace('Role buttons simulate operations within your own account.', 'All roles are open for testing. Sample details only.')
          .replace('Sign in with the same Cloudflare Access email on all phones. Different accounts have different demo boards.', 'No login needed. All devices share the same test orders. Do not enter real names, addresses, phone numbers, or payment details.');
        return new Response(request.method === 'HEAD' ? null : page, { headers: {
          'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store',
          'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'same-origin'
        } });
      }
      const asset = await env.ASSETS.fetch(request);
      // Keep shared managed-Site assets intact; tailor only standalone login copy.
      if (url.pathname === '/shared.js' && asset.ok && request.method === 'GET') {
        const headers = new Headers(asset.headers); headers.delete('content-length'); headers.delete('etag');
        headers.set('Cache-Control', 'no-store');
        return new Response((await asset.text()).replaceAll('ChatGPT account', 'Cloudflare Access email'), { headers });
      }
      const headers = new Headers(asset.headers); headers.set('Cache-Control', 'private, no-store');
      return new Response(asset.body, { status: asset.status, headers });
    } catch (e) {
      const status = e instanceof AccessError ? e.status : 503;
      const error = e instanceof AccessError ? e.message : 'Staging is temporarily unavailable.';
      return Response.json({ error }, { status, headers: { 'Cache-Control': 'no-store' } });
    }
  }
};
