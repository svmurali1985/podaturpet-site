const {JSDOM}=require('jsdom'),fs=require('fs'),assert=require('assert/strict');
let checks=0;
for(const file of ['index.html','index-ta.html']){
 const d=new JSDOM(fs.readFileSync(file,'utf8'),{url:'https://podaturpet.com/'+file,runScripts:'outside-only'}).window;
 const doc=d.document;
 assert.equal(doc.querySelectorAll('h1').length,1);checks++;
 assert.equal(doc.querySelectorAll('.review-resource-grid article').length,3);checks++;
 assert(doc.querySelector('#agriculture'));checks++;
 assert(doc.querySelector('#town').compareDocumentPosition(doc.querySelector('#collection'))&4);checks++;
 for(const img of doc.querySelectorAll('.portal-cover img')){assert(img.width>0&&img.height>0);checks++}
 d.matchMedia=()=>({matches:true,addEventListener(){}});d.scrollTo=()=>{};d.HTMLElement.prototype.scrollIntoView=()=>{};d.navigator.sendBeacon=()=>true;
 d.fetch=async()=>({ok:true,json:async()=>({pageViews:0,siteViews:0,locations:[],comments:[]})});
 d.IntersectionObserver=class{observe(){}disconnect(){}};
 for(const script of [...doc.scripts]){
  if(script.type==='application/ld+json'){JSON.parse(script.textContent);continue;}
  if(script.src){const u=new URL(script.src);if(u.origin===d.location.origin)d.eval(fs.readFileSync('.'+u.pathname,'utf8'));}
  else if(script.textContent.trim())d.eval(script.textContent);
 }
 for(const lang of ['en','ta']){
  doc.querySelector('[data-site-language="'+lang+'"]').click();
  for(const el of doc.querySelectorAll('.portal-cover [data-site-en],.portal-discover [data-site-en],.portal-agriculture [data-site-en]')){
   assert.equal(el.textContent,el.dataset[lang==='ta'?'siteTa':'siteEn']);checks++;
  }
 }
 console.log('PASS new homepage content and language switching:',file);
}
console.log(checks+' assertions passed');
process.exit(0);
