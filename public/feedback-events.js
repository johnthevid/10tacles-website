(function(root){
 const important=new Set(['awaiting_verification','payment_issue','cooking','ready','assigned','out_for_delivery','delivered','cancelled','refund_pending','refunded']);
 function events(before,after,role,rider,initialized){
  if(!initialized)return [];
  const prior=new Map(before.map(o=>[o.id,o]));
  return after.filter(o=>{
   const old=prior.get(o.id);
   if(role==='staff')return !old||old.status!==o.status||old.reference!==o.reference;
   if(role==='rider')return (o.rider===rider||old?.rider===rider)&&(!old||old.rider!==o.rider||old.status!==o.status);
   return old&&old.status!==o.status&&important.has(o.status);
  }).map(o=>({id:o.id,number:o.number,status:o.status,newOrder:!prior.has(o.id)}));
 }
 const api={events};if(typeof module!=='undefined')module.exports=api;else root.OrderFeedbackEvents=api;
})(typeof window==='undefined'?globalThis:window);
