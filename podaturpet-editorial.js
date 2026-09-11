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
