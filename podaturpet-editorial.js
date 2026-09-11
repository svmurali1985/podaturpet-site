(() => {
  'use strict';
  if (document.body.classList.contains('studio-home')) {
    const bar = document.querySelector('.pt-language-options');
    const header = document.querySelector('.pt-site-header');
    if (bar && header) {
      const strip = document.createElement('div');strip.className='showcase-language-strip';
      const label = document.createElement('span');label.className='showcase-header-note';label.textContent='Lungi wholesale · Town & culture';strip.append(label);
      const more = document.createElement('details');more.className='showcase-more-languages';
      const summary = document.createElement('summary');summary.textContent='More languages';more.append(summary);
      const panel = document.createElement('div');panel.className='showcase-language-panel';
      [...bar.children].forEach(child => {if(child.tagName !== 'BUTTON') panel.append(child);});
      more.append(panel);bar.append(more);strip.append(bar);header.append(strip);
      const emptyWrap = document.querySelector('.buyer-language-wrap');if(emptyWrap && !emptyWrap.textContent.trim()) emptyWrap.remove();
      more.addEventListener('keydown',event=>{if(event.key==='Escape'){more.open=false;summary.focus();}});
      document.addEventListener('pointerdown',event=>{if(!more.contains(event.target))more.open=false;});
    }
  }

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
