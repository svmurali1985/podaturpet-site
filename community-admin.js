/* Original private dashboard. No third-party scripts, browser token persistence or query-string secrets. */
(function(){
 'use strict';
 const $=s=>document.querySelector(s);let token='',api='',timer,next=null,generation=0;
 try{const u=new URL(window.PodaturpetCommunity?.apiBase);if(u.protocol==='https:'&&u.hostname.endsWith('.workers.dev')&&u.pathname==='/')api=u.origin;}catch{}
 function logout(){token='';generation++;clearTimeout(timer);$('#token').value='';$('#login').hidden=false;$('#dashboard').hidden=true;$('#comments').replaceChildren();$('#stats').replaceChildren();$('#total').textContent='';$('#status').textContent='Signed out.';}
 function resetTimer(){clearTimeout(timer);if(token)timer=setTimeout(logout,15*60*1000);}
 async function call(path,body){
  if(!api)throw new Error('Set the Worker URL in podaturpet-community-config.js after completing SETUP.md.');
  const r=await fetch(api+path,{method:body?'POST':'GET',headers:{Authorization:'Bearer '+token,...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined,credentials:'omit',cache:'no-store',referrerPolicy:'no-referrer',signal:AbortSignal.timeout(15000)});
  if(r.status===401){logout();throw new Error('Sign-in failed or expired. Check your admin token.');}
  if(!r.ok)throw new Error('Service unavailable ('+r.status+'). Check setup or free-service limits.');return r.json();
 }
 function report(e){$('#status').textContent=e.message||'Unable to complete request.';}
 function table(title,rows,columns){
  const h=document.createElement('h3');h.textContent=title;const wrap=document.createElement('div');wrap.className='table-wrap';
  if(!rows.length){wrap.textContent='No consenting page views in this period.';$('#stats').append(h,wrap);return;}
  const t=document.createElement('table'),head=document.createElement('thead'),tr=document.createElement('tr');for(const [key,label]of columns){const th=document.createElement('th');th.scope='col';th.textContent=label;tr.append(th);}head.append(tr);t.append(head);const body=document.createElement('tbody');
  for(const row of rows){const tr=document.createElement('tr');for(const [key]of columns){const td=document.createElement('td');td.textContent=String(row[key]);tr.append(td);}body.append(tr);}t.append(body);wrap.append(t);$('#stats').append(h,wrap);
 }
 async function stats(){const g=generation;const params=new URLSearchParams(new FormData($('#filters')));const d=await call('/v1/admin/stats?'+params);if(g!==generation||!token)return;
  const selected=$('#page-filter').value;$('#page-filter').replaceChildren(new Option('All pages',''),...d.pageOptions.map(p=>new Option(p,p)));$('#page-filter').value=selected;
  $('#stats').replaceChildren();$('#total').textContent=d.views+' consenting page views · '+d.from+' onward (UTC)';table('Pages',d.pages,[['page','Page'],['views','Views']]);table('Daily totals',d.daily,[['day','UTC date'],['views','Views']]);table('Top 100 approximate locations',d.locations,[['country','Country code'],['region','State / region'],['city','City'],['views','Views']]);
 }
 async function comments(append=false){const g=generation,q=$('#queue').value;const d=await call('/v1/admin/comments?status='+q+(append&&next?'&before='+next:''));if(g!==generation||!token||q!==$('#queue').value)return;
  if(!append)$('#comments').replaceChildren();if(!d.comments.length&&!append)$('#comments').textContent='No comments in this queue.';
  for(const c of d.comments){const a=document.createElement('article'),h=document.createElement('h3'),meta=document.createElement('p'),body=document.createElement('p');h.textContent=c.name+' · '+c.page;meta.textContent=[c.id,c.location,c.purpose,new Date(c.created*1000).toISOString()].filter(Boolean).join(' · ');body.textContent=c.message;a.append(h,meta,body);
   for(const action of q==='pending'?['approve','delete']:['delete']){const b=document.createElement('button');b.type='button';b.textContent=action==='approve'?'Approve / வெளியிடு':'Delete / நீக்கு';b.onclick=async()=>{if(action==='delete'&&!confirm('Permanently delete this comment?'))return;b.disabled=true;try{await call('/v1/admin/moderate',{id:c.id,action});a.remove();$('#status').textContent=action==='approve'?'Comment approved.':'Comment deleted.';}catch(e){report(e);b.disabled=false;}};a.append(b);}$('#comments').append(a);
  }next=d.next;$('#more-comments').hidden=!next;
 }
 $('#login-form').addEventListener('submit',async e=>{e.preventDefault();token=$('#token').value.trim();$('#token').value='';const button=e.submitter;button.disabled=true;$('#status').textContent='Signing in…';try{await stats();if(!token)return;$('#login').hidden=true;$('#dashboard').hidden=false;resetTimer();$('#status').textContent='Signed in. Automatic sign-out after 15 minutes of inactivity.';await comments();}catch(e){logout();report(e);}finally{button.disabled=false;}});
 $('#logout').onclick=logout;$('#filters').onsubmit=e=>{e.preventDefault();stats().catch(report);};$('#queue').onchange=()=>comments().catch(report);$('#refresh-comments').onclick=()=>comments().catch(report);$('#more-comments').onclick=()=>comments(true).catch(report);
 document.addEventListener('pointerdown',resetTimer,{passive:true});document.addEventListener('keydown',resetTimer);window.addEventListener('pagehide',logout);
})();
