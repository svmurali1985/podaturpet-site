/* Original dependency-free comments UI. Licence: community-worker/LICENSE. */
(function () {
 'use strict';
 if(document.getElementById('pt-feedback'))return;
 const page=location.pathname==='/'?'/index.html':location.pathname;
 let api='';try{const u=new URL(window.PodaturpetCommunity?.apiBase);if(u.protocol==='https:'&&u.hostname.endsWith('.workers.dev')&&u.pathname==='/')api=u.origin;}catch{}
 const words={
 en:{title:'User comments',add:'Add your comments',intro:'Where are you reading from? What brought you here? Tell us what could be clearer.',name:'Display name (optional)',location:'Town / country (optional)',purpose:'Why are you visiting? (optional)',choose:'Choose a reason',textiles:'Lungis / textiles',local:'Local information',technology:'Technology / collaboration',other:'Other',message:'Your comment or improvement suggestion',permission:'I wrote this comment, have permission to share it, and agree that these fields may be published on this page after review.',note:'All fields you submit may be public after approval. Do not include phone numbers, email addresses, private details, copied material or website links.',send:'Submit for review',close:'Close',empty:'No approved comments yet. Be the first to help improve this page.',load:'Load comments',more:'More comments',unavailable:'Comments are not available yet. Please use the contact link below.',error:'Could not complete this request. Please try again later.',sending:'Checking and submitting…',success:'Thank you. Your comment is awaiting approval. Keep this reference for any removal request: ',privacy:'Privacy & removal requests',review:'Comments are reviewed before publication. They are visitor opinions, not verified business claims.',invite:'Could this page be more useful?',dismiss:'Not now',loadError:'Comments could not be loaded. Try again.',verification:'Your browser could not finish the spam check. Please try again.',expired:'Please try submitting again with a fresh spam check.'},
 ta:{title:'பார்வையாளர்களின் கருத்துகள்',add:'உங்கள் கருத்தைச் சேர்க்கவும்',intro:'எங்கிருந்து பார்க்கிறீர்கள்? எதற்காக வந்தீர்கள்? எதை மேம்படுத்தலாம் என்று சொல்லுங்கள்.',name:'வெளியிட வேண்டிய பெயர் (விருப்பம்)',location:'ஊர் / நாடு (விருப்பம்)',purpose:'வருகையின் காரணம் (விருப்பம்)',choose:'காரணத்தைத் தேர்வு செய்யவும்',textiles:'லுங்கி / நெசவு',local:'உள்ளூர் தகவல்கள்',technology:'தொழில்நுட்பம் / கூட்டாண்மை',other:'மற்றவை',message:'உங்கள் கருத்து அல்லது மேம்பாட்டு ஆலோசனை',permission:'இது நான் எழுதிய கருத்து. இதைப் பகிர உரிமை உள்ளது. சரிபார்த்த பிறகு இந்தத் தகவல்களை இப்பக்கத்தில் வெளியிட ஒப்புக்கொள்கிறேன்.',note:'நீங்கள் அனுப்பும் அனைத்துத் தகவல்களும் ஒப்புதலுக்குப் பின் பொதுவில் தெரியலாம். தொலைபேசி எண், மின்னஞ்சல், தனிப்பட்ட தகவல், நகலெடுத்த உள்ளடக்கம், இணைய இணைப்புகள் வேண்டாம்.',send:'சரிபார்ப்புக்கு அனுப்பு',close:'மூடு',empty:'ஒப்புதல் பெற்ற கருத்துகள் இன்னும் இல்லை. முதல் கருத்தை நீங்கள் பகிரலாம்.',load:'கருத்துகளைப் பார்க்க',more:'மேலும் கருத்துகள்',unavailable:'கருத்து வசதி இன்னும் கிடைக்கவில்லை. கீழே உள்ள தொடர்பு இணைப்பைப் பயன்படுத்துங்கள்.',error:'செயலை முடிக்க முடியவில்லை. பிறகு மீண்டும் முயற்சி செய்யுங்கள்.',sending:'சரிபார்த்து அனுப்பப்படுகிறது…',success:'நன்றி. உங்கள் கருத்து ஒப்புதலுக்காகக் காத்திருக்கிறது. நீக்கக் கோர இந்தக் குறிப்பு எண்ணைப் பாதுகாக்கவும்: ',privacy:'தனியுரிமை / நீக்கக் கோரிக்கை',review:'சரிபார்த்த பிறகே கருத்துகள் வெளியாகும். இவை பார்வையாளர்களின் கருத்துகள்; உறுதிப்படுத்தப்பட்ட வணிகத் தகவல்கள் அல்ல.',invite:'இந்தப் பக்கத்தை எப்படி மேம்படுத்தலாம்?',dismiss:'இப்போது வேண்டாம்',loadError:'கருத்துகளை ஏற்ற முடியவில்லை. மீண்டும் முயற்சி செய்யுங்கள்.',verification:'Spam சரிபார்ப்பை முடிக்க முடியவில்லை. மீண்டும் முயற்சி செய்யுங்கள்.',expired:'மீண்டும் அனுப்ப முயற்சி செய்யுங்கள்.'}
 };
 let lang=document.documentElement.lang==='ta'?'ta':'en';let W=words[lang];
 const section=document.createElement('section');section.id='pt-user-comments';section.className='pt-community';section.setAttribute('aria-labelledby','pt-comments-title');
 section.innerHTML='<h2 id="pt-comments-title" data-cword="title"></h2><p data-cword="review"></p><button type="button" id="pt-feedback-button" data-cword="add" aria-haspopup="dialog" aria-controls="pt-feedback"></button> <button type="button" data-load data-cword="load"></button><div data-comments aria-live="polite"></div><button type="button" data-more data-cword="more" hidden></button><p><a href="/privacy-policy.html#community-privacy" data-cword="privacy"></a> · <a href="/#contact">Contact / தொடர்பு</a></p>';
 const footer=document.querySelector('footer');if(footer)footer.before(section);else document.body.append(section);
 const dialog=document.createElement('dialog');dialog.id='pt-feedback';dialog.className='pt-community';dialog.setAttribute('aria-labelledby','pt-feedback-title');
 dialog.innerHTML='<button type="button" data-close data-cword="close"></button><h2 id="pt-feedback-title" data-cword="add"></h2><p data-cword="intro"></p><form><label><span data-cword="name"></span><input name="name" maxlength="60" autocomplete="off"></label><label><span data-cword="location"></span><input name="location" maxlength="100" autocomplete="off"></label><label><span data-cword="purpose"></span><select name="purpose"><option value="" data-cword="choose"></option><option value="textiles" data-cword="textiles"></option><option value="local" data-cword="local"></option><option value="technology" data-cword="technology"></option><option value="other" data-cword="other"></option></select></label><label><span data-cword="message"></span><textarea name="message" required minlength="3" maxlength="1200" rows="4" aria-describedby="pt-comment-note"></textarea></label><div class="pt-honey" aria-hidden="true"><label>Website<input name="website" tabindex="-1" autocomplete="off"></label></div><p id="pt-comment-note" data-cword="note"></p><label class="pt-check"><input name="consent" type="checkbox" required><span data-cword="permission"></span></label><p><a href="/privacy-policy.html#community-privacy" data-cword="privacy"></a></p><button type="submit" data-cword="send"></button><p data-status role="status"></p></form>';
 document.body.append(dialog);
 const form=dialog.querySelector('form'),status=dialog.querySelector('[data-status]'),send=form.querySelector('[type=submit]');let busy=false,lastFocus;
 function renderWords(){W=words[lang];for(const root of [section,dialog]){root.lang=lang;root.querySelectorAll('[data-cword]').forEach(el=>el.textContent=W[el.dataset.cword]);}}
 renderWords();
 document.addEventListener('podaturpet:language',e=>{if(words[e.detail?.language]){lang=e.detail.language;renderWords();}});
 async function call(path,options={}){const r=await fetch(api+path,{...options,credentials:'omit',cache:'no-store',referrerPolicy:'no-referrer',signal:AbortSignal.timeout(15000)});if(!r.ok)throw new Error('HTTP '+r.status);return r.json();}
 function close(){if(busy)return;dialog.close();lastFocus?.focus();}
 dialog.querySelector('[data-close]').addEventListener('click',close);
 dialog.addEventListener('cancel',e=>{if(busy)e.preventDefault();});
 function open(){lastFocus=document.activeElement;status.textContent=api?'':W.unavailable;send.disabled=!api;dialog.showModal();}
 section.querySelector('#pt-feedback-button').addEventListener('click',open);
 let next=null;
 async function load(append=false){
  const button=section.querySelector(append?'[data-more]':'[data-load]'),list=section.querySelector('[data-comments]');button.disabled=true;
  try{
   if(!api){list.textContent=W.unavailable;return;}
   const data=await call('/v1/comments?page='+encodeURIComponent(page)+(append&&next?'&before='+next:''));
   if(!append)list.replaceChildren();
   if(!data.comments.length&&!append)list.textContent=W.empty;
   for(const c of data.comments){const article=document.createElement('article'),head=document.createElement('strong'),meta=document.createElement('p'),body=document.createElement('p');head.textContent=c.name;meta.className='pt-comment-meta';meta.textContent=[c.location,W[c.purpose]||'',new Date(c.created*1000).toLocaleDateString(lang==='ta'?'ta-IN':'en-GB')].filter(Boolean).join(' · ');body.textContent=c.message;article.append(head,meta,body);list.append(article);}
   next=data.next;section.querySelector('[data-more]').hidden=!next;
  }catch{if(!append)list.textContent=W.loadError;else{const p=document.createElement('p');p.textContent=W.loadError;list.append(p);}}finally{button.disabled=false;}
 }
 section.querySelector('[data-load]').addEventListener('click',()=>load());section.querySelector('[data-more]').addEventListener('click',()=>load(true));
 // Fetch public comments only when their section is in view, never poll.
 if(api&&'IntersectionObserver'in window){const observer=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){observer.disconnect();load();}},{rootMargin:'120px'});observer.observe(section);}
 async function proof(token){
  if(!crypto.subtle)throw new Error('No crypto');const enc=new TextEncoder();
  for(let i=0;i<100000;i++){
   const h=new Uint8Array(await crypto.subtle.digest('SHA-256',enc.encode(token+'.'+i)));
   if(h[0]===0&&h[1]<16)return i;
   if(i%250===0)await new Promise(r=>setTimeout(r,0));
  }
  throw new Error('Check failed');
 }
 form.addEventListener('submit',async e=>{
  e.preventDefault();if(busy||!api||!form.reportValidity())return;
  const fields=Object.fromEntries(new FormData(form));if(!fields.message.trim()||/https?:\/\/|www\./i.test(fields.message)){status.textContent=W.note;return;}
  busy=true;send.disabled=true;dialog.querySelector('[data-close]').disabled=true;status.textContent=W.sending;
  try{
   const challenge=await call('/v1/challenge?page='+encodeURIComponent(page));const solution=await proof(challenge.token);
   const result=await call('/v1/comments',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...fields,page,consent:fields.consent==='on',token:challenge.token,proof:solution})});
   form.reset();status.textContent=W.success+result.id;
  }catch{status.textContent=W.error;}finally{busy=false;send.disabled=false;dialog.querySelector('[data-close]').disabled=false;}
 });
 // One non-modal invitation per tab session. Do not interrupt typing or other dialogs.
 let mayInvite=false;try{mayInvite=api&&!sessionStorage.getItem('pt.comment.invited.v1');}catch{}
 if(mayInvite)setTimeout(()=>{
  if(document.hidden||document.querySelector('dialog[open]')||/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName))return;
  try{sessionStorage.setItem('pt.comment.invited.v1','1');}catch{return;}
  const invite=document.createElement('aside');invite.id='pt-comment-invite';invite.className='pt-community';invite.setAttribute('aria-label',W.invite);
  const p=document.createElement('p');p.textContent=W.invite;
  const yes=document.createElement('button');yes.type='button';yes.textContent=W.add;yes.onclick=()=>{invite.remove();open();};
  const no=document.createElement('button');no.type='button';no.textContent=W.dismiss;no.onclick=()=>invite.remove();invite.append(p,yes,no);document.body.append(invite);
 },30000);
})();
