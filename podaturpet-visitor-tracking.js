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
  const counts=document.createElement('section');counts.className='pt-community pt-views-compact';counts.id='pt-public-views';
  const disclosure=document.createElement('details');disclosure.className='pt-views-disclosure';
  const toggleSummary=document.createElement('summary');
  const panel=document.createElement('div');panel.className='pt-views-panel';
  disclosure.append(toggleSummary,panel);counts.append(disclosure);
  const styles=document.createElement('style');styles.textContent=`
  #pt-public-views.pt-views-compact{width:calc(100% - 36px);max-width:1200px;margin:0 auto 24px;padding:0;min-height:0;border:0;background:transparent;font-family:Arial,sans-serif;color:#173f43}
  #pt-public-views .pt-views-disclosure>summary{display:list-item;width:fit-content;max-width:100%;cursor:pointer;padding:11px 16px;border:1px solid #cddcd8;border-radius:8px;background:#fff;font-size:13px;font-weight:600;min-height:44px}
  #pt-public-views summary:focus-visible{outline:3px solid #a75d2d;outline-offset:4px}
  #pt-public-views .pt-views-panel{padding:20px;margin-top:10px;background:#fff;border:1px solid #d5e1dc;border-radius:12px;max-height:420px;overflow:auto}
  #pt-public-views .stats-heading{display:flex;justify-content:space-between;align-items:center;gap:15px}
  #pt-public-views .stats-heading h2{font:700 18px/1.4 Arial,sans-serif;margin:0}
  #pt-public-views .stats-heading button{font:600 12px Arial,sans-serif;padding:10px 14px;min-height:44px;border:1px solid #cddcd8;border-radius:6px;background:#edf6f3;color:#173f43;cursor:pointer}
  #pt-public-views .stats-total{font:700 30px/1.3 Arial,sans-serif;margin:12px 0}
  #pt-public-views p{font-size:12px;line-height:1.8;margin:10px 0}
  #pt-public-views .stats-table-wrap{overflow-x:auto;max-width:100%}
  #pt-public-views table{border-collapse:collapse;width:100%;font-size:12px}
  #pt-public-views th,#pt-public-views td{padding:9px;text-align:left;border-bottom:1px solid #d5e1dc;white-space:normal}
  #pt-public-views .stats-error{color:#8e4826}
  #pt-public-views .pt-views-panel details{margin-top:14px}
  #pt-public-views .pt-views-panel summary{cursor:pointer;min-height:36px;font-size:13px}
  `;document.head.append(styles);
  const countsFooter=document.querySelector('footer');if(countsFooter)countsFooter.before(counts);else document.body.append(counts);
  let stats=null,statsError=false;
  const isTamil=()=>document.body.dataset.siteLang==='ta'||document.documentElement.lang==='ta';
  function drawCounts(){
    const ta=isTamil();toggleSummary.textContent=ta?'தளப் பார்வைகள்':'Website views';panel.replaceChildren();
    const top=document.createElement('div');top.className='stats-heading';
    const heading=document.createElement('h2');heading.textContent=ta?'நம் தளத்தின் பார்வைகள்':'Our website views';top.append(heading);
    const refresh=document.createElement('button');refresh.type='button';refresh.textContent=ta?'புதுப்பி':'Refresh';refresh.addEventListener('click',loadCounts);top.append(refresh);panel.append(top);
    const total=document.createElement('p');total.className='stats-total';total.setAttribute('aria-live','polite');
    total.textContent=stats?new Intl.NumberFormat(ta?'ta-IN':'en-US').format(stats.siteViews):(statsError?'—':'…');panel.append(total);
    const note=document.createElement('p');note.className='stats-note';note.textContent=ta?'கடந்த 30 நாட்களின் மொத்தத் தளப் பார்வைகள். மீண்டும் திறந்ததும் எண்ணப்படும்; தனிநபர் எண்ணிக்கை அல்ல.':'Recorded site-wide page loads in the last 30 days. Repeat visits count; this is not a unique-person total.';panel.append(note);
    if(statsError){const error=document.createElement('p');error.className='stats-error';error.setAttribute('role','status');error.textContent=ta?'நேரடி எண்ணிக்கையைப் பெற முடியவில்லை. Refresh முயலுங்கள். API இணைப்பைச் சரிபார்க்க வேண்டும்.':'Live counts could not be reached. Try Refresh. The analytics API connection may need attention.';panel.append(error);}
    if(!stats)return;
    const details=document.createElement('details'),summary=document.createElement('summary');summary.textContent=ta?'நாடு · மாநிலம் · நகரம் வாரியாகப் பாருங்கள்':'View countries, states and cities';details.open=false;details.append(summary);
    const scope=document.createElement('p');scope.textContent=ta?'முழுத் தளத்தின் முதல் 50 இடங்கள். இடம் தோராயமானது; கிடைக்காத விவரம் குறிப்பிடப்படும். IP அல்லது தனிநபர் பதிவுகள் காட்டப்படாது.':'Top 50 locations across the site. Geography is approximate; unavailable fields are labelled. No IP addresses or individual visitor records are shown.';details.append(scope);
    const missing=ta?'கிடைக்கவில்லை':'Unavailable';
    const regionNames=typeof Intl.DisplayNames==='function'?new Intl.DisplayNames([ta?'ta':'en'],{type:'region'}):null;
    const countryName=v=>{if(!v||v==='Unknown')return missing;try{return regionNames?.of(v)||v;}catch{return v;}};
    const value=v=>!v||v==='Unknown'?missing:v;
    function table(headers,rows){const wrap=document.createElement('div');wrap.className='stats-table-wrap';const table=document.createElement('table'),thead=document.createElement('thead'),tr=document.createElement('tr');for(const label of headers){const th=document.createElement('th');th.scope='col';th.textContent=label;tr.append(th);}thead.append(tr);table.append(thead);const tbody=document.createElement('tbody');for(const row of rows){const line=document.createElement('tr');for(const v of row){const td=document.createElement('td');td.textContent=String(v);line.append(td);}tbody.append(line);}table.append(tbody);wrap.append(table);return wrap;}
    const geo=Array.isArray(stats.geography)?stats.geography:null;
    if(geo){
      if(!geo.length){const empty=document.createElement('p');empty.textContent=ta?'இந்தக் காலத்தில் பதிவான பார்வைகள் இல்லை.':'No recorded views in this period.';details.append(empty);}
      else details.append(table(ta?['நாடு','மாநிலம்','நகரம்','பார்வைகள்']:['Country','State / region','City','Views'],geo.map(r=>[countryName(r.country),value(r.region),value(r.city),r.views])));
      for(const [key,title,headers] of [['countries',ta?'நாடு வாரியான மொத்தம்':'Country totals',ta?['நாடு','பார்வைகள்']:['Country','Views']],['regions',ta?'மாநிலம் வாரியான மொத்தம்':'State / region totals',ta?['நாடு','மாநிலம்','பார்வைகள்']:['Country','State / region','Views']]]){
       const rows=stats[key];if(!Array.isArray(rows)||!rows.length)continue;const group=document.createElement('details'),label=document.createElement('summary');label.textContent=title;group.append(label);group.append(table(headers,rows.map(r=>key==='countries'?[countryName(r.country),r.views]:[countryName(r.country),value(r.region),r.views])));details.append(group);
      }
    }else{
      const upgrade=document.createElement('p');upgrade.className='stats-error';upgrade.textContent=ta?'நாடு/மாநில விவரங்களுக்கு analytics Worker update தேவை. தற்போது பழைய API நகரத் தகவல்களை மட்டுமே தருகிறது.':'Country/state details require the updated analytics Worker. The current API returns city data only.';details.append(upgrade);
      if(stats.locations.length)details.append(table(ta?['நகரம் (இந்தப் பக்கம்)','பார்வைகள்']:['City (this page)','Views'],stats.locations.map(r=>[value(r.city),r.views])));
    }
    panel.append(details);
  }
  const pagePath=location.pathname==='/'?'/index.html':location.pathname;
  let generation=0,loading=false;
  async function loadCounts(){if(loading)return;loading=true;const requestGeneration=++generation;try{const response=await fetch(api+'/v1/stats?page='+encodeURIComponent(pagePath),{credentials:'omit',referrerPolicy:'no-referrer',signal:AbortSignal.timeout(10000)});if(!response.ok)throw Error('counts');const data=await response.json();if(!Number.isSafeInteger(data.pageViews)||!Number.isSafeInteger(data.siteViews)||!Array.isArray(data.locations))throw Error('counts');if(requestGeneration!==generation)return;stats=data;statsError=false;}catch{if(requestGeneration!==generation)return;statsError=true;}loading=false;drawCounts();}
  document.addEventListener('podaturpet:language',drawCounts);drawCounts();
  const key='pt.analytics.choice.v1',blocked=navigator.globalPrivacyControl===true||navigator.doNotTrack==='1';
  let declined=false;
  try{const saved=JSON.parse(localStorage.getItem(key));declined=!!(saved&&saved.expires>Date.now()&&saved.value==='no');}catch{}
  async function start(){
    if(!blocked&&!declined){
      try{await fetch(api+'/v1/view',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({page:pagePath,countMode:'aggregate'}),credentials:'omit',referrerPolicy:'no-referrer',keepalive:true,signal:AbortSignal.timeout(10000)});}catch{}
    }
  }
  disclosure.addEventListener('toggle',()=>{if(disclosure.open&&!stats&&!statsError)loadCounts();});
  start();
  window.addEventListener('online',()=>{if(disclosure.open)loadCounts();});
})();
