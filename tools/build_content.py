#!/usr/bin/env python3
"""Refresh static navigation, contacts, reviewed listings and specifications. Standard library only."""
from pathlib import Path
import json,re,html
from urllib.parse import quote,urlparse
from datetime import datetime,date,timezone
R=Path(__file__).resolve().parents[1]
def read(n):return json.loads((R/'content'/n).read_text())
def esc(s):return html.escape(str(s),quote=True)
def safe_url(s):
 if urlparse(s).scheme!='https':raise ValueError('Source and map links must use HTTPS')
 return esc(s)
site=read('site.json');products=read('products.json');businesses=read('businesses.json');events=read('events.json')
if not re.fullmatch(r'\d{8,15}',site['whatsapp']):raise ValueError('WhatsApp must contain digits including country code')
def header(page):
 links=''.join('<a href="'+esc(url)+'"'+(' aria-current="page"' if (url=='/' and page=='index.html') or url=='/'+page else '')+'>'+esc(label)+'</a>' for label,url in site['navigation'])
 return '<div class="pt-header-inner"><a class="pt-brand" href="/" aria-label="Podaturpet home"><img src="/images/podaturpet-emblem.svg" alt="" width="44" height="44"><strong>'+esc(site['name'])+'</strong></a><nav class="pt-nav" aria-label="Main navigation">'+links+'</nav></div>'
def contact():
 return '<div class="pt-shared-contact" aria-label="Wholesale contact"><span>Wholesale enquiries</span><a href="tel:+'+esc(site['whatsapp'])+'">'+esc(site['phone'])+'</a><a href="https://wa.me/'+esc(site['whatsapp'])+'">WhatsApp</a><a href="mailto:'+esc(site['email'])+'">Email the team</a></div>'
def product(code,compact):
 v=products[code];rows=[('Design reference',code),('Photographed colours',v['colours']),('Pattern',v['pattern'])]
 for key,label in [('fabric','Fabric'),('dimensions','Finished size'),('minimum_order','Minimum order'),('packing','Packing'),('samples','Samples'),('lead_time','Dispatch estimate')]:
  val=v.get(key)
  if val and not v.get('verified_on'):raise ValueError(code+': date required for confirmed specifications')
  rows.append((label,val or 'Ask for confirmation'))
 table='<div class="pt-table-wrap"><table class="pt-specs"><caption>'+esc(v['name'])+'</caption><tbody>'+''.join('<tr><th scope="row">'+esc(a)+'</th><td>'+esc(b)+'</td></tr>' for a,b in rows)+'</tbody></table></div>'
 title='<summary>View specifications</summary>' if compact else '<h2>Product specifications</h2>'
 return title+table+'<p>Photographs identify the design. Confirm the sample and written order details before purchase.</p><a class="pt-button" href="/?product='+quote(code)+'#quick-quote">Ask about this design</a>'
def business_content():
 approved=[b for b in businesses if b.get('approved') is True]
 cards=[]
 for b in approved:
  for k in ['name','category','address','public_phone','hours','verified_on','source_url','map_url']:
   if not b.get(k):raise ValueError('Business requires '+k)
  date.fromisoformat(b['verified_on'])
  phone=re.sub(r'[^+\d]','',b['public_phone'])
  if not re.fullmatch(r'\+?\d{8,15}',phone):raise ValueError('Invalid business phone')
  cards.append('<article class="pt-card" data-business-record><h3>'+esc(b['name'])+'</h3><p>'+esc(b['category'])+'<br>'+esc(b['address'])+'</p><p>Hours: '+esc(b['hours'])+'<br>Last checked: '+esc(b['verified_on'])+'</p><a href="tel:'+esc(phone)+'">'+esc(b['public_phone'])+'</a> · <a data-track="directions_click" href="'+safe_url(b['map_url'])+'" target="_blank" rel="noopener noreferrer">Directions</a> · <a href="'+safe_url(b['source_url'])+'" target="_blank" rel="noopener noreferrer">Source</a></article>')
 if not cards:return '<p class="pt-empty">Business listings are being collected. Browse the service categories below, or send your shop details for review.</p>'
 return '<label for="pt-business-search">Search listed businesses</label><input class="retail-search" id="pt-business-search" type="search" placeholder="Name, category or address"><p id="pt-business-count" role="status">'+str(len(cards))+' businesses</p><div class="pt-grid">'+''.join(cards)+'</div>'
def event_content():
 cards=[]
 for e in events:
  if e.get('approved') is not True:continue
  for k in ['title','start','end','location','organiser','source_url','verified_on']:
   if not e.get(k):raise ValueError('Event requires '+k)
  start=datetime.fromisoformat(e['start']);end=datetime.fromisoformat(e['end'])
  if start.tzinfo is None or end.tzinfo is None:raise ValueError('Event times require timezone offsets')
  if start>end:raise ValueError('Event ends before it starts')
  date.fromisoformat(e['verified_on'])
  if end<datetime.now(timezone.utc):continue
  cards.append('<article class="pt-card" data-pt-event data-end="'+esc(e['end'])+'"><h3>'+esc(e['title'])+'</h3><p><time datetime="'+esc(e['start'])+'">'+esc(start.strftime('%d %b %Y, %I:%M %p'))+' (local event time)</time><br>'+esc(e['location'])+'<br>Organiser: '+esc(e['organiser'])+'</p><a href="'+safe_url(e['source_url'])+'">Event source and details</a><p>Checked: '+esc(e['verified_on'])+'</p></article>')
 return '<div class="pt-grid">'+''.join(cards)+'</div><p class="pt-empty" data-events-empty'+(' hidden' if cards else '')+'>No verified upcoming events published yet. Send a dated event notice to help build the calendar.</p>'
# Validate all publishable records before touching any page.
business_html=business_content()
event_html=event_content()
for code in products:product(code,False)
count=0
for p in R.glob('*.html'):
 text=p.read_text()
 def render(m):
  kind,key=m.group(1).split(':',1)
  value=header(p.name) if key=='header' and kind=='shared' else contact() if key=='contact' and kind=='shared' else business_html if key=='businesses' else event_html if key=='events' else product(key,p.name=='lungi-product-catalogue.html')
  return '<!-- PT:'+m.group(1)+':START -->'+value+'<!-- PT:'+m.group(1)+':END -->'
 new=re.sub(r'<!-- PT:([^ ]+):START -->.*?<!-- PT:\1:END -->',render,text,flags=re.S)
 new=re.sub(r'(data-whatsapp=")[^"]*(")',lambda m:m[1]+site['whatsapp']+m[2],new)
 if new!=text:p.write_text(new);count+=1
print('Refreshed',count,'pages. Upload the rendered HTML and assets; Python is only for maintenance.')
