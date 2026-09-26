const {JSDOM}=require('jsdom');const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..');let passed=0;const check=(name,fn)=>{fn();passed++;console.log('PASS '+name)};
function app(name='wholesale-lungi-enquiry.html',params='?product=PT-WC-01&purpose=sample&market=Chennai'){
 const dom=new JSDOM(fs.readFileSync(path.join(root,name),'utf8'),{url:'https://podaturpet.com/'+name+params,runScripts:'outside-only'});const w=dom.window,d=w.document;
 w.eval(fs.readFileSync(path.join(root,'podaturpet-editorial.js'),'utf8'));w.eval(fs.readFileSync(path.join(root,'podaturpet-global.js'),'utf8'));return {dom,w,d};
}
(async()=>{
for(const file of ['index.html','index-ta.html','wholesale-lungi-enquiry.html']){
 const {dom,w,d}=app(file);const form=d.querySelector('#wholesale-enquiry');
 check(file+' preserves product/sample/destination context',()=>{assert.equal(form.elements.design.value,'PT-WC-01');assert.equal(form.elements.purpose.value,'sample');assert.equal(form.elements.destination.value,'Chennai');});
 form.dispatchEvent(new w.Event('submit',{cancelable:true}));
 check(file+' optional quantity produces valid WhatsApp and email drafts',()=>{assert(!d.querySelector('#buyer-review').hidden);const wa=new URL(d.querySelector('[data-enquiry-channel=whatsapp]').href);assert.equal(wa.pathname,'/14793201970');assert(wa.searchParams.get('text').includes('PT-WC-01'));assert.match(wa.searchParams.get('text'),/minimum order|குறைந்தபட்ச/);assert.equal(new URL(d.querySelector('[data-enquiry-channel=email]').href).searchParams.get('body'),wa.searchParams.get('text'));});
 form.elements.requirements.value='<img src=x onerror=alert(1)>';form.dispatchEvent(new w.Event('input',{bubbles:true}));
 check(file+' editing invalidates stale drafts',()=>{assert(d.querySelector('#buyer-review').hidden);assert.equal(d.querySelector('[data-enquiry-channel=email]').getAttribute('href'),null)});
 form.dispatchEvent(new w.Event('submit',{cancelable:true}));check(file+' input is rendered as text',()=>assert.equal(d.querySelector('#buyer-message img'),null));
 let copied='';Object.defineProperty(w.navigator,'clipboard',{value:{writeText:async v=>{copied=v}},configurable:true});d.querySelector('[data-copy-enquiry]').click();await new Promise(r=>setTimeout(r,0));check(file+' copy matches draft',()=>assert.equal(copied,d.querySelector('#buyer-message').textContent));
 d.querySelector('[data-site-language=ta]').click();check(file+' language switch invalidates draft and translates purpose label',()=>{assert(d.querySelector('#buyer-review').hidden);assert.match(d.querySelector('label[for=buyer-purpose]').textContent,/உதவி/)});
 form.elements.quantity.value='-1';form.dispatchEvent(new w.Event('submit',{cancelable:true}));check(file+' rejects negative quantity',()=>assert(d.querySelector('#buyer-review').hidden));dom.window.close();
}
{
 const {dom,w,d}=app();let calls=[];w.PodaturpetCommunity={apiBase:'https://test.workers.dev'};w.fetch=async(url,opts={})=>{calls.push({url,opts});return {ok:true,json:async()=>({pageViews:3,siteViews:8,locations:[{country:'IN',region:'Tamil Nadu',views:8}],days:30})}};
 w.eval(fs.readFileSync(path.join(root,'podaturpet-visitor-tracking.js'),'utf8'));await new Promise(r=>setTimeout(r,0));
 check('public totals load without a tracking write',()=>{assert.equal(calls.filter(c=>c.opts.method==='POST').length,0);assert(d.querySelector('#pt-public-views').textContent.includes('Entire site: 8'));});
 check('country/state only displayed',()=>{assert.equal(d.querySelectorAll('#pt-public-views th').length,3);assert.equal(d.querySelectorAll('#pt-public-views td').length,3);assert(!d.querySelector('#pt-public-views').textContent.includes('City'));});
 d.querySelector('[data-choice=yes]').click();await new Promise(r=>setTimeout(r,0));d.querySelector('[data-choice=yes]').click();
 check('consent records one view, without identifiers or location in request',()=>{const posts=calls.filter(c=>c.opts.method==='POST');assert.equal(posts.length,1);assert.deepEqual(JSON.parse(posts[0].opts.body),{page:'/wholesale-lungi-enquiry.html',consent:true});});
 dom.window.close();
}
{
 const {dom,w,d}=app();w.PodaturpetCommunity={apiBase:'https://test.workers.dev'};w.fetch=async()=>({ok:false});w.eval(fs.readFileSync(path.join(root,'podaturpet-visitor-tracking.js'),'utf8'));await new Promise(r=>setTimeout(r,0));check('unavailable backend is not shown as zero views',()=>assert(d.querySelector('#pt-public-views').textContent.includes('unavailable')));dom.window.close();
}
console.log(passed+' checks passed');
})().catch(e=>{console.error(e);process.exitCode=1});
