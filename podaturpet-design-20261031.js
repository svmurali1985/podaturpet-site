/* Local UI only; no form content, personal data or analytics events leave this script. */
(() => {
  'use strict';
  const tamil=()=>document.documentElement.lang==='ta';
  const tools=document.querySelector('.catalogue-tools');
  const cards=[...document.querySelectorAll('[data-design]')];
  let active='all';
  function filter(){
    let count=0;
    cards.forEach(card=>{card.hidden=active!=='all'&&card.dataset.design!==active;if(!card.hidden)count++;});
    const status=document.getElementById('design-count');
    if(status)status.textContent=tamil()?`${count} வடிவங்கள்`:`${count} design${count===1?'':'s'}`;
  }
  if(tools){
    tools.hidden=false;
    tools.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
      active=button.dataset.filter;
      tools.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
      filter();
    }));filter();
  }
  const key='pt.analytics.choice.v1';
  const blocked=navigator.globalPrivacyControl===true||navigator.doNotTrack==='1';
  const production=['podaturpet.com','www.podaturpet.com'].includes(location.hostname);
  function choice(){try{const saved=JSON.parse(localStorage.getItem(key));return saved?.expires>Date.now()?saved.value:null;}catch{return null;}}
  function drawPrivacy(){
    const value=choice();
    document.querySelectorAll('[data-analytics-choice]').forEach(b=>{b.disabled=blocked;b.setAttribute('aria-pressed',String(b.dataset.analyticsChoice===value));});
    const status=document.querySelector('[data-analytics-status]');
    if(status)status.textContent=blocked?(tamil()?'உங்கள் உலாவியின் தனியுரிமை விருப்பத்தால் எண்ணிக்கை முடக்கப்பட்டுள்ளது.':'Analytics are disabled by your browser’s privacy signal.'):
      !production?(tamil()?'முன்னோட்டம்: பார்வைகள் production சேவைக்கு அனுப்பப்படாது.':'Preview: visits are excluded from production analytics.'):
      value==='yes'?(tamil()?'அனுமதிக்கப்பட்டது. எப்போது வேண்டுமானாலும் திரும்பப் பெறலாம்.':'Allowed. You can withdraw at any time.'):
      value==='no'?(tamil()?'எண்ணிக்கை முடக்கப்பட்டுள்ளது.':'Analytics are off.'):(tamil()?'உங்கள் அனுமதி வரும் வரை எண்ணிக்கை முடக்கப்பட்டுள்ளது.':'Analytics are off until you choose to allow them.');
  }
  document.querySelectorAll('[data-analytics-choice]').forEach(button=>button.addEventListener('click',()=>{
    if(blocked)return;
    try{
      localStorage.setItem(key,JSON.stringify({value:button.dataset.analyticsChoice,expires:Date.now()+180*86400000}));
      if(button.dataset.analyticsChoice==='no')localStorage.removeItem('pt.contact.clicks.v1');
      document.dispatchEvent(new CustomEvent('podaturpet:analytics-choice'));
      drawPrivacy();
    }catch{
      const status=document.querySelector('[data-analytics-status]');
      if(status)status.textContent=tamil()?'விருப்பத்தைச் சேமிக்க முடியவில்லை. எண்ணிக்கை முடக்கப்பட்டுள்ளது.':'Your choice could not be saved. Analytics remain off.';
    }
  }));
  document.addEventListener('click',event=>{
    const a=event.target.closest('a[href]');if(!a)return;
    let url;try{url=new URL(a.href);}catch{return;}
    const channel=url.hostname==='wa.me'?'whatsapp':url.protocol==='tel:'?'phone':url.protocol==='mailto:'?'email':null;
    if(!channel)return;
    // Preserve the enquiry event hook without recording message text or contact details.
    document.dispatchEvent(new CustomEvent('podaturpet:enquiry-handoff',{detail:{channel}}));
    if(!production||blocked||choice()!=='yes')return;
    try{const counts=JSON.parse(localStorage.getItem('pt.contact.clicks.v1'))||{};counts[channel]=Math.min(1000000,(Number(counts[channel])||0)+1);localStorage.setItem('pt.contact.clicks.v1',JSON.stringify(counts));}catch{}
  });
  const greeting=document.querySelector('.greeting');
  if(greeting&&new Date().toISOString().slice(0,10)>'2026-11-08')greeting.hidden=true;
  // Mark historical notices on this page as time moves forward, without claiming a live news feed.
  function pastEvents(){
    document.querySelectorAll('[data-event-date]').forEach(card=>{
      if(card.dataset.eventDate<new Date().toISOString().slice(0,10)){
        const status=card.querySelector('.local-news-status');
        if(status)status.textContent=(tamil()?'கடந்த நிகழ்வு · ':'Past event · ')+card.dataset.eventDate;
      }
    });
  }
  const current=document.querySelector('[data-home-language][aria-current]');
  if(current)current.setAttribute('aria-current','page');
  document.addEventListener('podaturpet:language',()=>{filter();drawPrivacy();pastEvents();
    document.querySelectorAll('[data-site-language][data-home-language]').forEach(a=>a.setAttribute('aria-current',a.dataset.siteLanguage===document.documentElement.lang?'page':'false'));
  });
  drawPrivacy();pastEvents();
})();
