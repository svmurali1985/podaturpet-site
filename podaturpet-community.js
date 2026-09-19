(() => {
  'use strict';
  // Global service search extends the existing directory; all provider facts are pre-reviewed.
  (function initMarketplace(){
    const root=document.getElementById('service-marketplace'),D=window.PodaturpetServicesData,C=window.PeopleHubCore;if(!root||!D||!C)return;
    const $=id=>document.getElementById(id),form=$('market-search'),contact=$('market-contact-form');let lang='ta',U=D.ui.ta,selected=null,requestRef='',sent=false,lastButton=null;
    const cards=new Map([...root.querySelectorAll('[data-provider]')].map(c=>[c.dataset.provider,c]));
    const emit=stage=>document.dispatchEvent(new CustomEvent('podaturpet:market-event',{detail:{stage}}));
    const filters=()=>Object.fromEntries(new FormData(form));
    const info=(text)=>{$('market-status').textContent=text;};
    function revoke(){requestRef='';sent=false;$('market-preview').hidden=true;$('market-message').textContent='';$('market-reference').textContent='';$('market-handoff').removeAttribute('href');$('market-contact-status').textContent='';}
    function cancel(){revoke();contact.reset();selected=null;$('market-contact').hidden=true;if(lastButton&&lastButton.isConnected)lastButton.focus();}
    function changeLanguage(next){lang=next;U=D.ui[lang];root.lang=lang;for(const n of root.querySelectorAll('[data-mkey]'))n.textContent=U[n.dataset.mkey]||n.dataset.mkey;
      for(const b of root.querySelectorAll('[data-market-language]'))b.setAttribute('aria-pressed',String(b.dataset.marketLanguage===lang));
      for(const s of D.services){const opt=[...form.elements.service.options].find(o=>o.value===s.id);if(opt)opt.textContent=s.name[lang]+(s.launch?'':' · '+(lang==='ta'?'பிறகு':'later'));}
      let names;try{names=new Intl.DisplayNames([lang==='ta'?'ta':'en'],{type:'region'});}catch(_){}
      for(const o of form.elements.country.options)if(o.value)o.textContent=(names?names.of(o.value):o.value)+' · '+o.value;
      for(const o of form.elements.language.options)if(o.value)o.textContent=D.languages[o.value][lang];
      root.querySelectorAll('[data-provider-lang]').forEach(n=>n.hidden=n.dataset.providerLang!==lang);
      D.providers.forEach(p=>{const n=root.querySelector('[data-provider-price="'+p.id+'"]');if(n)n.textContent=C.marketPrice(p,lang,U);});
      $('market-team-help').href='/people-information-hub'+(lang==='ta'?'-ta':'')+'.html#life-help';
      cancel();showOfficials();document.dispatchEvent(new CustomEvent('podaturpet:market-language',{detail:{lang}}));
    }
    function showOfficials(){const f=filters(),list=$('market-official-links');list.replaceChildren();const refs=C.marketRegisters(f.service,f.country,f.region,D);
      for(const ref of refs){const li=document.createElement('li'),a=document.createElement('a');a.textContent=ref.name+' ↗';a.href=ref.url;a.target='_blank';a.rel='noopener noreferrer';li.append(a,document.createTextNode(' · '+U.checked+': '+ref.reviewed+(C.reviewState(ref.reviewed)==='old'?' · '+U.stale:'')));list.append(li);}
      if(!refs.length){const li=document.createElement('li'),a=document.createElement('a');a.textContent=U.information;a.href='/people-information-hub'+(lang==='ta'?'-ta':'')+'.html';li.append(a);list.append(li);}
    }
    function search(e){if(e)e.preventDefault();cancel();const f=filters();
      if(C.privateText(f.city)||/\d|@|https?:|\b(?:street|apt|apartment)\b/i.test(f.city)||C.privateText(f.region)){info(U.privateError);return;}
      if(!f.service||!f.country||f.mode==='local'&&!f.city.trim()){info(U.choose);return;}
      const service=D.services.find(s=>s.id===f.service);if(!service){info(U.choose);return;}
      const matches=C.marketMatch(D.providers,f,D);for(const [id,card] of cards)card.hidden=!matches.some(p=>p.id===id);
      $('market-empty').hidden=matches.length>0;$('market-empty-help').hidden=matches.length>0;
      $('market-empty').textContent=service.launch?U.noMatches:U.notOpen;
      info(matches.length+' '+U.results);showOfficials();emit('market_search');
    }
    form.addEventListener('submit',search);
    form.addEventListener('change',()=>{cancel();info('');for(const c of cards.values())c.hidden=true;$('market-empty').hidden=true;$('market-empty-help').hidden=true;showOfficials();});
    form.addEventListener('input',()=>{cancel();info('');});
    $('market-ask').addEventListener('submit',e=>{e.preventDefault();cancel();const q=$('market-question').value;const parsed=C.marketParse(q,D);
      if(parsed.sensitive){$('market-question').value='';$('market-understood').textContent=U.privateError;return;}
      info('');$('market-empty').hidden=true;$('market-empty-help').hidden=true;
      // Never carry an earlier person's location or language into a newly parsed request.
      form.reset();for(const key of ['service','country','region','city','language','mode'])form.elements[key].value=parsed[key];
      for(const c of cards.values())c.hidden=true;
      $('market-understood').textContent=(parsed.information?U.information+' ':'')+(parsed.service?U.recognized:U.unknown);
      if(parsed.alternatives.length>1)$('market-understood').textContent+=' '+parsed.alternatives.map(id=>D.services.find(s=>s.id===id).name[lang]).join(' / ');
      showOfficials();form.elements.country.focus();
    });
    $('market-clear').addEventListener('click',()=>{cancel();form.reset();$('market-question').value='';$('market-understood').textContent='';info('');for(const c of cards.values())c.hidden=true;$('market-empty').hidden=false;$('market-empty').textContent=U.noMatches;$('market-empty-help').hidden=false;showOfficials();});
    for(const b of root.querySelectorAll('[data-market-language]'))b.addEventListener('click',()=>changeLanguage(b.dataset.marketLanguage));
    root.querySelectorAll('[data-provider-profile]').forEach(el=>el.addEventListener('toggle',()=>{if(el.open)emit('market_profile');}));
    root.querySelectorAll('[data-provider-contact]').forEach(b=>b.addEventListener('click',()=>{
      cancel();const p=D.providers.find(p=>p.id===b.dataset.providerContact);if(!C.marketCurrent(p)){info(U.expired);return;}
      selected=p;lastButton=b;$('market-recipient').textContent=p.name;$('market-channel').replaceChildren();
      for(const key of ['whatsapp','phone','website'])if(p.contact[key]){const o=document.createElement('option');o.value=key;o.textContent=U[key];$('market-channel').append(o);}
      $('market-note').disabled=$('market-channel').value!=='whatsapp';$('market-contact').hidden=false;$('market-contact').focus();
    }));
    contact.addEventListener('input',revoke);contact.addEventListener('change',()=>{revoke();$('market-note').disabled=$('market-channel').value!=='whatsapp';});
    contact.addEventListener('submit',e=>{e.preventDefault();revoke();if(!selected||!C.marketCurrent(selected)){cancel();info(U.expired);return;}
      const v=Object.fromEntries(new FormData(contact));
      if(v.consent!=='on'||!contact.checkValidity()||C.privateText(v.note||'')){ $('market-contact-status').textContent=U.consentError;return;}
      const channel=v.channel;if(!['whatsapp','phone','website'].includes(channel)||!selected.contact[channel])return;
      const f=filters(),service=D.services.find(s=>s.id===f.service);let message=U.recipient+': '+selected.name+'\n'+U.channel+': '+U[channel],href='';
      if(channel==='whatsapp'){
        if(!window.crypto||!window.crypto.getRandomValues){$('market-contact-status').textContent=U.consentError;return;}
        const random=new Uint8Array(8);crypto.getRandomValues(random);requestRef='PS-'+[...random].map(n=>n.toString(16).padStart(2,'0')).join('').toUpperCase();
        message+='\n'+U.reference+': '+requestRef+'\n'+U.service+': '+(service?service.name[lang]:selected.services.map(id=>D.services.find(s=>s.id===id).name[lang]).join(', '));
        if(f.country)message+='\n'+f.country+(f.region?' / '+f.region:'')+(f.city?' / '+f.city:'');
        if(f.language)message+='\n'+U.language+': '+D.languages[f.language][lang];
        if(v.note&&v.note.trim())message+='\n'+v.note.trim();
        message+='\n\n'+U.consent;href='https://wa.me/'+selected.contact.whatsapp.slice(1)+'?text='+encodeURIComponent(message);
        $('market-reference').textContent=U.reference+': '+requestRef;
      }else href=channel==='phone'?'tel:'+selected.contact.phone:selected.contact.website;
      $('market-message').textContent=message;$('market-handoff').href=href;$('market-preview').hidden=false;
      if(channel==='whatsapp')emit('market_enquiry_prepared');
    });
    $('market-handoff').addEventListener('click',e=>{
      if(!selected||!C.marketCurrent(selected)||!contact.elements.consent.checked||!$('market-handoff').hasAttribute('href')){e.preventDefault();revoke();return;}
      if(!sent){emit('market_contact');if(requestRef)emit('market_enquiry_handoff');sent=true;}
    });
    $('market-cancel').addEventListener('click',cancel);
    function hash(){const raw=location.hash.slice(1);if(raw.startsWith('service-')){const id=raw.slice(8);if(D.services.some(s=>s.id===id)){form.elements.service.value=id;showOfficials();form.elements.country.focus();}}
      else if(raw.startsWith('provider-')){const p=D.providers.find(p=>'provider-'+p.id===raw);if(p&&C.marketCurrent(p)){const c=cards.get(p.id);c.hidden=false;const detail=$('provider-'+p.id);detail.open=true;detail.querySelector('summary').focus();}}
    }
    // Expiry checks run on every contact action and when a suspended browser tab returns.
    function expire(){D.providers.forEach(p=>{if(!C.marketCurrent(p)){const c=cards.get(p.id);c.hidden=true;}});if(selected&&!C.marketCurrent(selected)){cancel();info(U.expired);}}
    window.addEventListener('hashchange',hash);window.addEventListener('pageshow',expire);document.addEventListener('visibilitychange',()=>{if(!document.hidden)expire();});
    window.addEventListener('pagehide',()=>{cancel();$('market-question').value='';form.reset();});
    root.querySelectorAll('.market-js').forEach(n=>n.hidden=false);for(const c of cards.values())c.hidden=true;changeLanguage('ta');hash();expire();
  })();

  // Entries are reviewed and rendered into HTML before upload. Only expiry is dynamic.
  const now = Date.now();
  document.querySelectorAll('[data-pt-event]').forEach(card => {
    const end = Date.parse(card.dataset.end);
    card.hidden = !Number.isFinite(end) || end < now;
  });
  const events = document.querySelector('[data-pt-content="events"]');
  if (events) {
    const visible = [...events.querySelectorAll('[data-pt-event]')].filter(el => !el.hidden);
    const empty = events.querySelector('[data-events-empty]');
    if (empty) empty.hidden = visible.length > 0;
  }
  const form = document.getElementById('pt-contribution-form');
  if (form) {
    const type = form.elements.type;
    const requested = new URLSearchParams(location.search).get('contribute');
    if ([...type.options].some(o => o.value === requested)) type.value = requested;
    const sync = () => {
      const isEvent = type.value === 'event';
      const business=form.querySelector('[data-service-business]');if(business){const on=type.value==='business';business.hidden=!on;business.querySelectorAll('input').forEach(n=>{n.disabled=!on;n.required=on;});}
      const placeLabel=form.querySelector('label[for="pt-contribution-location"]');if(placeLabel)placeLabel.textContent=type.value==='business'?'City / region only — no home address / நகரம், பகுதி மட்டும்':'Place or address';

      form.querySelector('[data-event-fields]').hidden = !isEvent;
      ['date','organiser'].forEach(name => {form.elements[name].required = isEvent; form.elements[name].disabled = !isEvent;});
    };
    type.addEventListener('change', sync); sync();
    form.addEventListener('input', e => e.target.setCustomValidity?.(''));
    form.addEventListener('submit', e => {
      e.preventDefault();
      ['title','place','detail'].forEach(name => {
        const field = form.elements[name];
        field.setCustomValidity(field.value.trim() ? '' : 'Please enter a few details.');
      });
      if (!form.reportValidity()) return;
      const clean = value => String(value).replace(/[\u0000-\u0008\u000b-\u001f]/g,' ').trim();
      const lines = ['Podaturpet community contribution', 'Type: '+type.options[type.selectedIndex].text];
      for (const [name,label] of [['title','Title'],['place','Location'],['date','Event date'],['organiser','Organiser / public contact'],['service_country','Country'],['service_languages','Services / languages'],['service_contact','Authorized public business contact'],['detail','Details / source']]) {
        const field = form.elements[name];
        if (field && !field.disabled && field.value.trim()) lines.push(label+': '+clean(field.value));
      }
      if(type.value==='business'&&form.elements.service_owner)lines.push('I am authorized to request publication and verification of these business details.');
      lines.push('I have permission to share this information and any attached photos for publication.');
      const url = 'https://wa.me/'+form.dataset.whatsapp+'?text='+encodeURIComponent(lines.join('\n'));
      const status = document.getElementById('pt-contribution-status');
      status.textContent = 'Review the message in WhatsApp and attach any photos there. ';
      const retry = document.createElement('a');retry.href=url;retry.textContent='Open WhatsApp';status.append(retry);
      document.dispatchEvent(new CustomEvent('podaturpet:community-handoff',{detail:{type:type.value}}));
      location.assign(url);
    });
  }
  // Consolidated category filtering, including Tamil aliases.
  (function(){var search=document.getElementById('retail-search'),cards=Array.prototype.slice.call(document.querySelectorAll('.retail-card')),buttons=Array.prototype.slice.call(document.querySelectorAll('.retail-filter')),count=document.getElementById('retail-count'),empty=document.getElementById('retail-empty'),active='all';if(!search)return;function refresh(){var query=search.value.normalize('NFC').toLowerCase().trim(),visible=0;cards.forEach(function(card){var matchesCategory=active==='all'||card.getAttribute('data-category')===active,matchesSearch=!query||(card.getAttribute('data-search')+' '+card.textContent).normalize('NFC').toLowerCase().indexOf(query)!==-1,show=matchesCategory&&matchesSearch;card.hidden=!show;if(show)visible++;});count.textContent='Showing '+visible+' shop categor'+(visible===1?'y':'ies');empty.classList.toggle('is-visible',visible===0);}buttons.forEach(function(button){button.addEventListener('click',function(){active=button.getAttribute('data-filter');buttons.forEach(function(item){item.classList.toggle('is-active',item===button);item.setAttribute('aria-pressed',String(item===button));});refresh();});});search.addEventListener('input',refresh);refresh();})();
  const townSearch = document.getElementById('town-search');
  if (townSearch) {
    const status = document.createElement('p');status.id='pt-town-search-status';status.setAttribute('role','status');
    townSearch.insertAdjacentElement('afterend',status);
    townSearch.addEventListener('input', () => {
      const query = townSearch.value.trim().toLocaleLowerCase();
      let count = 0;
      document.querySelectorAll('[data-search-section]').forEach(section => {
        const match = !query || section.textContent.toLocaleLowerCase().includes(query);
        section.classList.toggle('is-filtered-out',!match);if(match)count++;
      });
      status.textContent = !query ? '' : count ? count+' matching sections' : 'No matching sections. Try another word or clear the search.';
    });
  }
  const businessSearch = document.getElementById('pt-business-search');
  if (businessSearch) {
    businessSearch.addEventListener('input', () => {
      const query = businessSearch.value.trim().toLocaleLowerCase();
      let count = 0;
      document.querySelectorAll('[data-business-record]').forEach(card => {
        card.hidden = !card.textContent.toLocaleLowerCase().includes(query);
        if (!card.hidden) count++;
      });
      document.getElementById('pt-business-count').textContent = count+' matching businesses';
    });
  }
})();
