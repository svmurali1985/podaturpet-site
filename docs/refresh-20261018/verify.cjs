'use strict';
const {JSDOM,VirtualConsole}=require('jsdom'),fs=require('fs'),path=require('path'),assert=require('assert/strict');
const root=path.resolve(__dirname,'../..');let passed=0;
const files=['index.html','index-ta.html','lungi-product-catalogue.html','podaturpet-textile-supplier-enquiry.html','podaturpet-government-offices.html','podaturpet-local-updates.html','podaturpet-tourist-places.html','podaturpet-town-guide.html','podaturpet-travel-pin-code.html','podaturpet-weaving-textiles.html'];
for(const file of files){
 const errors=[],vc=new VirtualConsole();vc.on('jsdomError',err=>errors.push(err.message));
 const dom=new JSDOM(fs.readFileSync(path.join(root,file),'utf8'),{url:'https://podaturpet.com/'+file,runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:vc});
 const w=dom.window,d=w.document;w.matchMedia=()=>({matches:true,addEventListener(){}});w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};w.navigator.sendBeacon=()=>true;
 w.fetch=async()=>({ok:true,json:async()=>({pageViews:0,siteViews:0,locations:[],comments:[]})});
 w.IntersectionObserver=class{observe(){}disconnect(){}};
 try{
  for(const script of [...d.scripts]){
   if(script.type==='application/ld+json'){JSON.parse(script.textContent);continue;}
   if(script.src){const u=new URL(script.src);if(u.origin===w.location.origin)w.eval(fs.readFileSync(path.join(root,u.pathname),'utf8'));}
   else if(script.textContent.trim())w.eval(script.textContent);
  }
  assert.deepEqual(errors,[]);assert.equal(d.querySelectorAll('h1').length,1);
  assert(d.querySelector('link[rel=canonical]'));assert(d.querySelector('.pt-skip'));
  const menu=d.querySelector('.site-menu-toggle');menu.click();assert.equal(menu.getAttribute('aria-expanded'),'true');menu.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert.equal(menu.getAttribute('aria-expanded'),'false');
  for(const lang of ['ta','en']){
   d.querySelector('[data-site-language='+lang+']').click();assert.equal(d.documentElement.lang,lang);
   for(const leaf of d.querySelectorAll('.refresh-panel [data-site-en]')){assert.equal(leaf.children.length,0);assert.equal(leaf.textContent,leaf.dataset[lang==='ta'?'siteTa':'siteEn']);}
  }
  for(const img of d.querySelectorAll('.refresh-panel img')){assert(img.width>0&&img.height>0);assert.equal(img.getAttribute('loading'),'lazy');assert(img.srcset);}
  if(file==='index-ta.html'){
   const raw=new JSDOM(fs.readFileSync(path.join(root,file),'utf8')).window.document;
   for(const leaf of raw.querySelectorAll('.refresh-panel [data-site-ta]'))assert.equal(leaf.textContent,leaf.dataset.siteTa);raw.defaultView.close();
  }
  console.log('PASS '+file+' script initialization, navigation, bilingual content and metadata');passed++;
 }finally{dom.window.close();}
}
console.log('Passed '+passed+' refreshed-page integration checks (mocked network, no external writes).');
