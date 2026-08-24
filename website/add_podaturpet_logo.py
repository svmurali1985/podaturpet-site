#!/usr/bin/env python3
from pathlib import Path
import re

ROOT = Path('.')
INDEX = ROOT / 'index.html'
IMAGES = ROOT / 'images'

if not INDEX.exists():
    raise SystemExit('ERROR: Run this inside your website folder (index.html not found).')

IMAGES.mkdir(exist_ok=True)

svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 118" role="img" aria-labelledby="title desc">
  <title id="title">Podaturpet Lungi Weaving and Textile Hub</title>
  <desc id="desc">Original woven diamond emblem in navy and gold with Podaturpet wordmark.</desc>
  <defs>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f6cf67"/>
      <stop offset="1" stop-color="#d39a20"/>
    </linearGradient>
    <linearGradient id="navy" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0b3f6f"/>
      <stop offset="1" stop-color="#062645"/>
    </linearGradient>
  </defs>
  <g transform="translate(8 10)">
    <g transform="rotate(45 49 49)">
      <rect x="18" y="18" width="18" height="18" rx="3" fill="url(#gold)"/>
      <rect x="40" y="18" width="18" height="18" rx="3" fill="url(#navy)"/>
      <rect x="62" y="18" width="18" height="18" rx="3" fill="url(#gold)"/>
      <rect x="18" y="40" width="18" height="18" rx="3" fill="url(#navy)"/>
      <rect x="40" y="40" width="18" height="18" rx="3" fill="url(#gold)"/>
      <rect x="62" y="40" width="18" height="18" rx="3" fill="url(#navy)"/>
      <rect x="18" y="62" width="18" height="18" rx="3" fill="url(#gold)"/>
      <rect x="40" y="62" width="18" height="18" rx="3" fill="url(#navy)"/>
      <rect x="62" y="62" width="18" height="18" rx="3" fill="url(#gold)"/>
      <path d="M12 49H86M49 12V86" stroke="#f8e3a5" stroke-width="3" opacity=".85"/>
    </g>
  </g>
  <text x="118" y="49" fill="#f8faf9" font-family="Georgia, 'Times New Roman', serif" font-size="34" font-weight="700" letter-spacing="1">PODATURPET</text>
  <text x="120" y="74" fill="#e7bd57" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="700" letter-spacing="1.1">LUNGI WEAVING &amp; TEXTILE HUB</text>
  <text x="120" y="96" fill="#cfe0da" font-family="Arial, Helvetica, sans-serif" font-size="11.5" letter-spacing=".65">WOVEN TRUST • DELIVERED WORLDWIDE</text>
