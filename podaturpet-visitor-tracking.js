(function () {
  "use strict";
  // The hub has no network analytics. Explicit opt-in, device-only funnel totals.
  const marketRoot=document.getElementById('service-marketplace');
  if (document.getElementById('life-count-consent')) { localLifeCounts(); if(!marketRoot)return; }
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
    const net=document.getElementById('market-network-consent');if(net){net.checked=false;if(blocked)net.disabled=true;}
    button.addEventListener('click',()=>{if(!enabled)return;const url=URL.createObjectURL(new Blob([JSON.stringify({scope:'this device only; steps, not people or leads',version:1,counts},null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='podaturpet-device-counts.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
    if(enabled)increment('view');render();
  }


  var endpoint = "https://podaturpet-visitor-tracker.svmuralicenterton.workers.dev/track";
  var trackedHostnames = ["podaturpet.com", "www.podaturpet.com"];

  if (trackedHostnames.indexOf(window.location.hostname) === -1) {
    return;
  }

  if (navigator.globalPrivacyControl === true || navigator.doNotTrack === "1") {
    return;
  }

  // Only fixed new service stages. No query, location, provider ID, lead ref or message payload.
  document.addEventListener('podaturpet:market-event',function(e){
    var choice=document.getElementById('market-network-consent');
    if(!marketRoot||!choice||!choice.checked)return;
    if(['market_search','market_profile','market_contact','market_enquiry_prepared','market_enquiry_handoff'].indexOf(e.detail&&e.detail.stage)!==-1)track(e.detail.stage);
  });

  function safeReferrer() {
    try { return document.referrer ? new URL(document.referrer).origin : ""; }
    catch (_) { return ""; }
  }
  document.addEventListener("podaturpet:enquiry-handoff", function (event) {
    if (event.detail && event.detail.channel === "email") track("email_click");
    else if (event.detail && event.detail.channel === "whatsapp") track("whatsapp_click");
  });

  function track(eventName) {
    var path = window.location.pathname;
    var journey = /town|stories|tourist|local-business|government|useful-information|travel-pin/.test(path) ? "town" : path === "/" || path === "/index.html" ? "home" : "wholesale";
    var params = new URLSearchParams(window.location.search);
    // Only known campaign tags are recorded; arbitrary query strings and form data are excluded.
    var allowed = {utm_source:["whatsapp","facebook","instagram","email"],utm_medium:["social","group","email"],utm_campaign:["wholesale-buyers","town-community","local-businesses"]};
    var campaign = {};
    Object.keys(allowed).forEach(function(key){var value=params.get(key);if(allowed[key].indexOf(value)!==-1)campaign[key]=value;});
    var payload = JSON.stringify({
      event: eventName,
      page: window.location.origin + window.location.pathname,
      title: document.title,
      referrer: safeReferrer(),
      journey: journey,
      campaign: campaign
    });

    if (navigator.sendBeacon) {
      var body = new Blob([payload], { type: "text/plain;charset=UTF-8" });

      if (navigator.sendBeacon(endpoint, body)) {
        return;
      }
    }

    fetch(endpoint, {
      method: "POST",
      mode: "cors",
      keepalive: true,
      headers: { "Content-Type": "text/plain;charset=UTF-8" },
      body: payload
    }).catch(function () {});
  }

  function linkContext(link) {
    var text = [
      link.textContent || "",
      link.getAttribute("aria-label") || "",
      link.getAttribute("href") || ""
    ].join(" ").toLowerCase();

    var advertisingSection = link.closest(
      "#advertise, .town-advertising, .town-ad-copy, .local-services-banner, [data-notice-type='advertising']"
    );

    if (advertisingSection || /advertis|promot.*shop|promot.*business/.test(text)) {
      return "advertisement_click";
    }

    if (/catalogue|catalog|collection|lungi-product/.test(text)) {
      return "catalogue_click";
    }

    if (/lungi|wholesale|weav|textile|quote|product|sourc/.test(text)) {
      return "lungi_click";
    }

    return "";
  }

  track("page_view");
  document.addEventListener("podaturpet:feedback-handoff", function () { track("feedback_handoff"); });
  document.addEventListener("podaturpet:community-handoff", function () { track("community_handoff"); });

  document.addEventListener("click", function (event) {
    if(event.target.closest("#service-marketplace"))return; // Avoid old quote/WhatsApp classification and duplicate counts.
    var link = event.target.closest("a[href], button");

    if (!link) {
      return;
    }

    var href = (link.getAttribute("href") || "").toLowerCase();
    var context = linkContext(link);
    if (link.dataset.track === "directions_click") context = "directions_click";
    else if (/podaturpet-stories-and-culture/.test(href)) context = "story_click";
    else if (/podaturpet-town-guide/.test(href) && !/contribute=/.test(href)) context = "town_guide_click";
    else if (/contribute=business/.test(href)) context = "listing_request_click";
    var contactEvent = "";

    if (/wa\.me|whatsapp/.test(href)) {
      contactEvent = "whatsapp_click";
    } else if (href.indexOf("tel:") === 0) {
      contactEvent = "phone_click";
    } else if (href.indexOf("mailto:") === 0) {
      contactEvent = "email_click";
    }

    if (context) {
      track(context);
    }

    if (contactEvent && contactEvent !== context) {
      track(contactEvent);
    }
  }, { capture: true, passive: true });
})();
