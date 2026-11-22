'use strict';
// Customer shortcuts read the same order state; no duplicated order records.
function renderDock(){
 const dock=$('orderDock'),active=state.orders.filter(o=>!['delivered','cancelled','refunded'].includes(o.status));
 const onRoad=active.find(o=>o.status==='out_for_delivery'),o=onRoad||active[0],qty=state.cart.reduce((n,i)=>n+i.qty,0);
 dock.classList.toggle('hidden',role!=='customer'||(!o&&!qty));
 document.body.classList.toggle('has-order-dock',role==='customer'&&Boolean(o||qty));
 if(role!=='customer'){dock.innerHTML='';return}
 const hint={awaiting_payment:'Payment muna para ma-process',awaiting_verification:'Staff is checking your payment',payment_issue:'May kailangang i-check sa bayad',cooking:'Fresh na niluluto para sa ’yo',ready:'Ready na — waiting sa rider',assigned:'May rider na, pickup na lang',out_for_delivery:'Papunta na ang seafood mo!',refund_pending:'May payment na kailangang i-reconcile'};
 dock.innerHTML=(o?`<button class="order-island" id="currentOrderIsland"><span class="island-icon" aria-hidden="true">${o.status==='out_for_delivery'?'🛵':o.status==='cooking'?'🍳':'🦑'}</span><span class="island-copy"><strong>${esc(D.STATUS[o.status])}${active.length>1?` <small>+${active.length-1} pang order</small>`:''}</strong><span>${esc(hint[o.status]||'Tingnan ang latest order update')}</span><small>${esc(o.number)} · Demo order</small></span><span class="island-arrow" aria-hidden="true">↗</span></button>`:'')+(qty?`<button class="cart-island" id="cartIsland"><span class="cart-qty">${qty}</span><strong>Tingnan ang bag</strong><span>${totals()?money(totals().total):money(state.cart.reduce((sum,x)=>sum+D.MENU.find(m=>m.id===x.id).price*x.qty,0))}${totals()?'':' food'}</span><span aria-hidden="true">→</span></button>`:'');
 if($('currentOrderIsland'))$('currentOrderIsland').onclick=()=>{renderCustomerOrders();show('ordersDialog')};
 if($('cartIsland'))$('cartIsland').onclick=()=>{renderBag();show('bagDialog')};
}
let waveTimer;
function confirmOrderReceived(after){
 const d=$('waveDialog');clearTimeout(waveTimer);let finished=false;
 const finish=()=>{if(finished)return;finished=true;clearTimeout(waveTimer);d.close();after()};
 $('waveContinue').onclick=finish;
 d.oncancel=e=>{e.preventDefault();finish()};
 show('waveDialog');
 // Confirmation stays until acknowledged; no timed dismissal.
 window.orderFeedback?.confirm();
}
function mapsCard(o){
 if(!['assigned','out_for_delivery'].includes(o.status))return '';
 return `<section class="maps-preview"><div><span aria-hidden="true">⌖</span><b>Rider map</b><small>Setup pending · walang live GPS ngayon</small></div><p>Google Maps + rider GPS ang susunod. Demo position lang ang nasa ibaba.</p><button type="button" data-map-setup>Google Maps setup details ↗</button></section>`;
}
