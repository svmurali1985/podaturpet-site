(() => {
  'use strict';
  const controls = document.querySelector('.local-controls');
  if (!controls) return;
  const search = document.getElementById('local-news-search');
  const category = document.getElementById('local-news-category');
  const cards = [...document.querySelectorAll('[data-local-news]')];
  // Date boundaries use Indian local dates, matching the district notices.
  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(new Date());
  const dayNumber = value => Date.parse(value + 'T00:00:00Z') / 86400000;
  function update() {
    const tamil = document.documentElement.lang.startsWith('ta');
    const query = search.value.trim().toLocaleLowerCase();
    let shown = 0;
    cards.forEach(card => {
      const text = [...card.querySelectorAll('[data-site-en]')]
        .map(el => el.dataset.siteEn + ' ' + el.dataset.siteTa).join(' ').toLocaleLowerCase();
      const match = (!query || text.includes(query)) &&
        (category.value === 'all' || category.value === card.dataset.category);
      card.hidden = !match;
      if (match) shown++;
      const expired = card.dataset.eventDate && today > card.dataset.eventDate;
      const older = dayNumber(today) - dayNumber(card.dataset.published) > 30;
      const status = card.querySelector('.local-news-status');
      status.textContent = expired
        ? (tamil ? 'நிகழ்வு தேதி கடந்துவிட்டது · பதிவுக்காகக் காட்டப்படுகிறது' : 'Event date passed · shown for reference')
        : older
          ? (tamil ? 'பழைய அறிவிப்பு · தற்போதைய தகவலுக்கு அதிகாரப்பூர்வ ஆதாரத்தைப் பாருங்கள்' : 'Older notice · check the official source for current information')
          : (tamil ? 'தேதியிட்ட அறிவிப்பு · மாற்றங்களுக்கு ஆதாரத்தைப் பார்க்கவும்' : 'Dated notice · check the source for changes');
    });
    document.getElementById('local-news-count').textContent = tamil
      ? `${cards.length} செய்திகளில் ${shown} காட்டப்படுகின்றன`
      : `${shown} of ${cards.length} updates shown`;
    document.getElementById('local-news-empty').hidden = shown !== 0;
  }
  search.addEventListener('input', update);
  category.addEventListener('change', update);
  document.getElementById('local-news-reset').addEventListener('click', () => {
    search.value = ''; category.value = 'all'; update(); search.focus();
  });
  document.addEventListener('podaturpet:language', update);
  controls.hidden = false;
  update();
})();
