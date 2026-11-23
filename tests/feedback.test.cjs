const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),context={module:{exports:{}}};vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname,'../public/feedback-events.js'),'utf8'),context);const {events}=context.module.exports;
const order={id:'one',number:'10T-ONE',status:'awaiting_payment',rider:null};
test('initial sync and unchanged polls never alert',()=>{assert.equal(events([], [order], 'staff',null,false).length,0);assert.equal(events([order],[{...order}], 'staff',null,true).length,0)});
test('kitchen receives new order and payment review alerts',()=>{assert.equal(events([],[order],'staff',null,true).length,1);assert.equal(events([order],[{...order,status:'awaiting_verification'}],'staff',null,true).length,1)});
test('customer status alerts ignore GPS-only updates',()=>{assert.equal(events([order],[{...order,status:'cooking'}],'customer',null,true).length,1);assert.equal(events([order],[{...order,position:2}],'customer',null,true).length,0)});
test('rider only receives relevant assignments and unassignments',()=>{const assigned={...order,status:'assigned',rider:'rider-1'};assert.equal(events([order],[assigned],'rider','rider-1',true).length,1);assert.equal(events([order],[assigned],'rider','rider-2',true).length,0);assert.equal(events([assigned],[order],'rider','rider-1',true).length,1)});
