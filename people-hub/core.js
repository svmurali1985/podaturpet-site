/* Original pure helpers, shared by the browser and Node tests. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PeopleHubCore=api;})(typeof window!=='undefined'?window:globalThis,function(){
'use strict';
const KEY='podaturpet.people-hub.shortcuts.v1';
function normalize(value){return String(value||'').normalize('NFC').toLocaleLowerCase('en').replace(/\s+/g,' ').trim();}
function regionMatch(item,region){if(region==='all')return true;if(item.regions.includes('world'))return true;if(region==='india')return item.regions.includes('india')||item.regions.includes('tamil');if(region==='tamil')return item.regions.includes('india')||item.regions.includes('tamil');return item.regions.includes(region);}
function matches(item,state){const words=normalize(state.query).slice(0,120).split(' ').filter(Boolean);return (state.category==='all'||item.category===state.category)&&regionMatch(item,state.region)&&(!state.savedOnly||state.saved.includes(item.id))&&words.every(w=>normalize(item.search).includes(w));}
function parseSaved(raw,validIds){if(typeof raw!=='string'||raw.length>12000)throw Error('Invalid shortcut data');const data=JSON.parse(raw);if(!data||data.version!==1||!Array.isArray(data.ids)||data.ids.length>200)throw Error('Invalid shortcut data');if(data.ids.some(x=>typeof x!=='string'||x.length>80))throw Error('Invalid guide ID');return [...new Set(data.ids.filter(id=>validIds.includes(id)))];}
function saveData(ids,validIds){return JSON.stringify({version:1,ids:[...new Set(ids.filter(id=>validIds.includes(id)))]});}
function reviewState(value,now=new Date()){if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return 'invalid';const stamp=Date.parse(value+'T00:00:00Z');if(!Number.isFinite(stamp)||new Date(stamp).toISOString().slice(0,10)!==value)return 'invalid';const age=(now.getTime()-stamp)/86400000;if(age < -2)return 'invalid';return age>90?'old':'current';}
function today(date,zone,lang){const options={weekday:'long',year:'numeric',month:'long',day:'numeric'};if(zone!=='device')options.timeZone=zone;return new Intl.DateTimeFormat(lang==='ta'?'ta-IN':'en-GB',options).format(date);}
function validHash(hash,ids,categories){const x=String(hash||'').replace(/^#/,'');if(x.startsWith('guide-')&&ids.includes(x.slice(6)))return {type:'guide',id:x.slice(6)};if(x.startsWith('category-')&&categories.includes(x.slice(9)))return {type:'category',id:x.slice(9)};return null;}

function askRank(query,items,region='all'){
 const stop=new Set('i my me want need how to do can a an the is for and in please get apply நான் எனக்கு எப்படி என்ன வேண்டும் செய்ய ஒரு'.split(' '));
 const words=normalize(query).replace(/[?!.,:;\n]/g,' ').split(/\s+/).filter(w=>w.length>1&&!stop.has(w));
 if(!words.length)return [];
 return items.filter(i=>regionMatch(i,region)).map(i=>{const title=normalize(Object.values(i.title).join(' ')),terms=normalize(i.askTerms||'');const score=words.reduce((n,w)=>n+(title.includes(w)?3:terms.includes(w)?2:0),0);return {id:i.id,score};}).filter(x=>x.score>=2).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id)).slice(0,3);
}
function amount(value,max=100000000){const str=String(value).trim();if(!/^\d+(\.\d{1,2})?$/.test(str))throw Error('amount');const n=Number(str);if(!Number.isFinite(n)||n>max)throw Error('amount');return Math.round(n*100);}
function months(value){if(!/^\d+$/.test(String(value))||Number(value)<1||Number(value)>120)throw Error('months');return Number(value);}
function educationCost(v){const study=months(v.study),save=months(v.save);const total=amount(v.tuition)+amount(v.monthly)*study+amount(v.other),gap=Math.max(0,total-amount(v.funding));return {total:total/100,gap:gap/100,monthly:Math.ceil(gap/save)/100};}
function transferQuote(v){const budget=amount(v.budget),fee=amount(v.fee),deduction=amount(v.deduction);const rate=String(v.rate).trim();if(!/^\d+(\.\d{1,6})?$/.test(rate)||Number(rate)<=0||Number(rate)>100000||fee>budget)throw Error('quote');const net=(budget-fee)/100*Number(rate)-deduction/100;if(net<0||!Number.isFinite(net)||net>1e12)throw Error('quote');return {receive:Math.round((net+Number.EPSILON)*100)/100,fee:fee/100};}
function privateText(value){return /(?:\d[\s-]*){7,}|[\w.+-]+@[\w.-]+\.[a-z]{2,}|https?:\/\//i.test(String(value));}

// Shared service parsing/matching: assistant and the one existing directory use these helpers.
function marketContains(query,alias){
 const q=normalize(query),a=normalize(alias);
 if(/[\u0B80-\u0BFF]/.test(a))return q.includes(a);
 const escaped=a.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 return new RegExp('(^|[^\\p{L}\\p{N}])'+escaped+'($|[^\\p{L}\\p{N}])','u').test(q);
}
function marketCity(value,country,D){const v=normalize(value);const match=D.cities.find(c=>(!country||c.country===country)&&[c.city,...c.aliases].some(a=>normalize(a)===v));return normalize(match?match.city:v);}
function marketRegion(value,country){const v=normalize(value);const groups={CA:{on:['on','ontario','ஒன்டாரியோ']},IN:{tn:['tn','tamil nadu','தமிழ்நாடு'],ka:['ka','karnataka','கர்நாடகா']},US:{ar:['ar','arkansas'],ny:['ny','new york'],tx:['tx','texas']},AU:{nsw:['nsw','new south wales'],vic:['vic','victoria']}};for(const [key,aliases] of Object.entries(groups[country]||{}))if(aliases.includes(v))return key;return v;}
function marketParse(query,D){
 const q=normalize(query).slice(0,180),out={service:'',alternatives:[],country:'',region:'',city:'',language:'',mode:'local',information:false,sensitive:false};
 out.sensitive=privateText(q)||/\b(?:street|apartment|apt|postcode|postal code|ssn|password)\b|கடவுச்சொல்|வீட்டு முகவரி/i.test(q);if(out.sensitive)return out;
 const found=D.services.map(s=>({id:s.id,score:Math.max(0,...s.aliases.filter(a=>marketContains(q,a)).map(a=>a.length))})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score);
 out.alternatives=found.map(x=>x.id);if(found.length)out.service=found[0].id;
 for(const [code,l] of Object.entries(D.languages))if(l.aliases.some(a=>marketContains(q,a))){out.language=code;break;}
 const places=D.cities.filter(c=>c.aliases.some(a=>marketContains(q,a)));
 if(places.length===1)Object.assign(out,{city:places[0].city,country:places[0].country,region:places[0].region});
 else if(!places.length){const m=q.match(/^([\p{L}\s.'-]{2,70}?)\s+(?:la|le|il)\s/iu);if(m)out.city=m[1].trim();}
 const countries={IN:['india','இந்தியா'],CA:['canada','கனடா'],US:['usa','united states','அமெரிக்கா'],GB:['uk','united kingdom'],AU:['australia','ஆஸ்திரேலியா'],LK:['sri lanka','இலங்கை'],SG:['singapore','சிங்கப்பூர்'],MY:['malaysia','மலேசியா'],AE:['uae'],DE:['germany'],FR:['france'],NZ:['new zealand']};
 const stated=Object.entries(countries).filter(([,aliases])=>aliases.some(a=>marketContains(q,a))).map(([code])=>code);
 if(stated.length===1&&stated[0]!==out.country){out.country=stated[0];out.region='';}
 if(/\b(?:remote|online)\b|இணையவழி/i.test(q))out.mode='remote';
 out.information=/\b(?:how|what|meaning|official|apply|application|eligibility|renew|rules)\b|எப்படி|என்ன|அரசு|அதிகாரப்பூர்வ|விண்ணப்ப/i.test(q);
 return out;
}
function marketCurrent(p,now=new Date()){
 if(!p||p.schema_version!==2||!p.checks||!/^\d{4}-\d{2}-\d{2}$/.test(p.checks.valid_until))return false;
 const day=now.toISOString().slice(0,10);return p.checks.valid_until>=day&&['identity_on','contact_on','consent_on','scope_on'].every(k=>p.checks[k]&&p.checks[k]<=day);
}
function marketMatch(providers,filters,D,now=new Date()){
 if(!D.services.some(s=>s.id===filters.service&&s.launch)||!D.countries.includes(filters.country)||!['local','remote'].includes(filters.mode)||filters.mode==='local'&&!normalize(filters.city))return [];
 return providers.filter(p=>marketCurrent(p,now)&&p.services.includes(filters.service)&&(!filters.language||p.languages.includes(filters.language))&&p.areas.some(a=>a.country===filters.country&&a.mode===filters.mode&&(!filters.region||marketRegion(a.region,a.country)===marketRegion(filters.region,filters.country))&&(filters.mode==='remote'&&!a.city||marketCity(a.city,a.country,D)===marketCity(filters.city,filters.country,D)))).sort((a,b)=>a.name.localeCompare(b.name));
}
function marketRegisters(service,country,region,D){return D.registers.filter(r=>r.services.includes(service)&&(!country||r.country===country)&&(!region||!r.region||marketRegion(r.region,r.country)===marketRegion(region,country))).map(r=>D.sources[r.source]);}
function marketPrice(p,lang,U){
 const v=p.pricing;if(v.mode==='quote')return U.quote;
 try{const fmt=n=>new Intl.NumberFormat(lang==='ta'?'ta-IN':'en',{style:'currency',currency:v.currency,currencyDisplay:'code',minimumFractionDigits:0,maximumFractionDigits:3}).format(Number(n));return U[v.mode]+' '+fmt(v.amount)+(v.mode==='range'?' – '+fmt(v.maximum):'')+' / '+U[v.unit]+' · '+U[v.taxes]+' · '+v.checked_on;}catch(_){return U.quote;}
}

return {marketParse,marketMatch,marketCurrent,marketPrice,marketRegisters,marketCity,marketRegion,askRank,educationCost,transferQuote,privateText,KEY,normalize,regionMatch,matches,parseSaved,saveData,reviewState,today,validHash};});
