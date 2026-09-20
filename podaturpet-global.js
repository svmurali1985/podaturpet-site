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
  const reset=()=>{review.hidden=true;review.querySelector('a').removeAttribute('href');status.textContent='';};
  form.querySelector('button[type=submit]').disabled=false;
  const query=new URLSearchParams(location.search);
  const design=query.get('product');if(design&&/^[\w -]{1,80}$/.test(design))form.elements.design.value=design;
  const market=query.get('market');if(market&&/^[\w ,.-]{1,80}$/.test(market))form.elements.destination.value=market;
  form.addEventListener('input',reset);
  document.addEventListener('podaturpet:language',reset);
  form.addEventListener('submit',event=>{
    event.preventDefault();reset();if(!form.reportValidity())return;
    const f=new FormData(form);
    if(!String(f.get('design')).trim()||!String(f.get('destination')).trim()){
      status.textContent=tamil()?'வடிவத்தையும் விநியோக இடத்தையும் உள்ளிடுங்கள்.':'Enter a design and delivery destination.';return;
    }
    const names=tamil()?['வடிவம்','எண்ணிக்கை','சேருமிடம்','கூடுதல் தேவைகள்']:['Design','Quantity (pieces)','Destination','Requirements'];
    const message=(tamil()?'வணக்கம், மொத்த லுங்கி விலை விவரம் வேண்டும்.':'Hello Podaturpet team, I would like a wholesale lungi quote.')+'\n\n'+['design','quantity','destination','requirements'].map((k,i)=>names[i]+': '+String(f.get(k)||'').trim()).join('\n')+'\n\n'+(tamil()?'இருப்பு, துணி விவரம், மாதிரி விதிகள், பேக்கிங், விநியோகக் கட்டணம் ஆகியவற்றை உறுதிசெய்யுங்கள்.':'Please confirm availability, fabric details, sample terms, packing and delivery charges.');
    document.getElementById('buyer-message').textContent=message;
    review.querySelector('a').href='https://wa.me/14793201970?text='+encodeURIComponent(message);
    review.hidden=false;status.textContent=tamil()?'வரைவு தயார். கீழே சரிபார்க்கவும்.':'Your draft is ready. Review it below.';
    review.setAttribute('tabindex','-1');review.focus();
  });
})();
