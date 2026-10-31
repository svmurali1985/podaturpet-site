#!/usr/bin/env python3
"""Buildless regression check for reviewed routes; Python standard library only."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import sys
ROOT=Path(__file__).resolve().parents[1]
class Page(HTMLParser):
 def __init__(self,path):
  super().__init__();self.ids=[];self.urls=[];self.h1=0;self.lang=None
  self.feed(path.read_text())
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:self.ids.append(a['id'])
  if tag=='html':self.lang=a.get('lang')
  if tag=='h1':self.h1+=1
  if tag in ('a','link','img','script'):
   u=a.get('href') or a.get('src')
   if u:self.urls.append(u)
errors=[];cache={}
for filename in ('index.html','index-ta.html','lungi-product-catalogue.html'):
 page=Page(ROOT/filename)
 if page.h1!=1:errors.append(f'{filename}: expected one h1')
 if len(page.ids)!=len(set(page.ids)):errors.append(f'{filename}: duplicate IDs')
 if page.lang!=('ta' if filename=='index-ta.html' else 'en'):errors.append(f'{filename}: incorrect document language')
 for url in page.urls:
  u=urlsplit(url)
  if u.scheme or u.netloc:continue
  path=(ROOT/unquote(u.path).lstrip('/')) if u.path else ROOT/filename
  if path.is_dir():path=path/'index.html'
  if not path.exists():errors.append(f'{filename}: missing {url}');continue
  if u.fragment and path.suffix=='.html':
   if path not in cache:cache[path]=Page(path)
   if unquote(u.fragment) not in cache[path].ids:errors.append(f'{filename}: missing fragment {url}')
 print(f'Checked {filename}: {len(page.urls)} resource/link references')
if errors:
 print('\n'.join(errors));sys.exit(1)
print('PASS: local links, fragments, asset paths, document languages and heading structure.')
