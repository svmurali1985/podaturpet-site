(function(){
'use strict';
const D=window.PeopleHubData,C=window.PeopleHubCore;if(!D||!C)return;
const lang=document.documentElement.lang==='ta'?'ta':'en',U=D.ui[lang],$=id=>document.getElementById(id),ids=D.items.map(x=>x.id),cards=new Map(ids.map(id=>[id,$('guide-'+id)]));
const state={query:'',region:'all',category:'all',savedOnly:false,saved:[]};let persistent=false,printState=null;
function message(text){$('message').textContent=text;}
try{const raw=localStorage.getItem(C.KEY);if(raw!==null){state.saved=C.parseSaved(raw,ids);persistent=true;}}catch(e){message(e instanceof SyntaxError||/Invalid/.test(e.message)?U.corrupt:U.storageError);}
function persist(){if(!persistent)return;try{localStorage.setItem(C.KEY,C.saveData(state.saved,ids));}catch(e){persistent=false;message(U.storageError);}}
function render(){let found=0;for(const item of D.items){const card=cards.get(item.id),show=C.matches(item,state);card.hidden=!show;if(show)found++;const b=card.querySelector('[data-save]'),on=state.saved.includes(item.id);b.textContent=on?'✓':'＋';b.setAttribute('aria-pressed',String(on));b.setAttribute('aria-label',(on?U.bookmarked:U.bookmark)+': '+item.title[lang]);b.title=on?U.bookmarked:U.bookmark;}
$('result-count').textContent=found+' '+U.results;$('empty').hidden=found!==0;$('saved-count').textContent=String(state.saved.length);$('saved-only').setAttribute('aria-pressed',String(state.savedOnly));$('persist').setAttribute('aria-pressed',String(persistent));$('persist').textContent=persistent?U.persistOn:U.persist;
for(const b of document.querySelectorAll('[data-category]'))b.setAttribute('aria-pressed',String(b.dataset.category===state.category));for(const n of document.querySelectorAll('[data-count]'))n.textContent=String(D.items.filter(x=>C.matches(x,{...state,category:n.dataset.count})).length);$('print-visible').disabled=found===0;
}
function clear(){state.query='';state.region='all';state.category='all';state.savedOnly=false;$('hub-search').value='';$('region').value='all';render();}
function updateDates(){try{$('today-date').textContent=C.today(new Date(),$('time-zone').value,lang);}catch(e){$('today-date').textContent=U.clockFail;}
let old=false;for(const n of document.querySelectorAll('[data-reviewed]')){if(!n.dataset.original)n.dataset.original=n.textContent;const status=C.reviewState(n.dataset.reviewed);n.textContent=n.dataset.original+(status==='old'?' · '+U.old:status==='invalid'?' · '+U.invalidDate:'');n.classList.toggle('stale',status!=='current');if(status!=='current')old=true;}$('stale-notice').hidden=!old;
}
function focusGuides(){const el=$('guides');el.focus({preventScroll:true});if(el.scrollIntoView)el.scrollIntoView({block:'start'});}
function processHash(){const h=C.validHash(location.hash,ids,Object.keys(D.categories));if(!h)return;if(h.type==='category'){clear();state.category=h.id;render();focusGuides();}else{clear();const card=cards.get(h.id);card.querySelector('details').open=true;const title=$('title-'+h.id);title.focus({preventScroll:true});if(card.scrollIntoView)card.scrollIntoView({block:'start'});}}
function preparePrint(){if(printState)return;printState=[];for(const [id,card] of cards){const details=card.querySelector('details');printState.push([details,details.open]);if(!card.hidden)details.open=true;}}
function finishPrint(){if(printState){for(const [details,open] of printState)details.open=open;printState=null;}document.body.classList.remove('print-one');for(const card of cards.values())card.classList.remove('print-selected');}
async function print(id){if(![...cards.values()].some(x=>!x.hidden)){message(U.noPrint);return;}finishPrint();if(id&&cards.has(id)){document.body.classList.add('print-one');cards.get(id).classList.add('print-selected');}preparePrint();try{if(document.fonts&&document.fonts.ready)await document.fonts.ready;window.print();}catch(e){finishPrint();message(U.printFail);}}
function link(id){return 'https://podaturpet.com/people-information-hub'+(lang==='ta'?'-ta':'')+'.html#guide-'+id;}
async function copy(id){try{if(!navigator.clipboard||!navigator.clipboard.writeText)throw Error('Unavailable');await navigator.clipboard.writeText(link(id));message(U.copied);}catch(e){message(U.copyFail);const a=cards.get(id).querySelector('.permalink');a.focus();}}
$('hub-search').addEventListener('input',()=>{state.query=$('hub-search').value.slice(0,120);render();});
$('hub-search').addEventListener('keydown',e=>{if(e.key==='Escape'){$('hub-search').value='';state.query='';render();}});
$('region').addEventListener('change',()=>{state.region=$('region').value;render();});
$('clear').addEventListener('click',clear);
for(const b of document.querySelectorAll('[data-category]'))b.addEventListener('click',()=>{state.category=b.dataset.category;render();});
$('saved-only').addEventListener('click',()=>{state.savedOnly=!state.savedOnly;render();});
$('persist').addEventListener('click',()=>{if(persistent){try{localStorage.removeItem(C.KEY);persistent=false;message(U.forgetMessage);}catch(e){message(U.storageError);}}else{persistent=true;message(U.persistMessage);persist();}render();});
$('forget').addEventListener('click',()=>{if(!window.confirm(U.forgetConfirm))return;try{localStorage.removeItem(C.KEY);state.saved=[];persistent=false;state.savedOnly=false;message(U.forgetMessage);render();}catch(e){message(U.storageError);}});
for(const [id,card] of cards){card.querySelector('[data-save]').addEventListener('click',()=>{if(state.saved.includes(id))state.saved=state.saved.filter(x=>x!==id);else state.saved.push(id);message(U.savedMessage);persist();render();});card.querySelector('[data-print]').addEventListener('click',()=>print(id));card.querySelector('[data-copy]').addEventListener('click',()=>copy(id));}
$('large-text').addEventListener('click',()=>{const on=document.body.classList.toggle('large');$('large-text').setAttribute('aria-pressed',String(on));$('large-text').textContent=on?U.normal:U.large;});
$('time-zone').addEventListener('change',updateDates);$('print-visible').addEventListener('click',()=>print());
window.addEventListener('beforeprint',preparePrint);window.addEventListener('afterprint',finishPrint);window.addEventListener('hashchange',processHash);window.addEventListener('pageshow',updateDates);document.addEventListener('visibilitychange',()=>{if(!document.hidden)updateDates();});
// Only validated public guide/category IDs follow the language link. Never copy a query string.
for(const a of document.querySelectorAll('[data-language]'))a.addEventListener('click',()=>{const h=C.validHash(location.hash,ids,Object.keys(D.categories));a.href='/people-information-hub'+(a.dataset.language==='ta'?'-ta':'')+'.html'+(h?'#'+h.type+'-'+h.id:'');});
for(const el of document.querySelectorAll('.js-control'))el.hidden=false;render();updateDates();processHash();window.setInterval(updateDates,60000);
})();
