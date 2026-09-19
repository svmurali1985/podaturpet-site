'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),cp=require('child_process'),{JSDOM,VirtualConsole}=require('jsdom');
const root=path.resolve(__dirname,'../..'),C=require('../core.js');let passed=0;const opened=[];
function test(name,fn){fn();passed++;console.log('PASS',name);}
// Fixtures come from the real validated model and the production template, in memory only.
const python=`import sys,json,copy\nfrom pathlib import Path\nsys.path.insert(0,str(Path(sys.argv[1])/'tools'))\nsys.path.insert(0,str(Path(sys.argv[1])/'tools/tests'))\nfrom marketplace_test import application,evidence\nfrom marketplace_model import review,dataset\nfrom marketplace_template import render\na=application();p=review(a,evidence());b=application('test-english');b['name']='SECOND QA FIXTURE';b['languages']=['en'];q=review(b,evidence());d=dataset([p,q]);print(json.dumps({'data':d,'html':render([p,q])}))`;
const fixture=JSON.parse(cp.execFileSync('python3',['-c',python,root],{encoding:'utf8'}));
function app({empty=false,gpc=false,denied=false,hub=false,lang='en'}={}){
 let html=fs.readFileSync(path.join(root,hub?'people-information-hub'+(lang==='ta'?'-ta':'')+'.html':'podaturpet-local-business-directory.html'),'utf8');
 if(!hub&&!empty)html=html.replace(/<!-- PT:content:businesses:START -->[\s\S]*?<!-- PT:content:businesses:END -->/,'<!-- PT:content:businesses:START -->'+fixture.html+'<!-- PT:content:businesses:END -->');
 const errors=[],network=[],vc=new VirtualConsole();vc.on('jsdomError',e=>{if(!e.message.includes('navigation'))errors.push(e.message);});
 const dom=new JSDOM(html,{url:'https://podaturpet.com/'+(hub?'people-information-hub.html':'podaturpet-local-business-directory.html'),runScripts:'outside-only',virtualConsole:vc});opened.push(dom);const w=dom.window,d=w.document;
 w.HTMLElement.prototype.scrollIntoView=()=>{};w.setInterval=()=>1;w.Blob=class{constructor(parts){this.body=parts.join('');}};w.navigator.sendBeacon=(url,body)=>{network.push(JSON.parse(body.body));return true;};w.fetch=()=>{throw Error('Unexpected fetch');};
 if(gpc)Object.defineProperty(w.navigator,'globalPrivacyControl',{value:true});
 if(denied)Object.getPrototypeOf(w.localStorage).setItem=()=>{throw Error('storage denied');};
 w.PodaturpetServicesData=JSON.parse(JSON.stringify(fixture.data));if(empty)w.PodaturpetServicesData.providers=[];
 if(hub)for(const f of ['people-hub/data.js','people-hub/core.js','people-hub/hub.js','podaturpet-assistant.js','podaturpet-visitor-tracking.js'])w.eval(fs.readFileSync(path.join(root,f),'utf8'));
 else for(const f of ['people-hub/core.js','podaturpet-community.js','podaturpet-visitor-tracking.js'])w.eval(fs.readFileSync(path.join(root,f),'utf8'));
 const $=id=>d.getElementById(id),submit=id=>$(id).dispatchEvent(new w.Event('submit',{cancelable:true}));
 function ask(q){$('market-question').value=q;submit('market-ask');}
 function search(){submit('market-search');}
 return {w,d,$,submit,ask,search,network,errors,visible:()=>[...d.querySelectorAll('[data-provider]')].filter(n=>!n.hidden)};
}
try{
 const D=fixture.data;
 test('exact Tanglish example extracts category, location and language',()=>{const p=C.marketParse('Toronto la Tamil accountant venum',D);assert.equal(p.service,'accounting');assert.equal(p.city,'Toronto');assert.equal(p.country,'CA');assert.equal(p.language,'ta');});
 test('Tamil phrase retains Tamil language marks',()=>{const p=C.marketParse('டொராண்டோ தமிழ் கணக்காளர் வேண்டும்',D);assert.equal(p.service,'accounting');assert.equal(p.city,'Toronto');});
 test('unknown city can be supplied without silently inventing a country',()=>{const p=C.marketParse('Zurich la Tamil accountant venum',D);assert.equal(p.city,'zurich');assert.equal(p.country,'');});
 test('service aliases avoid accidental English substring matches',()=>assert.equal(C.marketParse('I like the landscape',D).service,''));
 test('informational intent recognized before optional provider routing',()=>assert(C.marketParse('How to apply for immigration Canada',D).information));
 test('all 40 categories have bilingual names and 18 are launch enabled',()=>{assert.equal(D.services.length,40);assert.equal(D.services.filter(s=>s.launch).length,18);assert(D.services.every(s=>s.name.en&&s.name.ta));});
 const f={service:'accounting',country:'CA',region:'Ontario',city:'Toronto',language:'ta',mode:'local'};
 test('service, country, region, city and language match together',()=>assert.deepEqual(C.marketMatch(D.providers,f,D).map(p=>p.id),['test-accountant']));
 test('no result for another city, language or country',()=>{for(const patch of [{city:'London'},{language:'fr'},{country:'US'}])assert.equal(C.marketMatch(D.providers,{...f,...patch},D).length,0);});
 test('remote choice never silently returns a local-only provider',()=>assert.equal(C.marketMatch(D.providers,{...f,mode:'remote'},D).length,0));
 test('expired providers excluded',()=>{const p=JSON.parse(JSON.stringify(D.providers[0]));p.checks.valid_until='2000-01-01';assert.equal(C.marketMatch([p],f,D).length,0);});
 test('currency is CAD for a Canadian quote, never hardcoded INR',()=>{const price=C.marketPrice(D.providers.find(p=>p.id==='test-accountant'),'en',D.ui.en);assert(price.includes('CAD'));assert(!price.includes('INR'));});
 const a=app(),{$,w,d}=a;
 test('directory initializes Tamil-first with no new duplicate directory',()=>{assert.equal(d.querySelectorAll('#service-marketplace').length,1);assert.equal($('service-marketplace').lang,'ta');assert.equal(d.querySelectorAll('.retail-card').length,24);assert.equal(a.errors.length,0);});
 test('existing page view happens once; no service events before consent',()=>{assert.equal(a.network.length,1);assert.equal(a.network[0].event,'page_view');assert.equal(w.localStorage.length,0);});
 test('full Tanglish search requires confirm step then finds Tamil provider',()=>{a.ask('Toronto la Tamil accountant venum');assert.equal($('market-service').value,'accounting');assert.equal($('market-country').value,'CA');assert.equal(a.visible().length,0);a.search();assert.deepEqual(a.visible().map(n=>n.dataset.provider),['test-accountant']);assert($('market-official-links').textContent.includes('CPA Ontario'));});
 test('profile uses dated scoped checks without fake star ratings',()=>{const p=d.querySelector('[data-provider="test-accountant"]');assert(p.textContent.includes('CAD'));assert(!p.textContent.includes('★★★★★'));assert(p.querySelector('time'));});
 const open=()=>d.querySelector('[data-provider-contact="test-accountant"]').click();
 test('contact recipient is fixed to the selected provider and draft requires consent',()=>{open();assert.equal($('market-recipient').textContent,'ISOLATED QA ACCOUNTANT');a.submit('market-contact-form');assert($('market-preview').hidden);assert(!$('market-handoff').hasAttribute('href'));});
 let ref;
 test('consented draft includes exact visible message and random reference',()=>{$('market-consent').checked=true;$('market-note').value='Please quote for a consultation';a.submit('market-contact-form');assert(!$('market-preview').hidden);const link=new URL($('market-handoff').href);assert.equal(link.hostname,'wa.me');assert.equal(link.searchParams.get('text'),$('market-message').textContent);ref=$('market-reference').textContent.match(/PS-[A-F0-9]{16}/)[0];assert(ref);assert(!w.localStorage.length);});
 test('editing revokes the contact link and reference',()=>{$('market-note').value='New request';$('market-note').dispatchEvent(new w.Event('input',{bubbles:true}));assert($('market-preview').hidden);assert(!$('market-handoff').hasAttribute('href'));assert.equal($('market-reference').textContent,'');});
 test('sensitive text does not produce an outbound draft',()=>{$('market-note').value='my account 123456789012';a.submit('market-contact-form');assert($('market-preview').hidden);});
 test('withdrawal destroys prepared draft',()=>{$('market-note').value='General consultation';a.submit('market-contact-form');$('market-consent').checked=false;$('market-consent').dispatchEvent(new w.Event('change',{bubbles:true}));assert(!$('market-handoff').hasAttribute('href'));});
 test('website contact never transmits notes as a query string',()=>{open();$('market-channel').value='website';$('market-channel').dispatchEvent(new w.Event('change',{bubbles:true}));$('market-consent').checked=true;$('market-note').value='never send this';a.submit('market-contact-form');assert.equal($('market-handoff').href,'https://example.com/');assert(!$('market-message').textContent.includes('never send this'));});
 test('switching language revokes contact and translates visible controls',()=>{d.querySelector('[data-market-language="en"]').click();assert($('market-contact').hidden);assert.equal($('service-marketplace').lang,'en');assert($('market-search').textContent.includes('Find matching'));});
 test('a fresh parsed question clears a prior location and language',()=>{a.ask('Toronto la Tamil accountant venum');a.ask('bookkeeper');assert.equal($('market-country').value,'');assert.equal($('market-city').value,'');assert.equal($('market-language').value,'');});
 test('empty real launch dataset is honest and offers official path',()=>{const b=app({empty:true});b.ask('Toronto la Tamil accountant venum');b.search();assert.equal(b.visible().length,0);assert(!b.$('market-empty').hidden);assert(b.$('market-official-links').textContent.includes('CPA Ontario'));});
 test('device count opt-in does not authorize remote events',()=>{$('life-count-consent').checked=true;$('life-count-consent').dispatchEvent(new w.Event('change'));a.ask('Toronto la Tamil accountant venum');a.search();assert.equal(a.network.length,1);assert(w.localStorage.getItem('podaturpet.life.counts.v1').includes('market_search'));});
 test('separate remote consent sends fixed event fields without query, city or provider',()=>{$('market-network-consent').checked=true;a.search();assert.equal(a.network.at(-1).event,'market_search');const value=JSON.stringify(a.network);for(const secret of ['Toronto','accountant venum','ISOLATED QA',ref])assert(!value.includes(secret));});
 test('unknown event names are not sent to analytics',()=>{const before=a.network.length;d.dispatchEvent(new w.CustomEvent('podaturpet:market-event',{detail:{stage:'raw-query',text:'secret'}}));assert.equal(a.network.length,before);});
 test('a handoff produces one contact and one draft event, never a received sale',()=>{open();$('market-channel').value='whatsapp';$('market-channel').dispatchEvent(new w.Event('change',{bubbles:true}));$('market-consent').checked=true;$('market-note').value='General consultation';a.submit('market-contact-form');const start=a.network.length;$('market-handoff').click();$('market-handoff').click();const names=a.network.slice(start).map(e=>e.event);assert.deepEqual(names,['market_contact','market_enquiry_handoff']);});
 test('new contact links do not trigger lungi analytics classification',()=>assert(!a.network.some(e=>e.event==='lungi_click'||e.event==='whatsapp_click')));
 test('GPC suppresses old and new network tracking',()=>{const b=app({gpc:true});assert(b.$('market-network-consent').disabled);assert.equal(b.network.length,0);});
 test('storage denial leaves search and contact usable',()=>{const b=app({denied:true});b.$('life-count-consent').checked=true;b.$('life-count-consent').dispatchEvent(new b.w.Event('change'));b.ask('Toronto la Tamil accountant venum');b.search();assert.equal(b.visible().length,1);});
 test('hub assistant reuses service parser and points to the existing directory',()=>{const b=app({hub:true});b.$('hub-search').value='Toronto la Tamil accountant venum';b.submit('life-ask-form');assert(b.$('life-answer').querySelector('a[href="/podaturpet-local-business-directory.html#service-accounting"]'));assert(!b.w.location.href.includes('Toronto'));assert.equal(b.network.length,0);});
 test('all marketplace controls labelled and IDs unique',()=>{for(const n of $('service-marketplace').querySelectorAll('input,select,textarea'))assert(n.closest('label')||d.querySelector('label[for="'+n.id+'"]'));const ids=[...d.querySelectorAll('[id]')].map(n=>n.id);assert.equal(ids.length,new Set(ids).size);});
 test('provider fixtures are absent from the delivered dataset',()=>{assert.equal(fs.readFileSync(path.join(root,'content/businesses.json'),'utf8').trim(),'[]');assert(!fs.readFileSync(path.join(root,'content/businesses-public.js'),'utf8').includes('ISOLATED QA'));});
 console.log(passed+' marketplace journey tests passed.');
}finally{opened.forEach(d=>d.window.close());}
