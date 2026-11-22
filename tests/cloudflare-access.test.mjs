import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPair, SignJWT } from 'jose';
import { authenticate } from '../cloudflare/access.mjs';

const keys = await generateKeyPair('RS256');
const env = { ACCESS_TEAM_DOMAIN: 'demo.cloudflareaccess.com', ACCESS_AUD: 'test-app', ACCESS_EMAIL: 'owner@example.com' };
async function token(options = {}, key = keys.privateKey) {
  return new SignJWT({ email: 'owner@example.com', ...options.claims }).setProtectedHeader({ alg: 'RS256' })
    .setSubject('owner-id').setIssuer(options.issuer || 'https://demo.cloudflareaccess.com')
    .setAudience(options.audience || 'test-app').setIssuedAt()
    .setExpirationTime(options.exp || '5m').sign(key);
}
const request = jwt => new Request('https://demo.test/api/demo', { headers: jwt ? { 'Cf-Access-Jwt-Assertion': jwt } : {} });
test('valid signed Access token identifies the shared owner', async () => {
  assert.equal(await authenticate(request(await token()), env, keys.publicKey), 'access:demo.cloudflareaccess.com:owner-id');
});
test('missing configuration fails closed', async () => {
  await assert.rejects(authenticate(request(), {}, keys.publicKey), e => e.status === 503);
});
test('spoofed platform headers cannot authenticate', async () => {
  const req = new Request('https://demo.test', { headers: { 'oai-authenticated-user-id': 'owner-id', 'oai-authenticated-user-email': env.ACCESS_EMAIL } });
  await assert.rejects(authenticate(req, env, keys.publicKey), e => e.status === 401);
});
test('wrong audience, issuer, expiry, signature, and email are rejected', async () => {
  const other = await generateKeyPair('RS256');
  for (const jwt of [await token({ audience: 'other' }), await token({ issuer: 'https://evil.test' }),
    await token({ exp: '0s' }), await token({}, other.privateKey), await token({ claims: { email: 'other@example.com' } })]) {
    await assert.rejects(authenticate(request(jwt), env, keys.publicKey), e => [401, 403].includes(e.status));
  }
});
