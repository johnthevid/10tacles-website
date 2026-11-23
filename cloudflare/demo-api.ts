import { blank, applyCommand, DemoError } from '../lib/demo-service';

const json = (data: unknown, status = 200) => Response.json(data, {
  status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }
});
export async function demoApi(request: Request, db: D1Database, owner: string) {
  try {
    if (!db) return json({ error: 'Shared database is not configured.' }, 503);
    if (!['GET', 'POST'].includes(request.method)) return json({ error: 'Method not allowed.' }, 405);
    let body;
    if (request.method === 'POST') {
      if (request.headers.get('origin') !== new URL(request.url).origin) return json({ error: 'Cross-site changes are not allowed.' }, 403);
      if (!request.headers.get('content-type')?.includes('application/json')) return json({ error: 'Send JSON only.' }, 415);
      if (Number(request.headers.get('content-length') || 0) > 16384) return json({ error: 'Request too large.' }, 413);
      // Bound chunked requests too, before allocating the whole request body.
      const reader = request.body?.getReader();
      if (!reader) return json({ error: 'Missing command.' }, 400);
      const chunks: Uint8Array[] = []; let length = 0;
      while (true) {
        const { done, value } = await reader.read(); if (done) break;
        length += value.length;
        if (length > 16384) { await reader.cancel(); return json({ error: 'Request too large.' }, 413); }
        chunks.push(value);
      }
      const bytes = new Uint8Array(length); let offset = 0;
      for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
      try { body = JSON.parse(new TextDecoder().decode(bytes)); } catch { return json({ error: 'Invalid JSON.' }, 400); }
    }
    await db.prepare('INSERT OR IGNORE INTO demo_boards (owner,payload,version,updated_at) VALUES (?,?,0,?)')
      .bind(owner, JSON.stringify(blank()), Date.now()).run();
    for (let attempt = 0; attempt < 5; attempt++) {
      const row = await db.prepare('SELECT payload,version,updated_at FROM demo_boards WHERE owner=?')
        .bind(owner).first<{ payload: string, version: number, updated_at: number }>();
      if (!row) throw new Error('Missing board');
      const board = JSON.parse(row.payload);
      if (request.method === 'GET') return json({ orders: board.orders, version: row.version, updatedAt: row.updated_at });
      const result = await applyCommand(board, body);
      if (result.duplicate) return json({ orders: result.board.orders, version: row.version, updatedAt: row.updated_at, duplicate: true });
      const now = Date.now();
      const changed = await db.prepare('UPDATE demo_boards SET payload=?,version=version+1,updated_at=? WHERE owner=? AND version=?')
        .bind(JSON.stringify(result.board), now, owner, row.version).run();
      if (changed.meta.changes === 1) return json({ orders: result.board.orders, version: row.version + 1, updatedAt: now });
    }
    return json({ error: 'Another phone updated the board. Please retry.' }, 409);
  } catch (e) {
    if (e instanceof DemoError) return json({ error: e.message }, e.status);
    return json({ error: 'Unable to load or save orders. Please reconnect and retry.' }, 503);
  }
}
