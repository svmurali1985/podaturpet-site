const {JSDOM}=require('jsdom'),fs=require('fs'),path=require('path'),assert=require('assert/strict');
const root=path.resolve(__dirname,'../..');let passed=0;
function check(n,fn){fn();passed++;console.log('PASS '+n);}
for(const file of ['index.html','index-ta.html']){
 const dom=new JSDOM(fs.readFileSync(path.join(root,file),'utf8'),{url:'https://podaturpet.com/'+file,runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window,d=w.document;
 let utter,spoken=0,cancelled=0,paused=true;const video=d.querySelector('video');
 Object.defineProperty(video,'paused',{get:()=>paused});Object.defineProperty(video,'ended',{get:()=>false});
 video.play=()=>{paused=false;video.dispatchEvent(new w.Event('play'));return Promise.resolve()};video.pause=()=>{paused=true;video.dispatchEvent(new w.Event('pause'));};
 w.speechSynthesis={getVoices:()=>[{name:'English',lang:'en-US',localService:true},{name:'Tamil',lang:'ta-IN',localService:true}],speak:u=>{utter=u;spoken++},cancel:()=>{cancelled++},resume(){},pause(){},addEventListener(){}};
 w.SpeechSynthesisUtterance=class{constructor(text){this.text=text}};
 for(const js of ['content/business-promo-narration.js','podaturpet-promo-voice.js'])w.eval(fs.readFileSync(path.join(root,js),'utf8'));
 check(file+' never starts audio automatically and marks unsupported voices',()=>{assert.equal(spoken,0);assert.equal(d.querySelector('.promo-sound-toggle').hidden,false);assert.equal(d.querySelectorAll('.promo-voice-language option').length,18);assert(d.querySelector('.promo-voice-language option[value=fr]').disabled);});
 check(file+' sound enables original video audio and selected voice',()=>{d.querySelector('.promo-sound-toggle').click();assert.equal(video.muted,false);assert(spoken>=1);assert.equal(utter.lang,file==='index.html'?'en-US':'ta-IN');assert.equal(video.loop,false);});
 check(file+' narration holds a scene until speech finishes, then advances',()=>{video.currentTime=2.9;video.dispatchEvent(new w.Event('timeupdate'));assert.equal(video.paused,true);utter.onend();assert.equal(video.currentTime,3);assert.equal(video.paused,false);video.dispatchEvent(new w.Event('seeked'));assert.equal(utter.lang,file==='index.html'?'en-US':'ta-IN');});
 check(file+' switching voice and stopping audio cancels narration',()=>{const sel=d.querySelector('.promo-voice-language');sel.value='ta';sel.dispatchEvent(new w.Event('change'));assert.equal(utter.lang,'ta-IN');d.querySelector('.promo-sound-toggle').click();assert.equal(video.muted,true);assert.equal(video.loop,true);assert(cancelled>0);});dom.window.close();
}
const news=new JSDOM(fs.readFileSync(path.join(root,'podaturpet-local-updates.html'),'utf8')).window.document;
check('news keeps publication dates, eight sources and separate credited photographs',()=>{assert.equal(news.querySelectorAll('[data-local-news]').length,8);assert.equal(news.querySelectorAll('.local-photo-grid img').length,2);for(const date of ['2026-10-14','2026-10-15'])assert(news.querySelector('[data-published="'+date+'"]'));assert(news.querySelector('.local-photo-grid a[href*="creativecommons.org/licenses/by-sa/4.0"]'));});news.defaultView.close();
console.log('Passed '+passed+' voice/news checks with mocked speech engine.');
