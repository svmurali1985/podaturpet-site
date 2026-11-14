const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const {JSDOM,VirtualConsole}=require('jsdom');
const root=path.resolve(__dirname,'../..');
const tick=()=>new Promise(r=>setTimeout(r,15));
async function check(page,mobile){
 const dom=new JSDOM(fs.readFileSync(path.join(root,page),'utf8'),{url:'https://podaturpet.com/'+page,runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:new VirtualConsole()});
 const w=dom.window,d=w.document;w.matchMedia=()=>({matches:mobile,addEventListener(){}});w.HTMLElement.prototype.scrollIntoView=()=>{};
 for(const f of ['podaturpet-editorial.js','podaturpet-topic-nav.js'])w.eval(fs.readFileSync(path.join(root,f),'utf8'));
 const topics=[...d.querySelectorAll('.pt-topic')];assert.equal(topics.length,4);assert.equal(d.querySelectorAll('.pt-topic-links a').length,27);
 topics[0].querySelector('summary').click();await tick();assert(topics[0].open);
 topics[1].querySelector('summary').click();await tick();assert(topics[1].open);assert(!topics[0].open);
 const summary=topics[1].querySelector('summary');summary.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert(!topics[1].open);assert.equal(d.activeElement,summary);
 topics[2].querySelector('summary').click();await tick();d.body.click();await tick();assert(!topics[2].open);
 if(mobile){const button=d.querySelector('.site-menu-toggle');assert(!button.hidden);button.click();assert.equal(button.getAttribute('aria-expanded'),'true');button.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert.equal(button.getAttribute('aria-expanded'),'false');}
 if(page==='podaturpet-town-guide.html'){
  d.querySelector('[data-site-language="ta"]').click();assert(d.querySelector('.pt-topic summary').textContent.includes('நம்ம ஊர்'));assert.equal(d.documentElement.lang,'ta');
 }
 if(page.startsWith('index')){assert.equal(d.querySelectorAll('.pt-town-card').length,6);assert.equal(d.querySelectorAll('.lungi-overhead,#community-projects').length,0);assert.equal(d.querySelectorAll('#collection [data-design]').length,6);assert.equal(d.querySelectorAll('.lungi-market-card').length,3);assert(d.querySelector('h1').textContent.includes(page==='index-ta.html'?'பொதட்டூர்பேட்டை':'Podaturpet.'));}
 dom.window.close();console.log('PASS',page,mobile?'mobile menu':'desktop dropdowns');
}
(async()=>{for(const p of ['index.html','index-ta.html','podaturpet-town-guide.html','lungi-product-catalogue.html','lungi-wholesale-worldwide.html'])for(const m of [false,true])await check(p,m);})().catch(e=>{console.error(e);process.exit(1)});
