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
 test('homepage presents business routes without repeated content sections',()=>{assert.equal(a.d.querySelectorAll('h1').length,1);for(const id of ['collection','services','advertise','town','nearby','contact'])assert.equal(a.d.querySelectorAll('#'+id).length,1);assert.equal(a.d.querySelectorAll('#site-main-nav').length,1);});
 test('mobile navigation opens, closes with Escape and restores focus',()=>{const b=a.d.querySelector('.site-menu-toggle');b.click();assert.equal(b.getAttribute('aria-expanded'),'true');b.dispatchEvent(new a.w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert.equal(b.getAttribute('aria-expanded'),'false');assert.equal(a.d.activeElement,b);});
 test('Tamil and English switching preserve commercial links',()=>{a.d.querySelector('[data-site-language=ta]').click();assert(a.d.querySelector('h1').textContent.includes('நம்ம ஊர்'));assert.equal(a.d.body.dataset.siteLang,'ta');assert(a.d.querySelector('.rev-actions a').href.includes('lungi-product-catalogue.html'));a.d.querySelector('[data-site-language=en]').click();assert(a.d.querySelector('h1').textContent.includes('Our town.'));});
 const deep=app('index.html','?product=PT-WC-01',true);
 test('buyer can reach a dedicated wholesale enquiry from the homepage',()=>assert(deep.d.querySelector('.rev-wholesale a').href.includes('podaturpet-textile-supplier-enquiry.html')));
 test('regional photographs are local files with attribution',()=>{for(const img of deep.d.querySelectorAll('.rev-region-grid img'))assert(fs.existsSync(path.join(root,new URL(img.src).pathname)));assert.equal(deep.d.querySelectorAll('.rev-region-grid figcaption').length,3);});
 test('homepage has one skip link and no repeated legacy photo galleries',()=>{assert.equal(a.d.querySelectorAll('.pt-skip,.skip-to-content,.skip').length,1);assert.equal(a.d.querySelectorAll('#lungi-lifestyle-gallery').length,0);});
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
 console.log(count+' website journey tests passed.');
}finally{opened.forEach(d=>d.window.close());}
