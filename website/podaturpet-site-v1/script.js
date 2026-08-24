const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

document.getElementById('year').textContent = new Date().getFullYear();

const input = document.getElementById('siteSearch');
const searchBtn = document.getElementById('searchBtn');
const cards = [...document.querySelectorAll('.category-card')];
const noResults = document.getElementById('noResults');

function runSearch(term) {
  const q = (term || '').trim().toLowerCase();
  let visible = 0;
  cards.forEach(card => {
    const hay = (card.dataset.tags + ' ' + card.textContent).toLowerCase();
    const match = !q || hay.includes(q);
    card.classList.toggle('hidden', !match);
    if (match) visible++;
  });
  noResults.classList.toggle('show', visible === 0);
  document.getElementById('categories').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

searchBtn.addEventListener('click', () => runSearch(input.value));
input.addEventListener('keydown', e => {
  if (e.key === 'Enter') runSearch(input.value);
});

document.querySelectorAll('[data-search]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    input.value = link.dataset.search;
    runSearch(link.dataset.search);
  });
});

const toast = document.getElementById('toast');
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

document.getElementById('businessForm').addEventListener('submit', e => {
  e.preventDefault();
  const data = new FormData(e.currentTarget);
  const text = [
    'Podaturpet.com Listing Request',
    '',
    `Business: ${data.get('business')}`,
    `Category: ${data.get('category')}`,
    `Phone: ${data.get('phone')}`,
    `Details: ${data.get('details') || '-'}`,
  ].join('\n');

  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Listing request copied. Paste it into WhatsApp or email.');
    }).catch(() => showToast('Listing request prepared.'));
  } else {
    showToast('Listing request prepared.');
  }
});

const urlParams = new URLSearchParams(window.location.search);
const q = urlParams.get('q');
if (q) {
  input.value = q;
  setTimeout(() => runSearch(q), 150);
}
