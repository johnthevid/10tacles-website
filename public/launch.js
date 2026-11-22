'use strict';
window.LaunchUI={
 renderBag(){
  const en=document.getElementById('languageSelect').value==='en';
  const content=document.getElementById('bagContent');
  content.innerHTML=state.cart.length?state.cart.map(x=>{const m=D.MENU.find(m=>m.id===x.id);return `<div class="cart-row"><div><b>${esc(m.name)}</b><p>${money(m.price)} ${en?'each':'bawat isa'}</p></div><div class="quantity"><button type="button" data-launch-item="${m.id}" data-delta="-1" aria-label="Remove one ${esc(m.name)}">−</button><span>${x.qty}</span><button type="button" data-launch-item="${m.id}" data-delta="1" aria-label="Add one ${esc(m.name)}" ${x.qty>=20?'disabled':''}>+</button></div></div>`}).join(''):'<p>'+ (en?'Your bag is empty. Browse the menu to add your favorites.':'Wala pang laman ang bag. Pili muna ng favorites mo.')+'</p>';
  content.insertAdjacentHTML('beforeend',`<p class="notice">${en?'Online ordering opens soon. Prices and availability will be confirmed before ordering opens.':'Malapit nang mag-open ang online ordering. Iko-confirm muna ang presyo at availability.'}</p><button class="primary" type="button" disabled>${en?'Checkout opens soon':'Checkout · coming soon'}</button>`);
  content.querySelectorAll('[data-launch-item]').forEach(b=>b.onclick=()=>{const x=state.cart.find(x=>x.id===b.dataset.launchItem);if(!x)return;x.qty=Math.min(20,x.qty+Number(b.dataset.delta));state.cart=state.cart.filter(i=>i.qty>0);save()});
 }
};
document.addEventListener('DOMContentLoaded',()=>{
 const language=document.getElementById('languageSelect');
 const refresh=()=>{
  const en=language.value==='en';
  const heading=document.querySelector('.launch-notice strong'),copy=document.querySelector('.launch-notice p');
  heading.textContent=en?'Online ordering opens soon.':'Malapit nang mag-open ang online ordering.';
  copy.textContent=en?'Browse our seafood menu. Prices and availability will be confirmed before ordering opens.':'Tingnan muna ang seafood menu namin. Iko-confirm muna ang presyo at availability.';
  document.querySelector('#syncStatus span').textContent=en?'Online ordering opens soon':'Online ordering · coming soon';
  const title=document.getElementById('signature-title');
  if(title){
   title.replaceChildren(document.createTextNode('Seafood'),document.createElement('br'));
   const accent=document.createElement('span');accent.textContent='Sarap';title.append(accent);
   document.querySelector('.signature-description').textContent=en?'Meet 10Tacles, our signature deep-fried squid. Made for your seafood cravings.':'Meet 10Tacles, our signature deep-fried squid. Para sa seafood cravings mo.';
   const cta=document.querySelector('.signature-cta');cta.firstChild.textContent=en?'Explore the menu ':'Tingnan ang menu ';
  }
  LaunchUI.renderBag();
 };
 language.addEventListener('change',refresh);refresh();
 document.getElementById('checkoutForm').addEventListener('submit',e=>{e.preventDefault();e.stopImmediatePropagation()},true);
});
