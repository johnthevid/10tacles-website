'use strict';
(()=>{
 const read=(k,f)=>{try{return localStorage.getItem(k)??f}catch{return f}};
 const write=(k,v)=>{try{localStorage.setItem(k,v)}catch{}};
 let language=read('10tacles-language','tl'),soundWanted=read('10tacles-sound','false')==='true',vibration=read('10tacles-vibration','true')==='true',audio,unlocked=false,lastFeedback=0;
 let notifications=[];
 const words={
 'ORDER DIRECT � SARAP SA BAHAY':'ORDER DIRECT � DELIVERED TO YOUR DOOR','The big seafood spread for your next salu-salo.':'The big seafood spread for your next gathering.','Order received!':'Order received!','Verified na ang demo payment.':'Demo payment verified.','minuto pa.':'more minutes.','Paano gamitin':'How to use','Order na':'Order food','Mga order mo':'Your orders','Mga order':'My orders','Ano’ng cravings mo?':'What are you craving?','Fresh seafood, diretso sa bahay mo.':'Fresh seafood, delivered to your door.','Deliver saan?':'Where should we deliver?','Test areas at sample fees muna.':'Test areas and sample fees.','Piliin ang area':'Choose your area','PILI NA NG FAVORITES MO':'CHOOSE YOUR FAVORITES','Test menu · sample ordering lang muna':'Test menu · sample orders only','Hanap ng seafood…':'Search seafood…','Lahat':'All','Ang bag mo':'Your bag','Saan ide-deliver?':'Where should we deliver?','Konting details na lang!':'Just a few details!','Demo lang. Sample details muna — walang totoong bayad.':'Demo only. Use sample details — no real payments.','Pangalan':'Name','Address at landmark':'Address and landmark','Bilin sa kitchen o rider':'Notes for the kitchen or rider','Halimbawa: less spicy, please':'For example: less spicy, please','Payment muna. Magluluto lang kapag verified na ng staff. Covered test areas lang muna.':'Prepaid only. Cooking starts after staff verifies payment. Test areas only.','I-place ang demo order':'Place demo order','Payment muna':'Awaiting payment','I-check ang payment':'Payment needs review','Niluluto na!':'Cooking your order!','Ready na ang food':'Food is ready','May rider na':'Rider assigned','Papunta na sa ’yo!':'On the way!','Delivered na':'Delivered','Payment muna para ma-process':'Payment is needed to process your order','May kailangang i-check sa bayad':'Your payment needs a review','Fresh na niluluto para sa ’yo':'Freshly cooking your order','Ready na — waiting sa rider':'Ready — waiting for a rider','May rider na, pickup na lang':'Rider assigned — awaiting pickup','Papunta na ang seafood mo!':'Your seafood is on the way!','May payment na kailangang i-reconcile':'Payment reconciliation needed','Tingnan ang latest order update':'View your latest order update','Tingnan ang bag':'View bag','Tingnan ang order':'View order','Walang match sa search.':'No matching dishes.','Try ibang seafood o category.':'Try another seafood dish or category.','Wala pang laman ang bag.':'Your bag is empty.','Pili muna ng seafood favorites mo.':'Choose your seafood favorites first.','Pili ng seafood':'Browse seafood','Piliin ang test area':'Choose a test area','Sample areas at distances muna.':'Sample areas and distances.','Anong delivery ang gusto mo?':'Choose your delivery type','Walang extra':'No extra charge','Priority · solo ang trip mo':'Priority · exclusive trip','Standard · puwedeng kasabay':'Standard · shared trip','Solo ang order mo sa trip. Depende sa available rider.':'Your order has an exclusive trip, subject to rider availability.','Hanggang 2 orders sa parehong test area.':'Up to 2 orders in the same test area.','Sorry, outside test coverage ang area.':'Sorry, this area is outside test coverage.','Piliin ang covered test area para makita ang total.':'Choose a covered test area to see your total.','Checkout na':'Checkout','Subtotal ng food':'Food subtotal','I-cancel ang unpaid order':'Cancel unpaid order','Wala ka pang order.':'No orders yet.','Dito lalabas ang updates pagkatapos mag-checkout.':'Your updates will appear here after checkout.','Na-submit na ang payment. Hinihintay ang staff verification. Sa demo, buksan ang Kitchen desk sa Demo tools.':'Payment submitted. Waiting for staff verification. For this demo, open Kitchen desk in Demo tools.','Ready na ang food! Hinihintay ang rider assignment.':'Food is ready! Waiting for a rider assignment.','Payment muna bago lutuin. Demo lang ito — walang totoong QR o bayad.':'Payment is required before cooking. Demo only — no real payment or payment QR.','May kailangang i-check sa payment. Mag-submit ng bagong sample reference.':'Payment needs review. Submit a new sample reference.','Setup pending · walang live GPS ngayon':'Setup pending · no live GPS yet','Google Maps + rider GPS ang susunod. Demo position lang ang nasa ibaba.':'Google Maps and rider GPS are planned. The position below is simulated.','Na-receive na ang order mo.':'Your order has been received.','Payment verification muna bago lutuin.':'Cooking starts after payment verification.','PUBLIC DEMO · Sample details lang · Walang totoong bayad':'PUBLIC DEMO · Sample details only · No real payments',
 'Shared demo connected · auto-sync every 3s':'Shared demo connected · auto-sync every 3s'
 };
 const originals=new WeakMap();
 const tr=s=>language==='en'?translate(s):s;
 function translate(s){let out=s;for(const [a,b]of Object.entries(words).sort((a,b)=>b[0].length-a[0].length))out=out.split(a).join(b);return out.replace(/(\d+) pagpipilian/g,'$1 choices').replace(/bawat isa/g,'each').replace(/ — nasa bag na!/g,' — added to bag!').replace(/(\d+) pang order/g,'$1 more orders').replace(/Verified na ang demo payment\. Niluluto na! Staff estimate: (\d+) minuto pa\./g,'Demo payment verified. Cooking now! Staff estimate: $1 more minutes.').replace(/Demo: na-send na ang bayad/g,'Demo: payment sent');}
 function localize(){
  document.documentElement.lang=language==='en'?'en':'fil';
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let node;
  while(node=walker.nextNode()){
   if(node.parentElement.closest('script,style,textarea,input,option,.order-meta,.order-items,.activity'))continue;
   const old=originals.get(node);const source=old&&node.textContent===old.output?old.source:node.textContent;
   const output=tr(source);if(output!==node.textContent)node.textContent=output;originals.set(node,{source,output});
  }
  document.querySelectorAll('[placeholder]').forEach(el=>{const source=el.dataset.originalPlaceholder??el.getAttribute('placeholder');el.dataset.originalPlaceholder=source;el.setAttribute('placeholder',tr(source))});
 }
 function tone(kind='update'){
  if(!soundWanted||!unlocked||!audio)return;
  try{audio.resume();const notes=kind==='confirm'?[523,659,784]:[659,880];notes.forEach((hz,i)=>{const osc=audio.createOscillator(),gain=audio.createGain(),time=audio.currentTime+i*.13;osc.type='sine';osc.frequency.value=hz;gain.gain.setValueAtTime(0,time);gain.gain.linearRampToValueAtTime(.12,time+.015);gain.gain.exponentialRampToValueAtTime(.001,time+.25);osc.connect(gain);gain.connect(audio.destination);osc.start(time);osc.stop(time+.27)})}catch{}
 }
 function vibrate(pattern){if(vibration&&navigator.vibrate)try{navigator.vibrate(pattern)}catch{}}
 function feedback(kind){if(Date.now()-lastFeedback<700)return;lastFeedback=Date.now();tone(kind);vibrate(kind==='confirm'?[35,50,60]:[45,70,45])}
 const messages={awaiting_payment:['New order · awaiting payment','Bagong order · payment muna'],awaiting_verification:['Payment submitted · review needed','May payment na · paki-check'],payment_issue:['Payment needs review','I-check ang payment'],cooking:['Payment approved · cooking now','Verified na · niluluto na!'],ready:['Food is ready for pickup','Ready na ang food!'],assigned:['Rider assigned · ready for pickup','May rider na · ready for pickup'],out_for_delivery:['Your order is on the way','Papunta na ang order mo!'],delivered:['Order delivered · enjoy your meal!','Delivered na · kain na!'],cancelled:['Order cancelled','Cancelled ang order'],refund_pending:['Payment reconciliation needed','Payment needs reconciliation'],refunded:['Demo refund recorded','Recorded na ang demo refund']};
 function label(n){return `${n.number} · ${(messages[n.status]||['Order updated','Updated ang order'])[language==='en'?0:1]}`}
 function renderUpdates(){const list=document.getElementById('notificationList');list.replaceChildren();if(!notifications.length){const p=document.createElement('p');p.textContent=language==='en'?'No new updates yet.':'Wala pang bagong update.';list.append(p)}for(const n of notifications){const p=document.createElement('p');p.textContent=label(n);const small=document.createElement('small');small.textContent=new Date(n.at).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});p.append(small);list.append(p)}document.getElementById('notificationCount').textContent=notifications.length;}
 let alertTimer;
 window.orderFeedback={
  addToBag(origin,card){
   const visible=el=>{if(!el)return false;const r=el.getBoundingClientRect();return r.width>0&&r.top>=0&&r.bottom<=innerHeight};
   const target=[document.getElementById('cartIsland'),document.getElementById('bagButton')].find(visible);
   if(!target||!card||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
   const end=target.getBoundingClientRect(),x=origin.left+origin.width/2,y=origin.top+origin.height/2;
   const dx=end.left+end.width/2-x,dy=end.top+end.height/2-y;
   const lift=Math.min(150,Math.max(65,origin.height*.3));
   card.classList.add('bag-card-flight');card.setAttribute('aria-hidden','true');card.inert=true;
   Object.assign(card.style,{left:origin.left+'px',top:origin.top+'px',width:origin.width+'px',height:origin.height+'px'});
   document.body.append(card);
   // Sample a curved path: lift first, pass the apex, then accelerate down into the bag.
   const frames=Array.from({length:25},(_,i)=>{
    const t=i/24,travel=t*t*(3-2*t),px=dx*travel,py=dy*travel-4*lift*t*(1-t);
    const scale=1+.055*Math.sin(Math.PI*Math.min(t/.3,1))-.94*Math.pow(t,1.8);
    const tilt=(dx<0?-1:1)*11*Math.sin(Math.PI*t);
    return {offset:t,transform:`translate(${px}px,${py}px) scale(${scale}) rotate(${tilt}deg)`,opacity:t<.85?1:Math.max(0,(1-t)/.15)};
   });
   const flight=card.animate(frames,{duration:650,easing:'linear'});
   flight.finished.then(()=>{
    const landing=document.getElementById('cartIsland')||target;
    if(landing.isConnected)landing.animate([{transform:'translateY(0) scale(1)'},{transform:'translateY(4px) scale(.97)',offset:.35},{transform:'translateY(-2px) scale(1.025)',offset:.7},{transform:'translateY(0) scale(1)'}],{duration:230,easing:'ease-out'});
   }).catch(()=>{}).finally(()=>card.remove());
  },
  changes(before,after,initialized){
   const rider=document.getElementById('riderSelect')?.value;
   const events=OrderFeedbackEvents.events(before,after,typeof role==='string'?role:'customer',rider,initialized);
   if(!events.length)return;
   notifications=[...events.map(e=>({...e,at:Date.now()})),...notifications].slice(0,30);renderUpdates();
   const openDialog=document.querySelector('dialog[open]');if(openDialog){let note=openDialog.querySelector('.live-order-update');if(!note){note=document.createElement('p');note.className='live-order-update notice';note.setAttribute('role','status');openDialog.append(note)}note.textContent=label(notifications[0]);}
   const alert=document.getElementById('orderAlert');alert.textContent=label(notifications[0])+(events.length>1?` (+${events.length-1})`:'');alert.hidden=false;clearTimeout(alertTimer);alertTimer=setTimeout(()=>alert.hidden=true,6500);feedback('update');
  },
  confirm(){feedback('confirm')}
 };
 document.addEventListener('DOMContentLoaded',()=>{
  const select=document.getElementById('languageSelect');select.value=language;
  select.onchange=()=>{language=select.value;write('10tacles-language',language);localize();renderUpdates()};
  const sound=document.getElementById('soundToggle'),haptic=document.getElementById('hapticToggle');
  function controls(){sound.textContent=soundWanted&&unlocked?'Sound on · mute':soundWanted?'Tap to activate sound':'Enable sounds';sound.setAttribute('aria-pressed',String(soundWanted&&unlocked));haptic.textContent=navigator.vibrate?(vibration?'Vibration on':'Vibration off'):'Vibration unavailable';haptic.setAttribute('aria-pressed',String(vibration));haptic.disabled=!navigator.vibrate;}
  sound.onclick=async()=>{try{if(!unlocked){audio=new(window.AudioContext||window.webkitAudioContext)();await audio.resume();unlocked=true;soundWanted=true}else soundWanted=!soundWanted;write('10tacles-sound',String(soundWanted));tone('confirm')}catch{soundWanted=false;sound.textContent='Sound unavailable'}controls()};
  haptic.onclick=()=>{vibration=!vibration;write('10tacles-vibration',String(vibration));vibrate(35);controls()};
  document.addEventListener('click',e=>{if(e.target.closest('button')&&!e.target.closest('#soundToggle,#hapticToggle'))vibrate(12)});
  document.querySelectorAll('dialog').forEach(dialog=>{const close=dialog.close.bind(dialog);dialog.close=(value)=>{if(!dialog.open)return;if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){close(value);return}if(dialog.dataset.closing)return;dialog.dataset.closing='true';dialog.animate([{opacity:1,translate:'0 0'},{opacity:0,translate:'0 7px'}],{duration:130,easing:'ease-in'}).finished.catch(()=>{}).then(()=>{delete dialog.dataset.closing;close(value)})}});
  controls();renderUpdates();localize();
  let queued=false;
  const observer=new MutationObserver(()=>{if(!queued){queued=true;queueMicrotask(()=>{queued=false;observer.disconnect();localize();observer.observe(document.body,{childList:true,subtree:true,characterData:true})})}});
  observer.observe(document.body,{childList:true,subtree:true,characterData:true});
 });
})();