</svg>'''

logo_path = IMAGES / 'podaturpet-logo.svg'
logo_path.write_text(svg, encoding='utf-8')

# Homepage
html = INDEX.read_text(encoding='utf-8')

# Add logo image CSS once.
if '.site-logo-img{' not in html:
    marker = '    .brand-wrap{display:flex;align-items:center;gap:11px}'
    addition = '''    .brand-wrap{display:flex;align-items:center;gap:11px}\n    .site-logo-link{display:flex;align-items:center;min-width:0}\n    .site-logo-img{width:clamp(250px,29vw,390px);height:auto;max-height:62px;object-fit:contain;object-position:left center}\n'''
    html = html.replace(marker, addition, 1)

# Mobile logo sizing.
if '@media(max-width:760px)' in html and '.site-logo-img{width:220px' not in html:
    html = html.replace('@media(max-width:760px){', '@media(max-width:760px){.site-logo-img{width:220px;max-height:52px}', 1)

old_brand = re.compile(r'''\s*<div class="brand-wrap">\s*<span class="loom-mark"[^>]*></span>\s*<div class="brand-text">\s*<a class="logo" href="#top"[^>]*>PODATURPET<span>\.COM</span></a>\s*<span class="brand-tagline">Woven Trust</span>\s*</div>\s*</div>''', re.S)
new_brand = '''\n      <div class="brand-wrap">\n        <a class="site-logo-link" href="#top" aria-label="Podaturpet.com home">\n          <img class="site-logo-img" src="images/podaturpet-logo.svg" alt="Podaturpet Lungi Weaving and Textile Hub — Woven Trust">\n        </a>\n      </div>'''
html, brand_count = old_brand.subn(new_brand, html, count=1)

# Stronger buyer-facing hero line.
html = html.replace('''        <h1>\n          Podaturpet lungis.\n          <strong>Woven for the world.</strong>\n        </h1>''', '''        <h1>\n          Premium lungis from Podaturpet.\n          <strong>Woven for the world.</strong>\n        </h1>''', 1)

if 'class="brand-promise"' not in html:
    css_marker = '    .hero-copy{\n      margin-top:28px;max-width:700px;color:#d4e5df;\n      font-size:clamp(1rem,2vw,1.2rem)\n    }'
    css_add = css_marker + '''\n    .brand-promise{margin-top:14px;color:#f2cf72;font-weight:900;font-size:1rem;letter-spacing:.025em}'''
    html = html.replace(css_marker, css_add, 1)
    copy_end = '''          across India and international markets.\n        </p>'''
    promise = copy_end + '''\n        <p class="brand-promise">Tradition in every thread. Trust in every order.</p>'''
    html = html.replace(copy_end, promise, 1)

# Footer brand promise.
html = html.replace('Independent local business & information platform • Tamil Nadu, India', 'Woven with tradition. Delivered worldwide. • Tamil Nadu, India', 1)

INDEX.write_text(html, encoding='utf-8')

# Supporting pages: replace text-only logo with the visual logo and add responsive CSS.
updated_pages = 0
for p in ROOT.glob('*.html'):
    if p.name == 'index.html':
        continue
    text = p.read_text(encoding='utf-8')
    original = text
    if '<a class="logo" href="/">PODATURPET<span>.COM</span></a>' in text:
        text = text.replace('<a class="logo" href="/">PODATURPET<span>.COM</span></a>', '<a class="logo" href="/" aria-label="Podaturpet.com home"><img src="/images/podaturpet-logo.svg" alt="Podaturpet Lungi Weaving and Textile Hub — Woven Trust"></a>', 1)
        # Replace basic logo rule if present, otherwise append a rule before </style>.
        text = text.replace('.logo{font-weight:900}.logo span{color:var(--gold)}', '.logo{display:flex;align-items:center}.logo img{width:300px;max-width:58vw;height:auto;max-height:58px;object-fit:contain;object-position:left center}', 1)
        if '.logo img{' not in text:
            text = text.replace('</style>', '.logo{display:flex;align-items:center}.logo img{width:300px;max-width:58vw;height:auto;max-height:58px;object-fit:contain;object-position:left center}\n</style>', 1)

    if '<a class="brand" href="/">PODATURPET<span>.COM</span></a>' in text:
        text = text.replace('<a class="brand" href="/">PODATURPET<span>.COM</span></a>', '<a class="brand" href="/" aria-label="Podaturpet.com home"><img src="/images/podaturpet-logo.svg" alt="Podaturpet Lungi Weaving and Textile Hub — Woven Trust"></a>', 1)
        text = text.replace('.brand{font-weight:900}.brand span{color:var(--gold)}', '.brand{display:flex;align-items:center}.brand img{width:300px;max-width:58vw;height:auto;max-height:58px;object-fit:contain;object-position:left center}', 1)
        if '.brand img{' not in text:
            text = text.replace('</style>', '.brand{display:flex;align-items:center}.brand img{width:300px;max-width:58vw;height:auto;max-height:58px;object-fit:contain;object-position:left center}\n</style>', 1)
    if text != original:
        p.write_text(text, encoding='utf-8')
        updated_pages += 1

print('DONE: Original Podaturpet logo added.')
print(f'Homepage header updated: {brand_count == 1}')
print(f'Supporting pages updated: {updated_pages}')
print('Created: images/podaturpet-logo.svg')
print('Added buyer line: “Tradition in every thread. Trust in every order.”')
print('Next: git add -u images/podaturpet-logo.svg && git commit -m "Add Podaturpet woven logo and buyer branding" && git push')
