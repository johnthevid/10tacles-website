import D from './domain.mjs';

export type Board={orders:any[],commands:{id:string,hash:string}[]};
export class DemoError extends Error{status:number;constructor(message:string,status=400){super(message);this.status=status}}
export const blank=():Board=>({orders:[],commands:[]});
const actions=new Set(['submitPayment','verify','reject','ready','assign','unassign','pickup','position','deliver','eta','cancel','customerCancel','refund']);
export async function digest(input:unknown){const bytes=new TextEncoder().encode(JSON.stringify(input));return [...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(n=>n.toString(16).padStart(2,'0')).join('')}
export async function applyCommand(board:Board,body:any,now=Date.now()){
 if(!body||typeof body!=='object'||typeof body.requestId!=='string'||! /^[a-zA-Z0-9-]{16,80}$/.test(body.requestId))throw new DemoError('Invalid request identifier.');
 const {action,id,data={}}=body;
 if(typeof action!=='string'||!data||typeof data!=='object'||Array.isArray(data))throw new DemoError('Invalid action.');
 const hash=await digest({action,id:id||null,data});
 const prior=board.commands.find(c=>c.id===body.requestId);
 if(prior){if(prior.hash!==hash)throw new DemoError('This request identifier was already used for different details.',409);return {board,duplicate:true}}
 const next=structuredClone(board);
 if(action==='create'){
   const existing=next.orders.find(o=>o.id===body.requestId);
   if(existing){if(existing.requestHash!==hash)throw new DemoError('Order identifier conflict.',409);return {board,duplicate:true}}
   if(next.orders.length>=100)throw new DemoError('Demo board limit reached (100 orders). Export notes and reset the demo board.',409);
   const order=D.newOrder(next,data,now,body.requestId);order.requestHash=hash;
 }else if(action==='reset'){
   if(data.confirm!=='RESET SHARED DEMO')throw new DemoError('Confirm the shared demo reset.');next.orders=[];
 }else{
   if(!actions.has(action)||typeof id!=='string')throw new DemoError('Unknown demo action.');
   D.dispatch(next,id,action,data,now);
 }
 next.commands.push({id:body.requestId,hash});next.commands=next.commands.slice(-300);
 return {board:next,duplicate:false};
}
