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
  const counts=document.createElement('section');counts.className='pt-community';counts.id='pt-public-views';
  const countsFooter=document.querySelector('footer');if(countsFooter)countsFooter.before(counts);else document.body.append(counts);
  let stats=null,statsError=false;
  const isTamil=()=>document.body.dataset.siteLang==='ta'||document.documentElement.lang==='ta';
  function drawCounts(){
    const ta=isTamil();counts.replaceChildren();
    const heading=document.createElement('h2');heading.textContent=ta?'பக்கப் பார்வைகள்':'Page views';counts.append(heading);
    const note=document.createElement('p');note.textContent=ta?'கடந்த 30 நாட்கள் · பதிவான பக்கப் பார்வைகள். மீண்டும் திறந்ததும் எண்ணப்படும்; தனித்தனி நபர்களின் எண்ணிக்கை அல்ல.':'Last 30 days · Recorded page loads. Repeat loads count; these are not unique viewers.';counts.append(note);
    const total=document.createElement('p');
    if(!stats){total.textContent=statsError?(ta?'பார்வை எண்ணிக்கையை இப்போது பெற முடியவில்லை.':'View counts are unavailable right now.'):(ta?'எண்ணிக்கையை ஏற்றுகிறது…':'Loading counts…');counts.append(total);return;}
    total.textContent=ta?'இந்தப் பக்கம்: '+stats.pageViews+' · முழுத் தளம்: '+stats.siteViews:'This page: '+stats.pageViews+' · Entire site: '+stats.siteViews;counts.append(total);
    const details=document.createElement('details'),summary=document.createElement('summary');summary.textContent=ta?'நகரம் வாரியாகப் பார்வைகள்':'Views by city';details.open=true;details.append(summary);
    const scope=document.createElement('p');scope.textContent=ta?'இந்தப் பக்கத்தின் முதல் 50 நகரங்கள். இடம் தோராயமானது; ஒரே பெயருள்ள நகரங்கள் ஒன்றாக எண்ணப்படும்.':'Top 50 cities for this page. Locations are approximate; identically named cities are combined.';details.append(scope);
    if(!stats.locations.length){const empty=document.createElement('p');empty.textContent=ta?'இந்தக் காலத்தில் பதிவான பார்வைகள் இல்லை.':'No recorded page views in this period.';details.append(empty);}
    else{
      const table=document.createElement('table'),head=document.createElement('thead'),tr=document.createElement('tr');
      for(const label of ta?['நகரம்','பார்வைகள்']:['City','Views']){const th=document.createElement('th');th.scope='col';th.textContent=label;tr.append(th);}head.append(tr);table.append(head);
      const body=document.createElement('tbody');
      for(const row of stats.locations){const line=document.createElement('tr');
        const city=!row.city||row.city==='Unknown'?(ta?'நகரம் கிடைக்கவில்லை':'City unavailable'):row.city;
        for(const value of [city,row.views]){const td=document.createElement('td');td.textContent=String(value);line.append(td);}body.append(line);}
      table.append(body);details.append(table);
    }counts.append(details);
  }
  const pagePath=location.pathname==='/'?'/index.html':location.pathname;
  let generation=0;
  async function loadCounts(){const requestGeneration=++generation;try{const response=await fetch(api+'/v1/stats?page='+encodeURIComponent(pagePath),{credentials:'omit',referrerPolicy:'no-referrer',signal:AbortSignal.timeout(10000)});if(!response.ok)throw Error('counts');const data=await response.json();if(!Number.isSafeInteger(data.pageViews)||!Number.isSafeInteger(data.siteViews)||!Array.isArray(data.locations))throw Error('counts');if(requestGeneration!==generation)return;stats=data;statsError=false;}catch{if(requestGeneration!==generation)return;statsError=true;}drawCounts();}
  document.addEventListener('podaturpet:language',drawCounts);drawCounts();
  const key='pt.analytics.choice.v1',blocked=navigator.globalPrivacyControl===true||navigator.doNotTrack==='1';
  let declined=false;
  try{const saved=JSON.parse(localStorage.getItem(key));declined=!!(saved&&saved.expires>Date.now()&&saved.value==='no');}catch{}
  async function start(){
    if(!blocked&&!declined){
      try{await fetch(api+'/v1/view',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({page:pagePath,countMode:'aggregate'}),credentials:'omit',referrerPolicy:'no-referrer',keepalive:true,signal:AbortSignal.timeout(10000)});}catch{}
    }
    await loadCounts();
  }
  start();
})();
