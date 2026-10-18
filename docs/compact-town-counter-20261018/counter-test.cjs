const {JSDOM}=require('jsdom'),fs=require('fs'),assert=require('assert/strict');
const script=fs.readFileSync('podaturpet-visitor-tracking.js','utf8');
(async()=>{
 const base={siteViews:8,pageViews:3,locations:[{city:'Chennai',views:3}]};let count=0;
 for(const mode of ['new','zero','legacy','offline']){
 const w=new JSDOM('<html lang="en"><body><footer></footer></body></html>',{url:'https://podaturpet.com/',runScripts:'outside-only'}).window;
 w.PodaturpetCommunity={apiBase:'https://example.workers.dev'};w.AbortSignal.timeout=()=>undefined;let writes=0,reads=0;
 const data={...base};if(mode==='new'){data.geography=[{country:'US',region:'Arkansas',city:'Centerton',views:5},{country:'IN',region:'Tamil Nadu',city:'<img src=x>',views:3}];data.countries=[{country:'US',views:5},{country:'IN',views:3}];data.regions=[{country:'US',region:'Arkansas',views:5}];data.ip='DO-NOT-DISPLAY';}
 if(mode==='zero'){data.siteViews=0;data.geography=[];data.countries=[];data.regions=[];}
 w.fetch=async(url,options={})=>{if(options.method==='POST'){writes++;return {ok:true,json:async()=>({ok:true})}}reads++;if(mode==='offline')throw Error('blocked');return{ok:true,json:async()=>data}};
 w.eval(script);await new Promise(r=>setTimeout(r,20));const d=w.document,p=d.querySelector('#pt-public-views');assert(p);assert.equal(d.querySelectorAll('#pt-public-views').length,1);assert.equal(writes,1);assert(!p.textContent.includes('DO-NOT-DISPLAY'));count+=4;
 if(mode==='new'){assert.equal(p.querySelector('.stats-total').textContent,'8');assert(p.textContent.includes('Arkansas'));assert(p.textContent.includes('United States'));assert(!p.querySelector('img'));assert(p.textContent.includes('<img src=x>'));count+=5;}
 if(mode==='zero'){assert.equal(p.querySelector('.stats-total').textContent,'0');assert(p.textContent.includes('No recorded views'));count+=2;}
 if(mode==='legacy'){assert(p.textContent.includes('updated analytics Worker'));assert(p.textContent.includes('Chennai'));count+=2;}
 if(mode==='offline'){assert.equal(p.querySelector('.stats-total').textContent,'—');assert(p.textContent.includes('Live counts could not be reached'));count+=2;}
 const before=reads;p.querySelector('button').click();await new Promise(r=>setTimeout(r,10));assert(reads>before);assert.equal(writes,1);count+=2;
 d.documentElement.lang='ta';d.dispatchEvent(new w.CustomEvent('podaturpet:language',{detail:{language:'ta'}}));assert(p.textContent.includes('நம் தளத்தின் பார்வைகள்'));count++;
 console.log('PASS',mode);w.close();
 }
 console.log(count+' counter assertions passed; mocked API, no external writes.');
})().catch(e=>{console.error(e);process.exitCode=1;});
