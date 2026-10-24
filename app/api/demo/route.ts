import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '../../chatgpt-auth';
import {blank,applyCommand,DemoError} from '../../../lib/demo-service';
export const dynamic='force-dynamic';
const respond=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
async function identity(){const user=await getChatGPTUser();return user?.userId||null}
async function load(owner:string){const db=env.DB;if(!db)throw new DemoError('Shared database is not configured.',503);await db.prepare('INSERT OR IGNORE INTO demo_boards (owner,payload,version,updated_at) VALUES (?,?,0,?)').bind(owner,JSON.stringify(blank()),Date.now()).run();return await db.prepare('SELECT payload,version,updated_at FROM demo_boards WHERE owner=?').bind(owner).first<{payload:string,version:number,updated_at:number}>()}
export async function GET(){try{const owner=await identity();if(!owner)return respond({error:'Sign in to your same ChatGPT account on each demo phone.'},401);const row=await load(owner);return respond({orders:JSON.parse(row!.payload).orders,version:row!.version,updatedAt:row!.updated_at})}catch(e){return failure(e)}}
export async function POST(request:Request){try{
 const owner=await identity();if(!owner)return respond({error:'Sign in before changing demo orders.'},401);
 const origin=request.headers.get('origin');if(!origin||origin!==new URL(request.url).origin)return respond({error:'Cross-site changes are not allowed.'},403);
 if(!request.headers.get('content-type')?.includes('application/json'))return respond({error:'Send JSON only.'},415);
 const contentLength=Number(request.headers.get('content-length')||0);if(contentLength>16384)return respond({error:'Request is too large.'},413);
 const text=await request.text();if(new TextEncoder().encode(text).length>16384)return respond({error:'Request is too large.'},413);
 let body;try{body=JSON.parse(text)}catch{return respond({error:'Invalid JSON.'},400)}
 // One authenticated owner has one private demo board. Role buttons simulate roles;
 // they are deliberately not presented as production staff authorization.
 for(let attempt=0;attempt<5;attempt++){
  const row=await load(owner);const result=await applyCommand(JSON.parse(row!.payload),body);
  if(result.duplicate)return respond({orders:result.board.orders,version:row!.version,updatedAt:row!.updated_at,duplicate:true});
  const now=Date.now();const changed=await env.DB!.prepare('UPDATE demo_boards SET payload=?,version=version+1,updated_at=? WHERE owner=? AND version=?').bind(JSON.stringify(result.board),now,owner,row!.version).run();
  if(changed.meta.changes===1)return respond({orders:result.board.orders,version:row!.version+1,updatedAt:now});
 }
 return respond({error:'Another phone updated the board. Please retry.'},409);
}catch(e){return failure(e)}}
function failure(e:unknown){if(e instanceof DemoError)return respond({error:e.message},e.status);if(e instanceof Error&& !/D1|SQLITE|database|binding|internal/i.test(e.message))return respond({error:e.message},422);console.error('Shared demo database request failed');return respond({error:'Unable to save or load the shared demo right now. Please retry.'},503)}
