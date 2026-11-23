import { createRemoteJWKSet, jwtVerify } from 'jose';

const keySets = new Map();
export class AccessError extends Error {
  constructor(message, status) { super(message); this.status = status; }
}
export async function authenticate(request, env, verificationKey) {
  const team = env.ACCESS_TEAM_DOMAIN;
  const audience = env.ACCESS_AUD;
  const email = env.ACCESS_EMAIL;
  if (!team || !/^[a-z0-9-]+\.cloudflareaccess\.com$/.test(team) || !audience || !email) {
    throw new AccessError('Staging login configuration is incomplete.', 503);
  }
  const token = request.headers.get('Cf-Access-Jwt-Assertion');
  if (!token) throw new AccessError('Please sign in through Cloudflare Access.', 401);
  const issuer = `https://${team}`;
  if (!verificationKey && !keySets.has(team)) {
    keySets.set(team, createRemoteJWKSet(new URL(`${issuer}/cdn-cgi/access/certs`)));
  }
  let payload;
  try {
    ({ payload } = await jwtVerify(token, verificationKey || keySets.get(team), {
      issuer, audience, algorithms: ['RS256'], requiredClaims: ['exp', 'iat', 'sub', 'email']
    }));
  } catch { throw new AccessError('Your demo session is invalid or expired. Sign in again.', 401); }
  if (typeof payload.sub !== 'string' || !payload.sub || typeof payload.email !== 'string' ||
      payload.email.toLowerCase() !== email.trim().toLowerCase()) {
    throw new AccessError('This account is not allowed into the private demo.', 403);
  }
  // Inbound oai-* identity headers are never read on this standalone deployment.
  return `access:${team}:${payload.sub}`;
}
