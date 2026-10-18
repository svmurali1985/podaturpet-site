const fs=require('fs'),assert=require('assert/strict'),{JSDOM}=require('jsdom');let checks=0;
for(const file of ['index.html','index-ta.html']){
 const w=new JSDOM(fs.readFileSync(file,'utf8'),{url:'https://podaturpet.com/'+file,runScripts:'outside-only'}).window,d=w.document;
 w.matchMedia=()=>({matches:false,addEventListener(){}});w.scrollTo=()=>{};
 let paused=true;const video=d.querySelector('video');Object.defineProperty(video,'paused',{get:()=>paused});video.play=()=>{paused=false;video.dispatchEvent(new w.Event('play'));return Promise.resolve()};video.pause=()=>{paused=true;video.dispatchEvent(new w.Event('pause'));};w.fetch=async()=>({ok:true,json:async()=>({pageViews:12,siteViews:345,locations:[{city:'Chennai',views:12}]})});w.AbortSignal.timeout=()=>undefined;
 assert.equal(d.querySelectorAll('form').length,0);checks++;
 assert.equal(d.querySelectorAll('h1').length,1);checks++;
 assert.equal(d.querySelectorAll('main>section').length,7);checks++;
 assert.equal(d.querySelectorAll('link[rel=stylesheet]').length,1);checks++;
 assert.equal(d.querySelectorAll('.product').length,3);checks++;
 assert.equal(d.querySelectorAll('a[href^="https://wa.me/"]').length,1);checks++;
 assert.equal(d.querySelectorAll('#contact').length,1);checks++;assert.equal(d.querySelector('main>section').id,'services');assert.equal(d.querySelectorAll('video').length,1);assert.equal(d.querySelectorAll('.town-resource-grid>a').length,6);assert.equal(d.querySelectorAll('.nearby-grid article').length,3);assert.equal(d.querySelectorAll('.notice-grid time').length,2);assert(!/domain|hosting/i.test(d.querySelector('#services').textContent));checks+=6;
 for(const img of d.images){assert(+img.width>0&&+img.height>0);checks++;}
 for(const s of d.querySelectorAll('script[type="application/ld+json"]')){JSON.parse(s.textContent);checks++;}
 for(const s of d.querySelectorAll('script[src]'))w.eval(fs.readFileSync('.'+new URL(s.src).pathname,'utf8'));
 for(const lang of ['ta','en']){
 d.querySelector('[data-site-language='+lang+']').click();assert.equal(d.documentElement.lang,lang);checks++;
 for(const el of d.querySelectorAll('[data-site-en][data-site-ta]')){assert.equal(el.children.length,0);assert.equal(el.textContent,el.dataset[lang==='ta'?'siteTa':'siteEn']);checks++;}
 }
 assert.equal(d.querySelectorAll('#pt-public-views').length,1);checks++;
 assert.equal(d.querySelectorAll('#pt-feedback,form').length,0);checks++;
 w.eval(fs.readFileSync('podaturpet-feedback.js','utf8'));assert.equal(d.querySelectorAll('#pt-feedback,form').length,0);checks++;
 assert.equal(d.querySelector('#pt-public-views details'),null); // Pending mocked async stats.
 d.querySelector('.site-menu-toggle').click();assert.equal(d.querySelector('.site-menu-toggle').getAttribute('aria-expanded'),'true');checks++;
 d.querySelector('.biz-promo-toggle').click();assert.equal(paused,false);d.querySelector('.biz-promo-toggle').click();assert.equal(paused,true);assert.equal(d.querySelectorAll('script[src*=feedback]').length,0);checks+=3;console.log('PASS',file);w.close();
}
console.log(checks+' assertions passed (DOM and mocked network; not rendered browser QA)');
