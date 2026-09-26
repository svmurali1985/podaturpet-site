(() => {
  'use strict';
  const controls = document.querySelector('.discovery-controls');
  if (!controls) return;
  const search = document.getElementById('destination-search');
  const kind = document.getElementById('destination-kind');
  const cards = [...document.querySelectorAll('[data-destination]')];
  const index = cards.map(card => ({card, text: [...card.querySelectorAll('[data-site-en]')].map(el => el.dataset.siteEn + ' ' + el.dataset.siteTa).join(' ').toLocaleLowerCase()}));
  function update() {
    const query = search.value.trim().toLocaleLowerCase();
    let count = 0;
    index.forEach(({card, text}) => {
      const match = (!query || text.includes(query)) && (kind.value === 'all' || card.dataset.kind.split(' ').includes(kind.value));
      card.hidden = !match;
      if (match) count++;
    });
    const tamil = document.documentElement.lang.startsWith('ta');
    document.getElementById('destination-count').textContent = tamil ? `${cards.length} இடங்களில் ${count} காட்டப்படுகின்றன` : `${count} of ${cards.length} places shown`;
    document.getElementById('destination-empty').hidden = count !== 0;
  }
  search.addEventListener('input', update);
  kind.addEventListener('change', update);
  document.getElementById('destination-reset').addEventListener('click', () => { search.value = ''; kind.value = 'all'; update(); search.focus(); });
  document.addEventListener('podaturpet:language', update);
  function revealHash() {
    const target = document.getElementById(location.hash.slice(1));
    if (!target || !target.matches('[data-destination]')) return;
    if (target.hidden) { search.value = ''; kind.value = 'all'; update(); }
  }
  window.addEventListener('hashchange', revealHash);
  controls.hidden = false;
  update();
  revealHash();
})();
