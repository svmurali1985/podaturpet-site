"""Original shared presentation layer for existing pages; no network or dependencies."""
from pathlib import Path
import html,json,re
ROOT=Path(__file__).resolve().parents[1]
AREAS=[(a['key'],a['en'],a['ta'],a['url']) for a in json.loads((ROOT/'content/site.json').read_text())['areas']]
def word(en,ta):return '<span data-site-en="'+html.escape(en,quote=True)+'" data-site-ta="'+html.escape(ta,quote=True)+'">'+html.escape(en)+'</span>'
def area(page):
 if page=='index.html':return 'home'
 if page.startswith('people-information') or page=='us-india-family-travel-planner.html':return 'people'
 if page=='podaturpet-local-business-directory.html':return 'services'
 if page in ['advertise-on-podaturpet.html','business-website-development.html','free-invoice.html']:return 'advertise'
 if 'lungi' in page or page in ['podaturpet-weaving-textiles.html','podaturpet-textile-supplier-enquiry.html']:return 'textiles'
 if page=='privacy-policy.html':return 'privacy'
 return 'local'
def localized(markup,page):
 if not page.endswith('-ta.html'):return markup
 return re.sub(r'(<span data-site-en="[^"]*" data-site-ta="([^"]*)")>[^<]*</span>',lambda m:m[1]+' lang="ta">'+html.escape(html.unescape(m[2]))+'</span>',markup)
def header(page,controls=''):
 active=area(page)
 links=''.join('<a href="'+(url.replace('.html','-ta.html') if key=='people' and page.endswith('-ta.html') else url)+'"'+(' aria-current="page"' if page==url[1:] or key=='people' and page.endswith('-ta.html') else ' data-section-current="true"' if key==active else '')+'>'+word(en,ta)+'</a>' for key,en,ta,url in AREAS)
 if not controls:controls='<div class="site-language" aria-label="Language / மொழி"><button type="button" data-site-language="en" aria-pressed="true">English</button><button type="button" data-site-language="ta" lang="ta" aria-pressed="false">தமிழ்</button></div>'
 markup='<div class="site-header-row"><a class="site-brand" href="/" aria-label="Podaturpet home"><img src="/images/podaturpet-emblem.svg" width="38" height="38" alt=""><span>PODATURPET<small>'+word('People. Places. Possibilities.','மக்கள். ஊர். வாய்ப்புகள்.')+'</small></span></a><button class="site-menu-toggle" type="button" aria-expanded="false" aria-controls="site-main-nav" hidden>'+word('Menu','பட்டியல்')+' <span aria-hidden="true">☰</span></button><nav id="site-main-nav" aria-label="Main navigation">'+links+'</nav><div class="site-utilities">'+controls+'</div></div>'
 return localized(markup,page)
def footer(page):
 site=json.loads((ROOT/'content/site.json').read_text());links=''.join('<a href="'+url+'">'+word(en,ta)+'</a>' for _,en,ta,url in AREAS)
 markup='<div class="site-footer-inner"><div class="site-footer-intro"><a class="site-brand" href="/">PODATURPET</a><p>'+word('Rooted in Tamil Nadu. Open to the world.','தமிழ்நாட்டில் வேரூன்றி, உலகுடன் இணைகிறோம்.')+'</p></div><nav aria-label="Explore Podaturpet">'+links+'</nav><nav aria-label="Tools and contact"><a href="/free-invoice.html">'+word('Invoice maker · 3 trial exports','இன்வாய்ஸ் · 3 இலவச முயற்சிகள்')+'</a><a href="/us-india-family-travel-planner.html">'+word('Free family travel planner','இலவச குடும்பப் பயணத் திட்டம்')+'</a><a href="/business-website-development.html">'+word('Website development','இணையதள உருவாக்கம்')+'</a><a href="/#contact">'+word('Contact the team','குழுவைத் தொடர்புகொள்ள')+'</a><a href="/privacy-policy.html">'+word('Privacy & visitor tracking','தனியுரிமை · வருகைப் புள்ளிவிவரங்கள்')+'</a></nav><div class="site-footer-bottom"><span>© <span id="year"></span> Podaturpet.com</span><span class="mr-footer-credit"><img src="/images/muraraj-mr-logo.svg" width="28" height="28" alt="" loading="lazy">Developed &amp; Maintained by <strong>MuraRaj Technologies</strong></span></div></div>'
 return localized(markup,page)
def apply_layout(text,page):
 if re.search(r'<meta[^>]+http-equiv=["\']refresh',text,re.I):return text
 # Existing native app language/font-size controls remain functional in the shared header.
 if 'data-site-shell="true"' not in text:
  h=re.search(r'<header\b[^>]*>.*?</header>',text,re.S)
  controls=''
  if h:
   raw=h.group()
   if page.startswith('people-information'):
    m=re.search(r'<nav\b.*?</nav>',raw,re.S);controls=m.group() if m else ''
   elif page=='us-india-family-travel-planner.html':
    m=re.search(r'<div class="top-actions">(.*)</div>\s*</header>',raw,re.S);controls=m.group(1) if m else ''
   replacement='<header class="pt-site-header" data-site-shell="true"><!-- PT:shared:header:START -->'+header(page,controls)+'<!-- PT:shared:header:END --></header>'
   text=text[:h.start()]+replacement+text[h.end():]
  text=re.sub(r'<div class="mr-top-credit".*?</div>','',text,flags=re.S)
  # Merge repeated footer navigation/contacts/credits, retaining the existing counter insertion target.
  f=re.search(r'<footer\b[^>]*>.*?</footer>',text,re.S)
  replacement='<footer class="site-footer" data-site-footer="true"><!-- PT:shared:footer:START -->'+footer(page)+'<!-- PT:shared:footer:END --></footer>'
  if f:text=text[:f.start()]+replacement+text[f.end():]
  else:text=text.replace('</body>',replacement+'</body>')
  text=re.sub(r'(<body\b[^>]*)(>)',r'\1 data-site-area="'+area(page)+r'"\2',text,count=1)
 # Put the existing shared presentation stylesheet last; no new CSS stack/file.
 text=re.sub(r'<link\b[^>]*href=["\'][^"\']*podaturpet-colourful\.css[^"\']*["\'][^>]*>\s*','',text)
 text=re.sub(r'\s*</head>', '</head>', text)
 text=text.replace('</head>','<link rel="stylesheet" href="/podaturpet-colourful.css?v=20260919-reorg">\n</head>')
 text=re.sub(r'<script\b[^>]*src=["\'][^"\']*podaturpet-editorial\.js[^"\']*["\'][^>]*>\s*</script>','',text)
 text=re.sub(r'\s*</body>', '</body>', text)
 text=text.replace('</body>','<script src="/podaturpet-editorial.js?v=20260919-reorg" defer></script>\n</body>')
 # One skip link; preserve the existing real target (each native tool differs).
 matches=list(re.finditer(r'<a\b[^>]*class="(?:pt-skip|skip-to-content|skip)"[^>]*>.*?</a>',text,re.S))
 for m in reversed(matches[1:]):text=text[:m.start()]+text[m.end():]
 if not matches:
  main=re.search(r'<main\b([^>]*)>',text);mid=re.search(r'\bid="([^"]+)"',main[1]) if main else None
  target=mid[1] if mid else 'site-main'
  if main and not mid:text=text[:main.start()]+main[0][:-1]+' id="site-main">'+text[main.end():]
  text=re.sub(r'(<body\b[^>]*>)',r'\1<a class="pt-skip" href="#'+target+'">Skip to main content</a>',text,count=1)
 return text
