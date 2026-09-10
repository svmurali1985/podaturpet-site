(() => {
'use strict';
const form = document.getElementById('market-enquiry');
if (!form) return;
const select = form.elements.market;
const requested = new URLSearchParams(location.search).get('market');
if (requested && requested.length <= 100) {
  let option = Array.from(select.options).find(item => item.value === requested);
  if (!option) { option = new Option(requested, requested); select.add(option); }
  select.value = requested;
}
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const message = ['Hello Podaturpet team, I would like a wholesale lungi quotation.',
    'Destination: ' + select.value, 'Quantity: ' + form.elements.quantity.value.trim(),
    'Design / colour: ' + form.elements.design.value.trim()].join('\n');
  window.open('https://wa.me/14793201970?text=' + encodeURIComponent(message), '_blank', 'noopener,noreferrer');
});
})();
