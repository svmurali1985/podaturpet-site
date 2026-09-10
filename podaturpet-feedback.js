(function () {
  'use strict';
  if (document.getElementById('pt-feedback')) return;
  const words = {
    en: {button:'Feedback', title:'Help us improve Podaturpet', intro:'Have a suggestion, local information to share, or a question? Tell us below.', type:'What would you like to share?', suggestion:'Suggest an improvement', information:'Share local information', correction:'Report incorrect information', question:'Ask a question', message:'Your message', placeholder:'Tell us what you need or what we could improve…', send:'Send on WhatsApp', note:'WhatsApp opens with your message and this page’s address. Review it and tap Send there. Nothing is sent automatically.', close:'Close feedback', empty:'Please enter a message.', language:'தமிழ்'},
    ta: {button:'கருத்து', title:'பொதட்டூர்பேட்டை தளத்தை மேம்படுத்த உதவுங்கள்', intro:'ஆலோசனை, ஊர்த் தகவல் அல்லது கேள்வி உள்ளதா? கீழே எழுதுங்கள்.', type:'எதைப் பகிர விரும்புகிறீர்கள்?', suggestion:'மேம்பாட்டை பரிந்துரைக்க', information:'உள்ளூர் தகவலைப் பகிர', correction:'தவறான தகவலைத் தெரிவிக்க', question:'கேள்வி கேட்க', message:'உங்கள் செய்தி', placeholder:'உங்களுக்கு என்ன தேவை அல்லது எதை மேம்படுத்தலாம் என்று எழுதுங்கள்…', send:'வாட்ஸ்அப்பில் அனுப்ப', note:'உங்கள் செய்தியும் இந்தப் பக்க முகவரியும் வாட்ஸ்அப்பில் திறக்கும். சரிபார்த்து அங்கே Send அழுத்துங்கள். தானாக அனுப்பப்படாது.', close:'கருத்துப் பெட்டியை மூட', empty:'உங்கள் செய்தியை எழுதுங்கள்.', language:'English'}
  };
  const launcher = document.createElement('button');
  launcher.id='pt-feedback-button'; launcher.type='button'; launcher.setAttribute('aria-controls','pt-feedback'); launcher.setAttribute('aria-expanded','false');
  const dialog=document.createElement('dialog'); dialog.id='pt-feedback'; dialog.setAttribute('aria-labelledby','pt-feedback-title');
  dialog.innerHTML='<div class="pt-feedback-top"><button type="button" data-language></button><button type="button" data-close>×</button></div><h2 id="pt-feedback-title" data-text="title"></h2><p data-text="intro"></p><form><label for="pt-feedback-type" data-text="type"></label><select id="pt-feedback-type"><option value="suggestion" data-text="suggestion"></option><option value="information" data-text="information"></option><option value="correction" data-text="correction"></option><option value="question" data-text="question"></option></select><label for="pt-feedback-message" data-text="message"></label><textarea id="pt-feedback-message" rows="4" maxlength="1500" required aria-describedby="pt-feedback-note"></textarea><p id="pt-feedback-note" data-text="note"></p><button type="submit" data-text="send"></button></form>';
  document.body.append(launcher,dialog);
  const input=dialog.querySelector('textarea');
  let language=document.documentElement.dataset.buyerLanguage==='ta'?'ta':'en';
  let restoreFocus=null, autoShown=false;
  function translate(value) {
    language=value==='ta'?'ta':'en'; const w=words[language]; dialog.lang=language; launcher.lang=language;
    launcher.textContent=w.button;
    dialog.querySelectorAll('[data-text]').forEach(el=>el.textContent=w[el.dataset.text]);
    dialog.querySelector('[data-close]').setAttribute('aria-label',w.close);
    dialog.querySelector('[data-language]').textContent=w.language;
    input.placeholder=w.placeholder;input.setCustomValidity('');
  }
  function seen(){autoShown=true;try{sessionStorage.setItem('pt-feedback-seen','1');}catch(_) {}}
  function open(manual) {
    if(dialog.open)return;
    restoreFocus=manual?document.activeElement:null;
    if(manual)dialog.showModal();else dialog.show();
    launcher.setAttribute('aria-expanded','true');seen();
    if(manual)input.focus();
  }
  function close(){dialog.close();}
  dialog.addEventListener('close',()=>{launcher.setAttribute('aria-expanded','false');if(restoreFocus&&restoreFocus.isConnected)restoreFocus.focus();restoreFocus=null;});
  launcher.addEventListener('click',()=>{if(dialog.open)close();else open(true);});
  dialog.querySelector('[data-close]').addEventListener('click',close);
  dialog.querySelector('[data-language]').addEventListener('click',()=>translate(language==='en'?'ta':'en'));
  document.addEventListener('podaturpet:language',event=>translate(event.detail.language));
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&dialog.open)close();});
  input.addEventListener('input',()=>input.setCustomValidity(''));
  dialog.querySelector('form').addEventListener('submit',event=>{
    event.preventDefault();const message=input.value.trim();
    if(!message){input.setCustomValidity(words[language].empty);input.reportValidity();return;}
    const type=dialog.querySelector('select').value;
    // Only the public page path is shared; query parameters and fragments are omitted.
    const page='https://podaturpet.com'+location.pathname;
    const text='Podaturpet website feedback\nType: '+words.en[type]+'\nPage: '+page+'\n\n'+message;
    seen();window.location.assign('https://wa.me/14793201970?text='+encodeURIComponent(text));
  });
  translate(language);
  try{autoShown=sessionStorage.getItem('pt-feedback-seen')==='1';}catch(_){}
  // Offer once per tab session. Do not interrupt typing, another dialog or hidden tabs.
  let attempts=0;
  function offer(){
    if(autoShown||dialog.open)return;
    const active=document.activeElement;
    const busy=document.hidden||(active&&active.matches('input,textarea,select,[contenteditable="true"]'))||document.querySelector('dialog[open], [aria-modal="true"], .pta-open');
    if(busy){if(++attempts<12)setTimeout(offer,10000);return;}
    const previous=document.activeElement;open(false);
    // Native non-modal dialogs can move focus; return it for an unsolicited invitation.
    if(previous&&previous.isConnected)previous.focus({preventScroll:true});
  }
  setTimeout(offer,25000);
})();
