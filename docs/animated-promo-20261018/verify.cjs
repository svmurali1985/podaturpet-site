const {JSDOM}=require('jsdom'),fs=require('fs'),path=require('path'),assert=require('assert/strict');
const root=path.resolve(__dirname,'../..');let passed=0;
function app(reduce=false,save=false){
 const dom=new JSDOM(fs.readFileSync(path.join(root,'index.html'),'utf8'),{pretendToBeVisual:true,runScripts:'outside-only',url:'https://podaturpet.com/'}),w=dom.window;
 let io,plays=0,pauses=0,changed;
 w.matchMedia=()=>({matches:reduce,addEventListener:(type,fn)=>changed=fn});
 Object.defineProperty(w.navigator,'connection',{value:{saveData:save}});
 w.IntersectionObserver=class{constructor(fn){io=fn}observe(){}disconnect(){}};
 w.HTMLMediaElement.prototype.play=function(){plays++;return Promise.resolve()};
 w.HTMLMediaElement.prototype.pause=function(){pauses++};
 w.eval(fs.readFileSync(path.join(root,'podaturpet-business-promo.js'),'utf8'));
 return {dom,w,d:w.document,visible:v=>io([{isIntersecting:v}]),plays:()=>plays,pauses:()=>pauses,changed:e=>changed(e)};
}
function check(n,fn){fn();passed++;console.log('PASS '+n)}
let a=app();
check('no autoplay until visible',()=>assert.equal(a.plays(),0));
check('one autoplay attempt and native controls preserved',()=>{a.visible(true);a.visible(true);assert.equal(a.plays(),1);const v=a.d.querySelector('video');assert(v.controls&&v.muted&&v.loop);assert.equal(v.preload,'none');});
check('offscreen playback pauses without automatic restart',()=>{a.visible(false);assert.equal(a.pauses(),1);a.visible(true);assert.equal(a.plays(),1);});
check('captions follow seeking and language changes',()=>{const v=a.d.querySelector('video');v.currentTime=10;v.dispatchEvent(new a.w.Event('seeked'));assert.match(a.d.querySelector('.biz-promo-caption').textContent,/chatbot/);a.d.documentElement.lang='ta';a.d.dispatchEvent(new a.w.Event('podaturpet:language'));assert.match(a.d.querySelector('.biz-promo-caption').textContent,/சாட்பாட்/);v.currentTime=20;v.dispatchEvent(new a.w.Event('timeupdate'));assert.match(a.d.querySelector('.biz-promo-caption').textContent,/இலவசம்/);});
check('new reduced-motion preference pauses playback',()=>{const p=a.pauses();a.changed({matches:true});assert.equal(a.pauses(),p+1);});a.dom.window.close();
a=app(true);check('reduced motion does not autoplay',()=>{a.visible(true);assert.equal(a.plays(),0)});a.dom.window.close();
a=app(false,true);check('data saver does not autoplay',()=>{a.visible(true);assert.equal(a.plays(),0)});a.dom.window.close();
for(const f of ['index.html','index-ta.html']){
 const dom=new JSDOM(fs.readFileSync(path.join(root,f),'utf8')),d=dom.window.document;
 check(f+' has local sources, poster, two caption tracks and correct native fallback',()=>{assert.equal(d.querySelectorAll('.biz-promo-video').length,1);const v=d.querySelector('.biz-promo-video');assert.equal(v.getAttribute('width'),'720');assert.equal(v.getAttribute('height'),'450');for(const src of [v.getAttribute('poster'),...Array.from(v.querySelectorAll('source,track'),x=>x.getAttribute('src'))])assert(fs.existsSync(path.join(root,src)));assert.equal(v.querySelectorAll('track').length,2);assert.equal(d.querySelector('.biz-promo-caption').textContent,d.querySelector('.biz-promo-caption').dataset[f==='index.html'?'siteEn':'siteTa']);});dom.window.close();
}
console.log('Passed '+passed+' video integration checks. No live requests or video playback engine used.');
