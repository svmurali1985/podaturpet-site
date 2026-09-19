'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),{JSDOM}=require('jsdom');
const R=path.resolve(__dirname,'../..'),C=require('../core.js');let count=0;const opened=[];
function test(name,fn){fn();count++;console.log('PASS',name);}
function app(lang='en',options={}){
 const dom=new JSDOM(fs.readFileSync(path.join(R,'people-information-hub'+(lang==='ta'?'-ta':'')+'.html'),'utf8'),{url:'https://podaturpet.com/people-information-hub.html',runScripts:'outside-only'});opened.push(dom);const w=dom.window,d=w.document,network=[];
 w.fetch=(...a)=>{network.push(a);throw Error('network');};w.navigator.sendBeacon=(...a)=>{network.push(a);return false;};w.setInterval=()=>1;w.HTMLElement.prototype.scrollIntoView=()=>{};
 if(options.gpc)Object.defineProperty(w.navigator,'globalPrivacyControl',{value:true});
 if(options.stored)w.localStorage.setItem('podaturpet.life.counts.v1',options.stored);
 if(options.deny)Object.getPrototypeOf(w.localStorage).setItem=()=>{throw Error('denied');};
 for(const f of ['people-hub/data.js','people-hub/core.js','people-hub/hub.js','podaturpet-assistant.js','podaturpet-visitor-tracking.js'])w.eval(fs.readFileSync(path.join(R,f),'utf8'));
 const $=id=>d.getElementById(id),submit=id=>$(id).dispatchEvent(new w.Event('submit',{cancelable:true}));
 function ask(q){$('hub-search').value=q;submit('life-ask-form');}
 return {w,d,$,submit,ask,network};
}
try{
 test('education known worked example and cent rounding',()=>{assert.deepEqual(C.educationCost({tuition:'1000',monthly:'100',study:'10',other:'100',funding:'1000',save:'3'}),{total:2100,gap:1100,monthly:366.67});});
 test('funding above cost never creates a negative target',()=>assert.equal(C.educationCost({tuition:'0',monthly:'0',study:'1',other:'0',funding:'1',save:'1'}).gap,0));
 test('invalid money and months rejected',()=>{for(const value of ['-1','Infinity','1e5','','100000001','0.001'])assert.throws(()=>C.educationCost({tuition:value,monthly:'0',study:'1',other:'0',funding:'0',save:'1'}));for(const n of ['0','121','1.5'])assert.throws(()=>C.educationCost({tuition:'0',monthly:'0',study:n,other:'0',funding:'0',save:'1'}));});
 test('same-budget quote deducts fees in the correct currencies',()=>assert.equal(C.transferQuote({budget:'100',fee:'5',rate:'80',deduction:'20'}).receive,7580));
 test('invalid quote does not produce misleading money',()=>{for(const v of [{budget:'5',fee:'6',rate:'1',deduction:'0'},{budget:'5',fee:'0',rate:'0',deduction:'0'},{budget:'5',fee:'0',rate:'1',deduction:'6'}])assert.throws(()=>C.transferQuote(v));});
 const a=app(),{$,w,d}=a;
 test('one inline assistant, no duplicate floating assistant or storage default',()=>{assert.equal(d.querySelectorAll('#life-assistant').length,1);assert.equal(d.querySelectorAll('#podaturpet-assistant-launcher').length,0);assert.equal(w.localStorage.length,0);});
 test('natural English question routes to Aadhaar',()=>{a.ask('How do I update my Aadhaar?');assert($('life-answer').querySelector('a[href="#guide-aadhaar"]'));});
 test('natural Tamil question routes to scholarship',()=>{a.ask('எனக்கு கல்வி உதவித்தொகை வேண்டும்');assert($('life-answer').querySelector('a[href="#guide-scholarships"]'));});
 test('unknown questions get explicit fallback',()=>{a.ask('zzyyxxqq');assert($('life-answer').textContent.includes('could not match'));});
 test('ID-like query is discarded and never retained in URL',()=>{a.ask('Aadhaar 1234 5678 9012');assert.equal($('hub-search').value,'');assert(!$('life-answer').textContent.includes('1234'));assert(!w.location.href.includes('1234'));});
 test('untrusted input cannot create active nodes',()=>{a.ask('<img src=x onerror=alert(1)>');assert.equal($('life-answer').querySelector('img'),null);});
 test('matching education guide offers the integrated calculator',()=>{a.ask('education cost');assert($('life-answer').querySelector('a[href="#life-education"]'));});
 test('read-aloud fails safely without a local voice',()=>{$('life-listen').click();assert($('life-voice-status').textContent.includes('No suitable'));});
 test('remote voice is never selected',()=>{let spoke=false;w.speechSynthesis={getVoices:()=>[{lang:'en-US',localService:false}],speak:()=>{spoke=true;},cancel:()=>{}};$('life-listen').click();assert.equal(spoke,false);});
 const edu=$('education-form');
 test('real calculator form produces result and clears obsolete result on editing',()=>{for(const [k,v] of Object.entries({tuition:'1000',monthly:'100',study:'10',other:'100',funding:'1000',save:'3'}))edu.elements[k].value=v;a.submit('education-form');assert($('education-result').textContent.includes('366.67'));edu.elements.monthly.dispatchEvent(new w.Event('input',{bubbles:true}));assert.equal($('education-result').textContent,'');});
 const hf=$('life-help-form');
 test('human help requires explicit consent, no draft link before it',()=>{a.submit('life-help-form');assert($('help-preview').hidden);assert(!$('help-wa').hasAttribute('href'));});
 test('preview includes only chosen request, not prior query or calculator amounts',()=>{hf.elements.consent.checked=true;hf.elements.notes.value='Please explain the official steps';a.submit('life-help-form');assert(!$('help-preview').hidden);const body=new URL($('help-wa').href).searchParams.get('text');assert(body.includes('Please explain'));assert(!body.includes('education cost'));assert(!body.includes('1000'));assert.equal(body,$('help-message').textContent);});
 test('editing invalidates both outbound drafts',()=>{hf.elements.notes.value='Changed';hf.elements.notes.dispatchEvent(new w.Event('input',{bubbles:true}));assert($('help-preview').hidden);assert(!$('help-wa').hasAttribute('href'));assert(!$('help-email').hasAttribute('href'));});
 test('withdrawing consent destroys the preview',()=>{a.submit('life-help-form');hf.elements.consent.checked=false;hf.elements.consent.dispatchEvent(new w.Event('change',{bubbles:true}));assert.equal($('help-message').textContent,'');assert(!$('help-wa').hasAttribute('href'));});
 test('email and long identifier patterns are blocked in request notes',()=>{hf.elements.consent.checked=true;for(const v of ['me@example.com','1234567890']){hf.elements.notes.value=v;a.submit('life-help-form');assert($('help-preview').hidden);}});
 test('default interactions create no analytics storage or network calls',()=>{assert.equal(w.localStorage.length,0);assert.deepEqual(a.network,[]);});
 const cb=$('life-count-consent');
 test('explicit counts opt-in only stores bounded stage totals',()=>{cb.checked=true;cb.dispatchEvent(new w.Event('change'));a.ask('passport');const v=JSON.parse(w.localStorage.getItem('podaturpet.life.counts.v1'));assert.equal(v.counts.view,1);assert.equal(v.counts.ask,1);assert.deepEqual(Object.keys(v).sort(),['counts','version']);assert(!JSON.stringify(v).includes('passport'));});
 test('unknown analytics events cannot store query text',()=>{d.dispatchEvent(new w.CustomEvent('podaturpet:life-event',{detail:{stage:'private query',query:'secret'}}));assert(!w.localStorage.getItem('podaturpet.life.counts.v1').includes('secret'));});
 test('counts deletion preserves unrelated tools',()=>{w.localStorage.setItem('unrelated','keep');cb.checked=false;cb.dispatchEvent(new w.Event('change'));assert.equal(w.localStorage.getItem('podaturpet.life.counts.v1'),null);assert.equal(w.localStorage.getItem('unrelated'),'keep');});
 test('GPC blocks counting even with saved consent',()=>{const b=app('en',{gpc:true,stored:JSON.stringify({version:1,counts:{view:1,ask:0,guide:0,calculate:0,official:0,preview:0,handoff:0}})});assert(b.$('life-count-consent').disabled);assert.equal(b.w.localStorage.getItem('podaturpet.life.counts.v1'),null);});
 test('storage failure does not break question answering',()=>{const b=app('en',{deny:true});b.$('life-count-consent').checked=true;b.$('life-count-consent').dispatchEvent(new b.w.Event('change'));b.ask('aadhaar');assert(b.$('life-answer').textContent.includes('Aadhaar'));assert(!b.$('life-count-consent').checked);});
 test('Tamil UI has translated answers, forms and consent',()=>{const b=app('ta');b.ask('ஆதார்');assert(b.$('life-answer').textContent.includes('ஆதார்'));assert(b.$('life-help-form').textContent.includes('ஒப்புதல்'));assert.equal(b.d.documentElement.lang,'ta');});
 test('all new controls have accessible labels and no duplicate IDs',()=>{for(const n of d.querySelectorAll('input,select,textarea'))assert(n.closest('label')||d.querySelector('label[for="'+n.id+'"]'));const ids=[...d.querySelectorAll('[id]')].map(n=>n.id);assert.equal(ids.length,new Set(ids).size);});
 test('inline app still makes no network calls after opt-in',()=>assert.deepEqual(a.network,[]));
 // Reuse existing directory filter and verify the Tamil alias route.
 const dd=new JSDOM(fs.readFileSync(path.join(R,'podaturpet-local-business-directory.html'),'utf8'),{url:'https://podaturpet.com/',runScripts:'outside-only'});opened.push(dd);dd.window.eval(fs.readFileSync(path.join(R,'podaturpet-community.js'),'utf8'));
 test('existing 24 directory categories remain with Tamil search',()=>{const d=dd.window.document;assert.equal(d.querySelectorAll('.retail-card').length,24);assert([...d.querySelectorAll('.retail-card')].every(n=>/[\u0B80-\u0BFF]/.test(n.dataset.search)));const f=d.getElementById('retail-search');f.value='மளிகை';f.dispatchEvent(new dd.window.Event('input'));assert([...d.querySelectorAll('.retail-card')].some(n=>!n.hidden));assert([...d.querySelectorAll('.retail-card')].some(n=>n.hidden));});

 const legacy=new JSDOM('<!doctype html><html><head></head><body></body></html>',{url:'https://podaturpet.com/',runScripts:'outside-only'});opened.push(legacy);legacy.window.eval(fs.readFileSync(path.join(R,'podaturpet-assistant.js'),'utf8'));
 function legacyAsk(q){const d=legacy.window.document;d.querySelector('.pta-input').value=q;d.querySelector('.pta-form').dispatchEvent(new legacy.window.Event('submit',{cancelable:true}));return [...d.querySelectorAll('.pta-message-bot')].at(-1);}
 test('existing assistant routes Singapore visa to hub, not lungi sales',()=>{const answer=legacyAsk('Singapore visa');assert(answer.querySelector('a[href="/people-information-hub.html#life-assistant"]'));});
 test('existing assistant retains lungi wholesale routing',()=>{const answer=legacyAsk('lungi wholesale price');assert(!answer.textContent.includes('Tamil Life Assistant'));assert(answer.querySelector('a'));});
 console.log(count+' Life Assistant tests passed.');
}finally{opened.forEach(x=>x.window.close());}
