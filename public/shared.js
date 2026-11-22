'use strict';
let sharedVersion=-1,sharedBusy=false,sharedPending=null,sharedOnline=false,sharedPoll=null,sharedRefreshing=false;
function sharedStatus(message,kind='connecting'){
 const panel=document.getElementById('syncStatus');if(!panel)return;
 panel.dataset.kind=kind;panel.querySelector('span').textContent=message;
 panel.querySelector('a').hidden=kind!=='signin';
 const retry=panel.querySelector('button');retry.hidden=kind==='online';retry.textContent=sharedPending?'Retry pending action':'Reconnect';
 document.body.classList.toggle('shared-offline',kind!=='online');
}
function applyShared(result){
 if(!result||!Array.isArray(result.orders)||!Number.isInteger(result.version))throw new Error('Invalid shared demo response.');
 if(result.version<sharedVersion)return;
 if(result.version!==sharedVersion){
   const focus=document.activeElement,restore=focus&&['INPUT','TEXTAREA','SELECT'].includes(focus.tagName)&&focus.id?{id:focus.id,value:focus.value,checked:focus.checked}:null;
   window.orderFeedback?.changes(state.orders,result.orders,sharedVersion>=0);
   state.orders=result.orders;sharedVersion=result.version;renderAll();
   if(restore){const el=document.getElementById(restore.id);if(el){el.value=restore.value;if(el.type==='checkbox')el.checked=restore.checked;el.focus()}}
 }
 sharedOnline=true;sharedStatus(sharedPending?'Pending action · tap Retry pending action to confirm it':'Shared demo connected · auto-sync every 3s',sharedPending?'pending':'online');
}
async function apiRequest(method,body){
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),12000);
 try{const response=await fetch('/api/demo',{method,credentials:'same-origin',cache:'no-store',signal:controller.signal,...(body?{headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}:{})});
 let result;try{result=await response.json()}catch{throw new Error('Session expired or server unavailable. Sign in and reconnect.')}
 if(!response.ok){const error=new Error(result.error||'Unable to update demo.');error.status=response.status;throw error}return result;
 }finally{clearTimeout(timer)}
}
async function refreshShared(){if(sharedBusy||sharedRefreshing||document.hidden)return;sharedRefreshing=true;try{applyShared(await apiRequest('GET'))}catch(e){sharedOnline=false;sharedStatus(e.status===401?'Sign in on all three phones using the same ChatGPT account.':'Connection lost · changes are not saved while offline',e.status===401?'signin':'offline')}finally{sharedRefreshing=false}}
async function sendShared(action,id,data={}){
 if(sharedBusy)throw new Error('Saving an update. Sandali lang…');
 if(sharedPending)throw new Error('May pending action. Tap Retry pending action before sending another.');
 if(!sharedOnline)throw new Error('Reconnect muna bago mag-update ng order.');
 sharedPending={action,id,data:structuredClone(data),requestId:crypto.randomUUID()};return retryShared();
}
async function retryShared(){
 if(!sharedPending)return refreshShared();if(sharedBusy)return;
 sharedBusy=true;document.body.classList.add('shared-saving');
 try{const command=sharedPending;const result=await apiRequest('POST',command);sharedPending=null;applyShared(result);return result;
 }catch(e){
   if(e.status&&e.status<500&&e.status!==409)sharedPending=null;
   sharedOnline=false;sharedStatus(sharedPending?'Save not confirmed · Retry pending action (safe to retry)':'Update rejected · reconnect to get latest orders',e.status===401?'signin':'offline');throw e;
 }finally{sharedBusy=false;document.body.classList.remove('shared-saving')}
}
function startSharedDemo(){
 state.orders=[];renderAll();
 const params=new URLSearchParams(location.search),requestedRole=params.get('role');
 if(['customer','staff','rider'].includes(requestedRole))setRole(requestedRole);
 const selectedRider=params.get('rider');if(D.RIDERS.some(r=>r.id===selectedRider))$('riderSelect').value=selectedRider;
 if(role==='rider')renderRider();
 $('syncStatus').querySelector('a').href='/signin-with-chatgpt?return_to='+encodeURIComponent('/'+location.search);
 $('syncStatus').querySelector('button').onclick=retrySharedFromUI;
 refreshShared();sharedPoll=setInterval(refreshShared,3000);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)refreshShared()});window.addEventListener('online',refreshShared);
}
function finishSharedCheckout(){state.cart=[];save();if($('checkoutDialog').open)$('checkoutDialog').close();confirmOrderReceived(()=>{renderCustomerOrders();show('ordersDialog')})}
async function retrySharedFromUI(){const wasCreate=sharedPending?.action==='create';try{const result=await retryShared();if(result&&wasCreate)finishSharedCheckout();else if(sharedOnline)toast('Connected. You can continue.')}catch(e){toast(e.message)}}
