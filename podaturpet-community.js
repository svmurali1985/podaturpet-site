(() => {
  'use strict';
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
      for (const [name,label] of [['title','Title'],['place','Location'],['date','Event date'],['organiser','Organiser / public contact'],['detail','Details / source']]) {
        const field = form.elements[name];
        if (!field.disabled && field.value.trim()) lines.push(label+': '+clean(field.value));
      }
      lines.push('I have permission to share this information and any attached photos for publication.');
      const url = 'https://wa.me/'+form.dataset.whatsapp+'?text='+encodeURIComponent(lines.join('\n'));
      const status = document.getElementById('pt-contribution-status');
      status.textContent = 'Review the message in WhatsApp and attach any photos there. ';
      const retry = document.createElement('a');retry.href=url;retry.textContent='Open WhatsApp';status.append(retry);
      document.dispatchEvent(new CustomEvent('podaturpet:community-handoff',{detail:{type:type.value}}));
      location.assign(url);
    });
  }
  document.querySelectorAll('.retail-filter').forEach(button => {
    button.addEventListener('click', () => document.querySelectorAll('.retail-filter').forEach(b => b.setAttribute('aria-pressed',String(b===button))));
  });
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
