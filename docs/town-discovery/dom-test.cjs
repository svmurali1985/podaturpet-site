const {JSDOM}=require('jsdom');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..');
let passed=0;
const check=(name,fn)=>{fn();passed++;console.log('PASS '+name);};
function app(file,enhance=true){
 const dom=new JSDOM(fs.readFileSync(path.join(root,file),'utf8'),{url:'https://podaturpet.com/'+file,runScripts:'outside-only'});
 if(enhance){for(const script of ['podaturpet-editorial.js','podaturpet-global.js',...(file==='podaturpet-tourist-places.html'?['podaturpet-discovery.js']:[])])dom.window.eval(fs.readFileSync(path.join(root,script),'utf8'));}
 return dom;
}
const staticDom=app('podaturpet-tourist-places.html',false),sd=staticDom.window.document;
check('all ten destination summaries and links available without JavaScript',()=>{assert.equal(sd.querySelectorAll('[data-destination]').length,10);assert.equal(sd.querySelectorAll('[data-destination][hidden]').length,0);assert(sd.querySelector('.discovery-controls').hidden);});staticDom.window.close();
const dom=app('podaturpet-tourist-places.html'),w=dom.window,d=w.document;
const visible=()=>[...d.querySelectorAll('[data-destination]')].filter(c=>!c.hidden);
const search=d.querySelector('#destination-search'),kind=d.querySelector('#destination-kind');
const input=q=>{search.value=q;search.dispatchEvent(new w.Event('input'));};
check('enhanced controls start with all ten places',()=>{assert(!d.querySelector('.discovery-controls').hidden);assert.equal(visible().length,10);});
check('English name search',()=>{input('Mahendravadi');assert.deepEqual(visible().map(x=>x.id),['mahendravadi']);});
check('Tamil search works while English is selected',()=>{input('மகேந்திரவாடி');assert.deepEqual(visible().map(x=>x.id),['mahendravadi']);});
check('category and text filters combine',()=>{input('');kind.value='temples';kind.dispatchEvent(new w.Event('change'));assert.equal(visible().length,4);input('Poondi');assert.equal(visible().length,0);assert(!d.querySelector('#destination-empty').hidden);});
check('reset restores all cards and focus',()=>{d.querySelector('#destination-reset').click();assert.equal(visible().length,10);assert.equal(d.activeElement,search);});
check('language switch translates content and controls without deleting links',()=>{d.querySelector('[data-site-language="ta"]').click();assert.equal(d.documentElement.lang,'ta');assert.match(d.querySelector('h1').textContent,/பொதட்டூர்பேட்டை/);assert.match(d.querySelector('#destination-count').textContent,/இடங்களில்/);assert.equal(d.querySelectorAll('[data-destination] .discovery-links a').length,20);assert.match(d.querySelector('#destination-kind option').textContent,/அனைத்து/);});
check('English search remains valid after Tamil switch',()=>{input('Sholingur');assert.deepEqual(visible().map(x=>x.id),['sholingur']);});
check('direct destination hash restores a filtered-out card',()=>{w.location.hash='#pulicat';w.dispatchEvent(new w.HashChangeEvent('hashchange'));assert(!d.querySelector('#pulicat').hidden);assert.equal(visible().length,10);});
check('structured data destinations match visible anchors',()=>{const data=[...d.querySelectorAll('script[type="application/ld+json"]')].map(x=>JSON.parse(x.textContent));const list=data.find(x=>x['@type']==='CollectionPage').mainEntity.itemListElement;assert.equal(list.length,10);for(const i of list)assert(d.getElementById(new URL(i.url).hash.slice(1)));});
check('new bilingual leaves contain no nested interactive content',()=>{for(const el of d.querySelectorAll('.discovery-guide [data-site-en]'))assert.equal(el.children.length,0);});
dom.window.close();
for(const name of ['about-podaturpet.html','podaturpet-tourist-places.html']){
 const dom=app(name),d=dom.window.document;
 check(name+' has one H1, correct canonical and preserved community scripts',()=>{assert.equal(d.querySelectorAll('h1').length,1);assert.equal(d.querySelector('link[rel="canonical"]').href,'https://podaturpet.com/'+name);for(const file of ['podaturpet-feedback.js','podaturpet-visitor-tracking.js'])assert([...d.scripts].some(s=>s.src.includes(file)));});
 if(name==='about-podaturpet.html'){
  check('town facts grid contains only the six fact tiles',()=>{assert.equal(d.querySelector('.facts').children.length,6);assert.equal(d.querySelector('#town-history').closest('.facts'),null);});
  check('town profile switches to Tamil while preserving business links',()=>{d.querySelector('[data-site-language="ta"]').click();assert.match(d.querySelector('#town-history h2').textContent,/ஊர்/);assert(d.querySelector('.pt-wholesale-bridge a[href="/lungi-product-catalogue.html"]'));});
 }
 dom.window.close();
}
console.log(`Passed ${passed} discovery checks`);
