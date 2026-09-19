(() => {
  'use strict';
  // Keep deep links into collapsed reference sections accessible.
  function revealHash() {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch (_) { return; }
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    let parent = target.parentElement;
    let opened = false;
    while (parent) {
      if (parent.tagName === 'DETAILS' && !parent.open) {parent.open = true;opened = true;}
      parent = parent.parentElement;
    }
    if (opened) requestAnimationFrame(() => target.scrollIntoView({block:'start'}));
  }
  window.addEventListener('hashchange', revealHash);
  revealHash();
  const search = document.getElementById('town-search');
  if (search) {
    const previousState = new Map();
    search.addEventListener('input', () => {
      const query = search.value.trim().toLocaleLowerCase();
      document.querySelectorAll('.studio-fold').forEach(fold => {
        const section = fold.querySelector('[data-search-section]');
        if (!section) return;
        if (query) {
          if (!previousState.has(fold)) previousState.set(fold,fold.open);
          const matches = section.textContent.toLocaleLowerCase().includes(query);
          fold.hidden = !matches; fold.open = matches;
        } else {
          fold.hidden = false;
          if(previousState.has(fold)) fold.open = previousState.get(fold);
        }
      });
      if (!query) previousState.clear();
    });
  }
  document.querySelectorAll('details').forEach(details => {
    details.addEventListener('toggle', () => {
      if (!details.open) details.querySelectorAll('video').forEach(video => video.pause());
    });
  });
})();
/* Shared shell, extending the existing presentation controller. */
(() => {
 'use strict';
 const shell=document.querySelector('[data-site-shell]');if(!shell)return;
 const menu=shell.querySelector('.site-menu-toggle');
 shell.classList.add('site-enhanced');menu.hidden=false;
 const media=typeof matchMedia==='function'?matchMedia('(max-width:720px)'):null;
 const setMenu=open=>{shell.classList.toggle('site-menu-open',open);menu.setAttribute('aria-expanded',String(open));};
 menu.addEventListener('click',()=>setMenu(menu.getAttribute('aria-expanded')!=='true'));
 shell.addEventListener('keydown',e=>{if(e.key==='Escape'&&shell.classList.contains('site-menu-open')){setMenu(false);menu.focus();}});
 shell.querySelectorAll('#site-main-nav a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
 if(media){const reset=()=>{setMenu(false);menu.hidden=!media.matches;};media.addEventListener?media.addEventListener('change',reset):media.addListener(reset);reset();}
 function language(lang){
  lang=lang==='ta'?'ta':'en';document.body.dataset.siteLang=lang;
  document.querySelectorAll('[data-site-en][data-site-ta]').forEach(e=>{e.textContent=lang==='ta'?e.dataset.siteTa:e.dataset.siteEn;e.lang=lang;});
  shell.querySelectorAll('[data-site-language]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.siteLanguage===lang)));
  document.querySelectorAll('a[href^="/people-information-hub"]').forEach(a=>{if(a.hasAttribute('data-language'))return;const u=new URL(a.href,location.href);if(/^\/people-information-hub(?:-ta)?\.html$/.test(u.pathname)){u.pathname='/people-information-hub'+(lang==='ta'?'-ta':'')+'.html';a.setAttribute('href',u.pathname+u.search+u.hash);}});
 }
 shell.querySelectorAll('[data-site-language]').forEach(b=>b.addEventListener('click',()=>{
  const lang=b.dataset.siteLanguage;
  if(typeof window.PodaturpetSetLanguage==='function')window.PodaturpetSetLanguage(lang);
  else{language(lang);try{localStorage.setItem('podaturpet-intro-language',lang);}catch(_){}document.dispatchEvent(new CustomEvent('podaturpet:language',{detail:{language:lang}}));}
 }));
 document.addEventListener('podaturpet:language',e=>language(e.detail.language));
 let initial=document.documentElement.lang==='ta'?'ta':new URLSearchParams(location.search).get('lang');
 if(!initial)try{initial=localStorage.getItem('podaturpet-intro-language');}catch(_){}
 language(initial==='ta'?'ta':'en');
 new MutationObserver(()=>{if(!shell.querySelector('[data-site-language]'))language(document.documentElement.lang);}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();
})();
// Reuse the existing feedback trigger in the footer instead of a second floating tab.
(() => {
 const button=document.getElementById('pt-feedback-button'),footer=document.querySelector('.site-footer-inner');
 if(button&&footer){const slot=document.createElement('div');slot.className='site-feedback-slot';slot.append(button);footer.insertBefore(slot,footer.querySelector('.site-footer-bottom'));}
})();
