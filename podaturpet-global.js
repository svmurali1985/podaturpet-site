(() => {
  'use strict';
  const more=document.querySelector('.site-more-languages');
  if(more){
    document.addEventListener('click',event=>{if(!more.contains(event.target))more.open=false;});
    more.addEventListener('keydown',event=>{if(event.key==='Escape'){more.open=false;more.querySelector('summary').focus();}});
    // Deliberately send only the public pathname: no form fields, search or fragment.
    more.querySelectorAll('[data-translate]').forEach(a=>{
      const url=new URL('https://translate.google.com/translate');
      url.search=new URLSearchParams({sl:'auto',tl:a.dataset.translate,u:'https://podaturpet.com'+location.pathname});
      a.href=url.href;
    });
  }
  document.querySelectorAll('[data-site-language]').forEach(button=>button.addEventListener('click',()=>{
    document.querySelectorAll('[data-translation-note]').forEach(n=>n.hidden=button.dataset.siteLanguage!=='ta');
  }));
  const form=document.getElementById('wholesale-enquiry');
  if(!form)return;
  const review=document.getElementById('buyer-review'),status=document.getElementById('buyer-status');
  const tamil=()=>document.body.dataset.siteLang==='ta';
  let draft='';
  const links=()=>review.querySelectorAll('[data-enquiry-channel]');
  const reset=()=>{draft='';review.hidden=true;links().forEach(a=>a.removeAttribute('href'));status.textContent='';};
  form.querySelector('button[type=submit]').disabled=false;
  const query=new URLSearchParams(location.search);
  const clean=v=>String(v||'').replace(/[\u0000-\u001f\u007f]/g,' ').trim();
  const design=clean(query.get('product'));if(design&&design.length<=180)form.elements.design.value=design;
  const market=clean(query.get('market'));if(market&&market.length<=180)form.elements.destination.value=market;
  const purpose=query.get('purpose');if(['quote','sample','help'].includes(purpose))form.elements.purpose.value=purpose;
  form.elements.purpose.addEventListener('change',()=>{if(form.elements.purpose.value==='help'&&!form.elements.design.value.trim())form.elements.design.value=tamil()?'வடிவம் தேர்வு செய்ய உதவுங்கள்':'Help me choose a design';reset();});
  form.addEventListener('input',reset);
  form.addEventListener('change',reset);
  document.addEventListener('podaturpet:language',reset);
  links().forEach(a=>a.addEventListener('click',()=>{if(draft)document.dispatchEvent(new CustomEvent('podaturpet:enquiry-handoff',{detail:{channel:a.dataset.enquiryChannel}}));}));
  review.querySelector('[data-copy-enquiry]')?.addEventListener('click',async()=>{
    if(!draft)return;
    const copied=draft;
    try {await navigator.clipboard.writeText(copied);if(draft===copied)status.textContent=tamil()?'செய்தி நகலெடுக்கப்பட்டது. உங்கள் செயலியில் ஒட்டி அனுப்புங்கள்.':'Message copied. Paste it in your app and send.';}
    catch {if(draft!==copied)return;const range=document.createRange();range.selectNodeContents(document.getElementById('buyer-message'));const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);status.textContent=tamil()?'செய்தி தேர்ந்தெடுக்கப்பட்டது. Copy மூலம் நகலெடுக்கவும்.':'Message selected. Use your device’s Copy command.';}
  });
  form.addEventListener('submit',event=>{
    event.preventDefault();reset();if(!form.reportValidity())return;
    const f=new FormData(form);
    if(!clean(f.get('design'))||!clean(f.get('destination'))){status.textContent=tamil()?'வடிவத்தையும் விநியோக இடத்தையும் உள்ளிடுங்கள்.':'Enter a design and delivery destination.';return;}
    const purposes={quote:['Wholesale quotation','மொத்த விலை விவரம்'],sample:['Sample availability and cost','மாதிரி இருப்பு மற்றும் விலை'],help:['Help choosing a design','வடிவம் தேர்வு செய்ய உதவி']};
    const intent=(purposes[f.get('purpose')]||purposes.quote)[tamil()?1:0];
    const names=tamil()?['வடிவம்','எண்ணிக்கை','சேருமிடம்','கூடுதல் தேவைகள்']:['Design','Quantity (pieces)','Destination','Requirements'];
    draft=(tamil()?'வணக்கம், லுங்கி வாங்க விவரம் வேண்டும்.':'Hello Podaturpet team, I would like information about buying lungis.')+'\n'+intent+'\n\n'+['design','quantity','destination','requirements'].map((k,i)=>names[i]+': '+(clean(f.get(k))||(k==='quantity'?(tamil()?'குறைந்தபட்ச ஆர்டரைத் தெரிவிக்கவும்':'Please advise minimum order'):tamil()?'குறிப்பிடப்படவில்லை':'Not specified'))).join('\n')+'\n\n'+(tamil()?'இருப்பு, துணி விவரம், மாதிரி விதிகள், பேக்கிங், விநியோகக் கட்டணம் ஆகியவற்றை உறுதிசெய்யுங்கள்.':'Please confirm availability, fabric details, sample terms, packing and delivery charges.');
    document.getElementById('buyer-message').textContent=draft;
    review.querySelector('[data-enquiry-channel="whatsapp"]').href='https://wa.me/14793201970?text='+encodeURIComponent(draft);
    review.querySelector('[data-enquiry-channel="email"]').href='mailto:svmuralicenterton@gmail.com?subject='+encodeURIComponent('Lungi enquiry — '+intent)+'&body='+encodeURIComponent(draft);
    review.hidden=false;status.textContent=tamil()?'வரைவு தயார். கீழே சரிபார்த்து அனுப்பும் வழியைத் தேர்வுசெய்யுங்கள்.':'Draft ready. Review it below and choose how to send.';
    review.setAttribute('tabindex','-1');review.focus();
  });
})();
