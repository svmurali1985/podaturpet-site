from pathlib import Path
from urllib.parse import urlparse,unquote
from lxml import html,etree
import json,re,subprocess,hashlib
R=Path(__file__).resolve().parents[2];errors=[];counts={'pages':0,'json_ld':0,'srcset_assets':0,'sitemap_urls':0}
for p in R.glob('*.html'):
 d=html.fromstring(p.read_bytes());counts['pages']+=1
 for s in d.xpath('//script[@type="application/ld+json"]'):
  try:json.loads(s.text or '');counts['json_ld']+=1
  except Exception:errors.append(str(p.name)+' invalid JSON-LD')
 for srcset in d.xpath('//*[@srcset]/@srcset'):
  for candidate in srcset.split(','):
   u=urlparse(candidate.strip().split()[0])
   if not u.netloc:
    asset=R/unquote(u.path.lstrip('/'));counts['srcset_assets']+=1
    if not asset.is_file():errors.append('missing '+str(asset))
 for el in d.xpath('//*[@data-site-en and @data-site-ta]'):
  if len(el):errors.append(p.name+' bilingual leaf has child elements')
for name in ['index.html','index-ta.html']:
 d=html.fromstring((R/name).read_bytes())
 assert len(d.xpath('//link[@rel="stylesheet"]'))==4
 assert len(d.xpath('//*[@id="official-highlights"]'))==1
 assert not d.xpath('//*[contains(concat(" ",normalize-space(@class)," ")," portal-topic ")]')
 assert len(d.xpath('//*[contains(@class,"review-resource-grid")]/article'))==3
 assert len(d.xpath('//img[@class="portal-cover-photo"]'))==1
 img=d.xpath('//img[@class="portal-cover-photo"]')[0];assert img.get('width')=='960' and img.get('height')=='539'
 assert len(d.xpath('//h1'))==1
service=html.fromstring((R/'business-website-development.html').read_bytes())
assert len(service.xpath('//h1'))==1
assert len(service.xpath('//*[contains(@class,"review-service-faq")]//details'))==4
assert '30000' not in (R/'podaturpet-feedback.js').read_text()
before=hashlib.sha256((R/'podaturpet-homepage.css').read_bytes()).hexdigest()
subprocess.run(['python3',str(R/'tools/build_home_styles.py')],check=True,capture_output=True)
assert hashlib.sha256((R/'podaturpet-homepage.css').read_bytes()).hexdigest()==before
ns={'s':'http://www.sitemaps.org/schemas/sitemap/0.9'}
for loc in etree.parse(str(R/'sitemap.xml')).xpath('//s:loc/text()',namespaces=ns):
 u=urlparse(loc);p=R/(u.path.lstrip('/') or 'index.html');counts['sitemap_urls']+=1
 if u.netloc!='podaturpet.com' or not p.is_file():errors.append('bad sitemap URL '+loc)
print(json.dumps({'counts':counts,'errors':errors},indent=2));assert not errors
