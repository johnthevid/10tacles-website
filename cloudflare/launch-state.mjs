export const isMenuOnly = env => env.LAUNCH_MODE === 'menu-only';
export function closedOrderingResponse() {
  return Response.json({ error: 'Online ordering is not open yet.', orderingOpen: false }, {
    status: 503, headers: { 'Cache-Control': 'no-store', 'Retry-After': '3600' }
  });
}
