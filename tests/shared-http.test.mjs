import {test} from 'node:test';import assert from 'node:assert/strict';
const base=process.env.DEMO_BASE_URL||'http://127.0.0.1:5173';
test('three clients share persisted orders; auth, CSRF, safe retries and concurrent writes work',{skip:!process.env.DEMO_HTTP_TEST},async()=>{
 assert.equal(new URL(base).hostname,'127.0.0.1','This test can reset only the local demo DB.');
 const unauth=await fetch(base+'/api/demo');assert.equal(unauth.status,401);
 const login=await fetch(base+'/signin-with-chatgpt?return_to=%2F',{redirect:'manual'});const cookies=login.headers.getSetCookie().map(x=>x.split(';')[0]).join('; ');assert.ok(cookies,'Local mock login must issue its development cookie.');
 const client=async(method,body,origin=base)=>{const response=await fetch(base+'/api/demo',{method,headers:{Cookie:cookies,Origin:origin,...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})});const text=await response.text();let json;try{json=JSON.parse(text)}catch{json={error:text}}return {status:response.status,json}};
 const id=()=>crypto.randomUUID(),command=(action,orderId,data={})=>({action,id:orderId,data,requestId:id()});
 const reset=command('reset',null,{confirm:'RESET SHARED DEMO'});assert.equal((await client('POST',reset,'https://wrong.example')).status,403);assert.equal((await client('POST',reset)).status,200);
 const data={cart:[{id:'shrimp',qty:1}],zone:'near',mode:'standard',name:'Demo Customer',phone:'09000000000',address:'Sample address'};
 const first=command('create',null,data),second=command('create',null,{...data,name:'Second demo'});
 const results=await Promise.all([client('POST',first),client('POST',second)]);results.forEach(r=>assert.equal(r.status,200,JSON.stringify(r.json)));
 let board=await client('GET');assert.equal(board.json.orders.length,2);assert.equal((await client('POST',first)).json.orders.length,2);
 const orderId=first.requestId;assert.equal((await client('POST',command('ready',orderId))).status,422);
 for(const [action,payload]of [['submitPayment',{reference:'DEMO-'+id().slice(0,20)}],['verify',{checked:true}],['ready',{}],['assign',{rider:'rider-1'}],['pickup',{rider:'rider-1'}],['deliver',{rider:'rider-1'}]]){const result=await client('POST',command(action,orderId,payload));assert.equal(result.status,200,JSON.stringify(result.json))}
 board=await client('GET');assert.equal(board.json.orders.find(o=>o.id===orderId).status,'delivered');assert.ok(board.json.version>=8);
});
