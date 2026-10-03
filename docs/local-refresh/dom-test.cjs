const {JSDOM}=require('jsdom');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..');
let passed=0;
function check(name,fn){fn();passed++;console.log('PASS '+name);}
function app(date='2026-10-03T06:00:00Z',enhance=true){
 const dom=new JSDOM(fs.readFileSync(path.join(root,'podaturpet-local-updates.html'),'utf8'),{url:'https://podaturpet.com/podaturpet-local-updates.html',runScripts:'outside-only'});
 const RealDate=dom.window.Date;
 dom.window.Date=class extends RealDate{constructor(...args){super(...(args.length?args:[date]));}static now(){return new RealDate(date).getTime();}};
 if(enhance)for(const name of ['podaturpet-editorial.js','podaturpet-global.js','podaturpet-local-updates.js'])dom.window.eval(fs.readFileSync(path.join(root,name),'utf8'));
 return dom;
}
let dom=app(undefined,false),d=dom.window.document;
check('dated news and twelve service cards available without scripts',()=>{assert.equal(d.querySelectorAll('[data-local-news]').length,4);assert.equal(d.querySelectorAll('.local-service-card').length,12);assert.equal(d.querySelectorAll('[data-local-news][hidden]').length,0);assert(d.querySelector('.local-controls').hidden);});dom.window.close();
dom=app();d=dom.window.document;const w=dom.window;
const cards=()=>[...d.querySelectorAll('[data-local-news]')].filter(x=>!x.hidden);
const search=d.getElementById('local-news-search'),category=d.getElementById('local-news-category');
function input(value){search.value=value;search.dispatchEvent(new w.Event('input'));}
check('English search finds the job fair',()=>{input('Job fair');assert.equal(cards().length,1);assert.equal(cards()[0].dataset.eventDate,'2026-10-10');});
check('Tamil search works in English mode',()=>{input('ட்ரோன்');assert.equal(cards().length,1);assert.equal(cards()[0].dataset.category,'education');});
check('combined topic and text filter has useful empty state',()=>{category.value='jobs';category.dispatchEvent(new w.Event('change'));assert.equal(cards().length,0);assert(!d.getElementById('local-news-empty').hidden);});
check('reset restores news and search focus',()=>{d.getElementById('local-news-reset').click();assert.equal(cards().length,4);assert.equal(d.activeElement,search);});
check('Tamil switch translates headline, count and status',()=>{d.querySelector('[data-site-language=ta]').click();assert.equal(d.documentElement.lang,'ta');assert.match(d.querySelector('h1').textContent,/பொதட்டூர்பேட்டை/);assert.match(d.getElementById('local-news-count').textContent,/செய்திகளில்/);assert.match(d.querySelector('.local-news-status').textContent,/அறிவிப்பு/);});
check('single heading and metadata retain canonical identity',()=>{assert.equal(d.querySelectorAll('h1').length,1);assert.equal(d.querySelector('link[rel=canonical]').href,'https://podaturpet.com/podaturpet-local-updates.html');for(const el of d.querySelectorAll('[data-site-en]'))assert.equal(el.children.length,0);});dom.window.close();
dom=app('2026-10-10T20:00:00Z');d=dom.window.document;
check('event expires after its Indian calendar date',()=>{assert.match(d.querySelector('[data-event-date] .local-news-status').textContent,/Event date passed/);});dom.window.close();
dom=app('2026-12-01T00:00:00Z');d=dom.window.document;
check('old undated-event notices are marked as older',()=>{for(const el of d.querySelectorAll('[data-local-news]:not([data-event-date]) .local-news-status'))assert.match(el.textContent,/Older notice/);});dom.window.close();
for(const file of ['index.html','index-ta.html','podaturpet-town-guide.html']){
 const d=new JSDOM(fs.readFileSync(path.join(root,file),'utf8')).window.document;
 check(file+' includes one integrated hub entry point',()=>{assert.equal(d.querySelectorAll('#local-information').length,1);assert(d.querySelector('#local-information a[href="/podaturpet-local-updates.html#official-news"]'));});
}
console.log(`Passed ${passed} local information checks`);
