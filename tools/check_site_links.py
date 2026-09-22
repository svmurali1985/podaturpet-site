from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit,unquote
from collections import Counter
import json
R=Path(__file__).resolve().parents[1]
class Doc(HTMLParser):
 def __init__(self,s):super().__init__();self.ids=[];self.links=[];self.feed(s)
 def handle_starttag(self,t,a):
  a=dict(a)
  if 'id' in a:self.ids.append(a['id'])
  for key in ['src','href']:
   if key in a:self.links.append(a[key])
docs={p:Doc(p.read_text()) for p in R.glob('*.html')};errors=[]
for p,d in docs.items():
 for id,n in Counter(d.ids).items():
  if n>1:errors.append([p.name,'duplicate id',id])
 for ref in d.links:
  u=urlsplit(ref)
  if (u.netloc and u.netloc!='podaturpet.com') or (u.scheme and u.scheme not in ['http','https']):continue
  target=R/unquote(u.path.lstrip('/')) if u.path.startswith('/') else p.parent/unquote(u.path) if u.path else p
  if target.is_dir():target/='index.html'
  if not target.exists():errors.append([p.name,'missing file',ref])
  elif u.fragment and target in docs and unquote(u.fragment) not in docs[target].ids:errors.append([p.name,'missing anchor',ref])
print(json.dumps(errors,indent=2));print('Pages',len(docs),'Errors',len(errors))
raise SystemExit(bool(errors))
