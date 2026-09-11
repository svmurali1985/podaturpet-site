(() => {
  'use strict';
  const products = {'PT-WC-01':'Classic White Checks','PT-BB-02':'White & Blue Border','PT-CC-03':'Everyday Colour','PT-HC-04':'Heritage Checks','PT-PC-05':'Blue Check Designs','PT-NC-06':'Understated Checks'};
  const params = new URLSearchParams(location.search);
  const selected = products[params.get('product')] ? params.get('product') : '';
  const clean = (value, max=120) => String(value || '').replace(/[\r\n\u0000-\u001f]/g,' ').trim().slice(0,max);
  const market = clean(params.get('market'),100);
  const quote = document.getElementById('wholesale-quote-form');
  const marketForm = document.getElementById('market-enquiry');
  if (quote) {
    if (selected) quote.elements.product.value=selected;
    if (market) quote.elements.destination.value=market;
    const sync=()=>document.querySelectorAll('[data-product-choice]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.productChoice===quote.elements.product.value)));
    quote.elements.product.addEventListener('change',sync);
    document.querySelectorAll('[data-product-choice]').forEach(button => button.addEventListener('click', () => {
      const value = button.dataset.productChoice;
      if ([...quote.elements.product.options].some(option => option.value === value)) {
        quote.elements.product.value = value;sync();
      }
    }));
    sync();
  }
  if (marketForm) {
    if (market) {
      if (![...marketForm.elements.market.options].some(o=>o.value===market)) marketForm.elements.market.add(new Option(market,market));
      marketForm.elements.market.value=market;
    }
    if(selected) marketForm.elements.design.value=selected+' · '+products[selected];
  }
  // Only non-personal navigation context is propagated. Form contents are never stored.
  document.querySelectorAll('a[href]').forEach(a=>{
    const u=new URL(a.href,location.href);
    if(u.origin!==location.origin||!(/\.html$/.test(u.pathname)||u.pathname==='/'))return;
    if(selected&&!u.searchParams.has('product'))u.searchParams.set('product',selected);
    if(market&&!u.searchParams.has('market'))u.searchParams.set('market',market);
    ['utm_source','utm_medium','utm_campaign'].forEach(k=>{if(params.get(k))u.searchParams.set(k,clean(params.get(k),80));});
    a.href=u.pathname+u.search+u.hash;
  });
  const ta=()=>document.documentElement.dataset.buyerLanguage==='ta';
  const emit=(channel)=>document.dispatchEvent(new CustomEvent('podaturpet:enquiry-handoff',{detail:{channel}}));
  [quote,marketForm].filter(Boolean).forEach(form=>{
    form.addEventListener('input',e=>e.target.setCustomValidity?.(''));
    form.addEventListener('invalid',e=>{
      if(ta())e.target.setCustomValidity(e.target.validity.typeMismatch?'சரியான மின்னஞ்சல் முகவரியை உள்ளிடுங்கள்.':'இந்த விவரத்தை நிரப்புங்கள்.');
    },true);
    document.addEventListener('podaturpet:language',()=>[...form.elements].forEach(el=>el.setCustomValidity?.('')));
    form.addEventListener('submit',e=>{
      e.preventDefault();
      if(!form.reportValidity())return;
      const get=n=>clean(form.elements[n]?.value,n==='notes'?1500:160);
      const isTamil=ta();
      const lines=[isTamil?'வணக்கம், மொத்தமாக லுங்கி வாங்க விலை விவரம் தேவை.':'Hello Podaturpet team, I would like a wholesale lungi quotation.'];
      const add=(en,tamil,v)=>{if(v)lines.push((isTamil?tamil:en)+': '+v);};
      if(form===quote){
        add('Business name','நிறுவனத்தின் பெயர்',get('business_name'));
        const code=get('product'); add('Design reference','வடிவ எண்',products[code]?code+' · '+products[code]:get('product'));
        add('Quantity','எண்ணிக்கை',get('quantity'));add('Destination','விநியோக இடம்',get('destination'));
        add('Business type','வணிக வகை',get('business'));add('Email','மின்னஞ்சல்',get('email'));add('Requirements','கூடுதல் தேவைகள்',get('notes'));
      } else {
        add('Destination','விநியோக இடம்',get('market'));add('City / destination details','நகரம் / இட விவரங்கள்',get('destination_detail'));
        add('Quantity','எண்ணிக்கை',get('quantity'));add('Design / colour','வடிவம் / நிறம்',get('design'));
      }
      add('Preferred language','விருப்ப மொழி',isTamil?'Tamil':'English');
      const channel=e.submitter?.value==='email'?'email':'whatsapp';
      const body=lines.join('\n');
      const target=channel==='email'?'mailto:svmuralicenterton@gmail.com?subject='+encodeURIComponent('Wholesale lungi enquiry')+'&body='+encodeURIComponent(body):'https://wa.me/14793201970?text='+encodeURIComponent(body);
      // Navigate in the current tab: works without popup permissions; Back retains the form.
      const status=form.querySelector('.enquiry-status');
      status.textContent=isTamil?'உங்கள் செயலியில் செய்தியைப் பார்த்து அனுப்புங்கள்.':'Review and send the message in your app.';
      const retry=document.createElement('a');retry.href=target;retry.textContent=isTamil?' செயலியைத் திறக்க':' Open contact app';status.append(retry);
      emit(channel);location.href=target;
    });
  });
})();
