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
return {KEY,normalize,regionMatch,matches,parseSaved,saveData,reviewState,today,validHash};});
