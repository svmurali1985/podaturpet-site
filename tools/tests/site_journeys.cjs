'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),{JSDOM,VirtualConsole}=require('jsdom');
const root=path.resolve(__dirname,'../..');let count=0;const opened=[];
function test(name,fn){fn();console.log('PASS '+name);count++;}
function app(page='index.html',suffix='',full=false){
 const errors=[],network=[],vc=new VirtualConsole();vc.on('jsdomError',e=>{if(!/navigation|HTMLMediaElement|HTMLCanvasElement/.test(e.message))errors.push(e.message);});
 const dom=new JSDOM(fs.readFileSync(path.join(root,page),'utf8'),{url:'https://podaturpet.com/'+(page==='index.html'?'':page)+suffix,runScripts:'outside-only',virtualConsole:vc});opened.push(dom);const w=dom.window,d=w.document;
 w.matchMedia=()=>({matches:true,addEventListener(){}});w.HTMLElement.prototype.scrollIntoView=()=>{};w.scrollTo=()=>{};w.setInterval=()=>1;w.requestAnimationFrame=fn=>fn();w.confirm=()=>true;w.print=()=>{};w.open=()=>null;w.fetch=(...args)=>{network.push(args);return Promise.resolve({ok:true,json:()=>Promise.resolve({total:0,today:0,countries:[],cities:[]})});};w.navigator.sendBeacon=()=>true;w.URL.createObjectURL=()=> 'blob:qa';w.URL.revokeObjectURL=()=>{};w.HTMLMediaElement.prototype.pause=()=>{};
 w.IntersectionObserver=class{observe(){}disconnect(){}};
 const run=file=>w.eval(fs.readFileSync(path.join(root,file),'utf8'));
 if(full){for(const script of [...d.scripts]){if(script.type==='application/ld+json')continue;if(script.src){const u=new URL(script.src);if(u.origin===w.location.origin)run(u.pathname.slice(1));}else if(script.textContent.trim())w.eval(script.textContent);}}
 else run('podaturpet-editorial.js');
 return {w,d,errors,network,run,$:id=>d.getElementById(id)};
}
try{
 const a=app();
 test('homepage has one heading, five areas and one shared navigation',()=>{assert.equal(a.d.querySelectorAll('h1').length,1);assert.equal(a.d.querySelectorAll('.home-area').length,5);assert.equal(a.d.querySelectorAll('#site-main-nav').length,1);assert.equal(a.d.querySelectorAll('#site-main-nav a').length,5);});
 test('mobile navigation opens, closes with Escape and restores focus',()=>{const b=a.d.querySelector('.site-menu-toggle');assert(!b.hidden);b.click();assert.equal(b.getAttribute('aria-expanded'),'true');b.dispatchEvent(new a.w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert.equal(b.getAttribute('aria-expanded'),'false');assert.equal(a.d.activeElement,b);});
 test('Tamil switching translates the complete new homepage paths',()=>{a.d.querySelector('[data-site-language=ta]').click();assert(a.$('home-title').textContent.includes('அன்றாட'));assert.equal(a.d.body.dataset.siteLang,'ta');assert(a.d.querySelector('.home-actions a').href.includes('people-information-hub-ta.html'));});
 test('English switching restores labels and existing English route',()=>{a.d.querySelector('[data-site-language=en]').click();assert(a.$('home-title').textContent.includes('Everyday'));assert(a.d.querySelector('.home-actions a').href.includes('people-information-hub.html'));});
 test('new common navigation never has a private search query',()=>{for(const l of a.d.querySelectorAll('#site-main-nav a'))assert.equal(new URL(l.href).search,'');});
 const deep=app('index.html','?product=PT-WC-01#quick-quote',true);
 test('old quote deep link opens the retained buyer workspace',()=>assert(deep.$('wholesale-details').open));
 test('existing product selection propagates into original quote form',()=>assert.equal(deep.$('wholesale-quote-form').elements.product.value,'PT-WC-01'));
 test('original wholesale quote still prepares its own message',()=>{const f=deep.$('wholesale-quote-form');for(const i of f.elements){if(i.name==='business_name')i.value='QA Shop';if(i.name==='quantity')i.value='100';if(i.name==='destination')i.value='Toronto';if(i.name==='business')i.selectedIndex=1;if(i.name==='email')i.value='qa@example.com';}f.reportValidity=()=>true;f.dispatchEvent(new deep.w.Event('submit',{cancelable:true}));assert(f.querySelector('.enquiry-status a').href.startsWith('https://wa.me/'));assert(decodeURIComponent(f.querySelector('.enquiry-status a').href).includes('PT-WC-01'));});
 test('buyer translation and common shell stay synchronized',()=>{deep.d.querySelector('[data-site-language=ta]').click();assert.equal(deep.d.documentElement.dataset.buyerLanguage,'ta');assert.equal(deep.d.body.dataset.siteLang,'ta');});
 test('homepage preserves video, product cards and global market selector',()=>{assert(deep.d.querySelector('#powerloom-video video'));assert(deep.d.querySelectorAll('[data-product-choice]').length);assert(deep.$('international-buyers').querySelector('select'));});
 test('old removed section anchors still resolve',()=>{for(const id of ['pv-title','showcase-title','pt-page-explorer','pt-people-title','pt-travel-heading','invoice-tool-title'])assert(a.$(id),id);});
 test('homepage has no duplicate page-explorer drawer or duplicate skip link',()=>{assert.equal(a.d.querySelectorAll('details#pt-page-explorer').length,0);assert.equal(a.d.querySelectorAll('.pt-skip,.skip-to-content,.skip').length,1);});
 for(const page of ['people-information-hub.html','people-information-hub-ta.html','podaturpet-local-business-directory.html','lungi-product-catalogue.html','podaturpet-town-guide.html','advertise-on-podaturpet.html','business-website-development.html','free-invoice.html','us-india-family-travel-planner.html']){
  const b=app(page,'',true);
  test(page+' initializes full existing local scripts without exceptions',()=>assert.deepEqual(b.errors,[]));
  test(page+' keeps one shell and unique DOM IDs',()=>{assert.equal(b.d.querySelectorAll('[data-site-shell]').length,1);const ids=[...b.d.querySelectorAll('[id]')].map(e=>e.id);assert.equal(new Set(ids).size,ids.length);});
  if(page==='free-invoice.html')test('invoice preview and add-item controls remain live',()=>{const f=b.$('invoice-form');f.elements.business.value='QA business';f.dispatchEvent(new b.w.Event('input',{bubbles:true}));const add=b.$('add-item');const before=b.$('items').children.length;add.click();assert.equal(b.$('items').children.length,before+1);assert(b.$('preview'));});
  if(page==='us-india-family-travel-planner.html')test('native planner Tamil and large-text controls survive header merge',()=>{b.$('tamil').click();assert.equal(b.d.documentElement.lang,'ta');b.$('large-text').click();assert.equal(b.$('large-text').getAttribute('aria-pressed'),'true');});
 }
 test('textile context does not leak into unrelated information navigation',()=>{for(const a of deep.d.querySelectorAll('#site-main-nav a'))if(!/lungi/.test(a.pathname)){assert(!new URL(a.href).searchParams.has('product'));assert(!new URL(a.href).searchParams.has('market'));}});
 test('feedback reuses one existing trigger in the footer',()=>{assert.equal(deep.d.querySelectorAll('#pt-feedback-button').length,1);assert(deep.d.querySelector('.site-footer #pt-feedback-button'));});
 test('homepage complete script initialization has no runtime errors',()=>assert.deepEqual(deep.errors,[]));
 const privacy=app('privacy-policy.html');test('privacy page remains reachable and has no added collector',()=>{assert(privacy.d.querySelector('h1').textContent.includes('Privacy'));assert.equal(privacy.network.length,0);});
 console.log(count+' reorganization journey tests passed.');
}finally{opened.forEach(d=>d.window.close());}
