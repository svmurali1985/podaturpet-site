(function () {
  "use strict";
  // Preserve explicit opt-in, device-only tool totals; separate site counts below.
  const marketRoot=document.getElementById('service-marketplace');
  if (document.getElementById('life-count-consent')) { localLifeCounts(); }
  function localLifeCounts(){
    const box=document.getElementById('life-count-consent'),out=document.getElementById('life-counts'),button=document.getElementById('life-count-export'),status=document.getElementById('life-count-status');
    let U=marketRoot?window.PodaturpetServicesData.ui[marketRoot.lang==='en'?'en':'ta']:window.PeopleHubData.ui[document.documentElement.lang==='ta'?'ta':'en'];
    const key='podaturpet.life.counts.v1',stages=['view','ask','guide','calculate','official','preview','handoff','market_search','market_profile','market_contact','market_enquiry_prepared','market_enquiry_handoff'],labels=['view','askStage','guideStage','calculateStage','officialStage','previewStage','handoffStage','countSearch','countProfile','countContact','countPrepared','countEnquiry'];
    let counts=Object.fromEntries(stages.map(s=>[s,0])),enabled=false;
    const blocked=navigator.globalPrivacyControl===true||navigator.doNotTrack==='1';
    function render(){out.replaceChildren();stages.forEach((s,i)=>{if(marketRoot&&!['view','market_search','market_profile','market_contact','market_enquiry_prepared','market_enquiry_handoff'].includes(s))return;const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=U[labels[i]]||labels[i];dd.textContent=String(counts[s]);out.append(dt,dd);});box.checked=enabled;button.disabled=!enabled;}
    function failure(){enabled=false;status.textContent=U.metricsFail;render();}
    function save(){try{localStorage.setItem(key,JSON.stringify({version:1,counts}));}catch(_){failure();}}
    function increment(stage){if(!enabled||!stages.includes(stage))return;counts[stage]=Math.min(1000000,counts[stage]+1);save();render();}
    try{if(blocked){localStorage.removeItem(key);box.disabled=true;status.textContent=U.metricsFail;}else{const raw=localStorage.getItem(key);if(raw){const d=JSON.parse(raw);if(d.version===1&&d.counts&&stages.every(s=>d.counts[s]===undefined||Number.isInteger(d.counts[s])&&d.counts[s]>=0&&d.counts[s]<=1000000)){counts=Object.fromEntries(stages.map(s=>[s,d.counts[s]||0]));enabled=true;}}}}catch(_){failure();}
    box.addEventListener('change',()=>{if(blocked)return;enabled=box.checked;if(enabled){status.textContent='';increment('view');}else{counts=Object.fromEntries(stages.map(s=>[s,0]));try{localStorage.removeItem(key);}catch(_){failure();}}render();});
    document.addEventListener('podaturpet:life-event',e=>increment(e.detail&&e.detail.stage));
    document.addEventListener('podaturpet:market-event',e=>{if(['market_search','market_profile','market_contact','market_enquiry_prepared','market_enquiry_handoff'].includes(e.detail&&e.detail.stage))increment(e.detail.stage);});
    document.addEventListener('podaturpet:market-language',e=>{if(marketRoot&&['en','ta'].includes(e.detail&&e.detail.lang)){U=window.PodaturpetServicesData.ui[e.detail.lang];render();}});
    button.addEventListener('click',()=>{if(!enabled)return;const url=URL.createObjectURL(new Blob([JSON.stringify({scope:'this device only; steps, not people or leads',version:1,counts},null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='podaturpet-device-counts.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
    if(enabled)increment('view');render();
  }



  let api='';try{const u=new URL(window.PodaturpetCommunity?.apiBase);if(u.protocol==='https:'&&u.hostname.endsWith('.workers.dev')&&u.pathname==='/')api=u.origin;}catch{}
  if(!api)return;
  const key='pt.analytics.choice.v1',blocked=navigator.globalPrivacyControl===true||navigator.doNotTrack==='1';
  let choice='unset',sent=false;
  try{const saved=JSON.parse(localStorage.getItem(key));if(saved&&saved.expires>Date.now()&&['yes','no'].includes(saved.value))choice=saved.value;}catch{}
  if(blocked)choice='no';
  const panel=document.createElement('aside');panel.id='pt-privacy-choice';panel.className='pt-community';panel.setAttribute('aria-label','Privacy choices / தனியுரிமை');
  panel.innerHTML='<p>May we count this page view and approximate country, region and city? No names, IP addresses or browsing identifiers are stored in our analytics database. Optional; you can change your choice here.</p><p lang="ta">இந்தப் பக்கப் பார்வை மற்றும் தோராயமான நாடு, மாநிலம், ஊரை எண்ணலாமா? பெயர், IP, தனிநபர் அடையாளம் எங்கள் analytics database-ல் சேமிக்கப்படாது. இது உங்கள் விருப்பம்.</p><button type="button" data-choice="yes">Allow / அனுமதி</button> <button type="button" data-choice="no">No thanks / வேண்டாம்</button> <a href="/privacy-policy.html#community-privacy">Privacy / தனியுரிமை</a><p data-choice-status role="status"></p>';
  const comments=document.getElementById('pt-user-comments'),footer=document.querySelector('footer');(comments||footer)?.before(panel);if(!panel.isConnected)document.body.append(panel);
  function render(){panel.querySelectorAll('[data-choice]').forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.choice===choice));b.disabled=blocked&&b.dataset.choice==='yes';});panel.querySelector('[data-choice-status]').textContent=blocked?'Your browser privacy preference blocks counting. / உலாவியின் தனியுரிமை அமைப்பு எண்ணிக்கையைத் தடுக்கிறது.':choice==='yes'?'Optional counting enabled. / விருப்ப எண்ணிக்கை அனுமதிக்கப்பட்டது.':choice==='no'?'Optional counting off. / விருப்ப எண்ணிக்கை முடக்கப்பட்டுள்ளது.':'';}
  function track(){if(sent||choice!=='yes'||blocked)return;sent=true;fetch(api+'/v1/view',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({page:location.pathname==='/'?'/index.html':location.pathname,consent:true}),credentials:'omit',referrerPolicy:'no-referrer',keepalive:true}).catch(()=>{});}
  panel.querySelectorAll('[data-choice]').forEach(button=>button.addEventListener('click',()=>{choice=button.dataset.choice;if(blocked)choice='no';try{localStorage.setItem(key,JSON.stringify({value:choice,expires:Date.now()+180*86400000}));}catch{}render();track();}));
  render();track();
})();
