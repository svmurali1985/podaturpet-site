/* Original planner logic. No network or storage access. */
(function(root){'use strict';
const DAY=86400000;
function day(s){if(!/^\d{4}-\d{2}-\d{2}$/.test(s||''))return null;const [y,m,d]=s.split('-').map(Number);if(y<1900||y>2200)return null;const n=Date.UTC(y,m-1,d),v=new Date(n);return v.getUTCFullYear()===y&&v.getUTCMonth()===m-1&&v.getUTCDate()===d?n:null;}
function today(){const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');}
function addDays(s,n){const v=day(s);return v===null?'':new Date(v+n*DAY).toISOString().slice(0,10);}
function addMonths(s,n){if(day(s)===null)return '';const [y,m,d]=s.split('-').map(Number);const target=new Date(Date.UTC(y,m-1+n,1));target.setUTCDate(Math.min(d,new Date(Date.UTC(target.getUTCFullYear(),target.getUTCMonth()+1,0)).getUTCDate()));return target.toISOString().slice(0,10);}
function daysUntil(s,now=today()){return day(s)===null||day(now)===null?null:Math.round((day(s)-day(now))/DAY);}
function tripErrors(t){const errors=[];['departure','arrival','returnDate'].forEach(k=>{if(t[k]&&day(t[k])===null)errors.push(k);});if(t.departure&&t.arrival&&day(t.arrival)<day(t.departure))errors.push('arrivalOrder');if(t.arrival&&t.returnDate&&day(t.returnDate)<day(t.arrival))errors.push('returnOrder');if(!t.arrival&&t.departure&&t.returnDate&&day(t.returnDate)<day(t.departure))errors.push('returnOrder');return errors;}
function visibleTasks(tasks,trip){return tasks.filter(t=>(t.route==='both'||t.route===trip.direction)&&(!t.parents||trip.parents));}
function taskStatus(task,trip,now=today()){const due=task.stage===-1?trip.arrival:addDays(trip.departure,-task.stage);const days=daysUntil(due,now);return {due:due||'',status:days===null?'undated':days>0?'upcoming':days===0?'today':'overdue'};}
function documentAlerts(person,trip,now=today()){
 const results=[];const ref=trip.arrival||trip.departure;
 function push(code,severity){results.push({code,severity});}
 if(!person.passport)push('passportMissing','info');else if(day(person.passport)===null)push('invalidDate','danger');else if(daysUntil(person.passport,now)<0)push('passportExpired','danger');else if(ref&&day(person.passport)<=day(ref))push('passportBeforeArrival','danger');else if(trip.returnDate&&day(person.passport)<day(trip.returnDate))push('passportBeforeReturn','danger');else if(ref&&day(person.passport)<day(addMonths(ref,6)))push('passportBuffer','warning');else if(daysUntil(person.passport,now)<=30)push('passportSoon','warning');
 if(person.visaMode==='check')push('visaUnknown','info');
 if(person.visaMode==='required'){
  if(!person.visa)push('visaMissing','warning');else if(day(person.visa)===null)push('invalidDate','danger');else if(ref&&day(person.visa)<day(ref))push('visaBeforeArrival','danger');else if(daysUntil(person.visa,now)<0)push('visaExpired','warning');else if(daysUntil(person.visa,now)<=30)push('visaSoon','warning');
 }
 if(trip.direction==='in-us'&&person.admitUntil){if(day(person.admitUntil)===null)push('invalidDate','danger');else if(daysUntil(person.admitUntil,now)<0)push('stayPassed','danger');else if(trip.returnDate&&day(trip.returnDate)>day(person.admitUntil))push('stayBeforeReturn','danger');else if(daysUntil(person.admitUntil,now)<=30)push('staySoon','warning');}
 return results;
}
function defaults(packing=[]){return {version:1,lang:'en',large:false,trip:{direction:'us-in',label:'',from:'',to:'',departure:'',arrival:'',returnDate:'',parents:false},travelers:[],done:{},medicine:[],packing:packing.map(x=>({...x})),gifts:[],card:{name:'',phone:'',host:'',hostPhone:'',address:'',backup:'',help:''}};}
function clean(raw){
 if(!raw||typeof raw!=='object'||Array.isArray(raw)||raw.version!==1)throw new Error('schema');
 const s=defaults();const str=(v,max=300)=>{if(typeof v!=='string'||v.length>max)throw new Error('schema');return v;};const bool=v=>{if(typeof v!=='boolean')throw new Error('schema');return v;};const date=v=>{v=str(v,10);if(v&&day(v)===null)throw new Error('date');return v;};const enumVal=(v,opts)=>{if(!opts.includes(v))throw new Error('schema');return v;};
 s.lang=enumVal(raw.lang,['en','ta']);s.large=bool(raw.large);if(!raw.trip||!raw.card)throw new Error('schema');
 s.trip.direction=enumVal(raw.trip.direction,['us-in','in-us']);s.trip.parents=bool(raw.trip.parents);['label','from','to'].forEach(k=>s.trip[k]=str(raw.trip[k],120));['departure','arrival','returnDate'].forEach(k=>s.trip[k]=date(raw.trip[k]));if(tripErrors(s.trip).length)throw new Error('date');
 const list=(value,max,fn)=>{if(!Array.isArray(value)||value.length>max)throw new Error('schema');return value.map(fn);};
 s.travelers=list(raw.travelers,12,p=>({id:str(p.id,80),name:str(p.name,80),passport:date(p.passport),visaMode:enumVal(p.visaMode,['check','required','none']),visa:date(p.visa),admitUntil:date(p.admitUntil)}));
 s.medicine=list(raw.medicine,60,p=>({id:str(p.id,80),name:str(p.name,150),note:str(p.note,300),quantity:str(p.quantity,40),done:bool(p.done)}));
 s.packing=list(raw.packing,120,p=>({id:str(p.id,80),en:str(p.en,200),ta:str(p.ta,200),bag:enumVal(p.bag,['carry','checked','personal']),done:bool(p.done)}));
 s.gifts=list(raw.gifts,80,p=>({id:str(p.id,80),name:str(p.name,150),recipient:str(p.recipient,100),quantity:str(p.quantity,40),done:bool(p.done)}));
 for(const a of [s.travelers,s.medicine,s.packing,s.gifts])if(new Set(a.map(p=>p.id)).size!==a.length)throw new Error('schema');
 if(!raw.done||typeof raw.done!=='object'||Array.isArray(raw.done)||Object.keys(raw.done).length>200)throw new Error('schema');
 Object.entries(raw.done).forEach(([k,v])=>{if(!/^[a-z][a-z0-9-]{0,70}$/.test(k))throw new Error('schema');s.done[k]=bool(v);});
 Object.keys(s.card).forEach(k=>s.card[k]=str(raw.card[k],k==='address'||k==='help'?500:120));return s;
}
const api={day,today,addDays,addMonths,daysUntil,tripErrors,visibleTasks,taskStatus,documentAlerts,defaults,clean};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.TravelCore=api;
})(typeof globalThis!=='undefined'?globalThis:this);
