"""Exercise the real directory publisher in an isolated copy; no fixture is published."""
from pathlib import Path
import tempfile,shutil,json,subprocess,datetime
root=Path(__file__).resolve().parents[2]
with tempfile.TemporaryDirectory() as td:
 r=Path(td)
 shutil.copytree(root/'content',r/'content');(r/'tools').mkdir();[shutil.copy2(root/'tools'/name,r/'tools'/name) for name in ['build_content.py','marketplace_model.py','marketplace_template.py','site_layout.py']]
 (r/'podaturpet-local-business-directory.html').write_text('<!-- PT:content:businesses:START --><!-- PT:content:businesses:END -->')
 (r/'other.html').write_text('untouched')
 b=dict(name='<Test & business>',category='Test',address='Test address',public_phone='+919876543210',hours='Verify directly',verified_on=datetime.date.today().isoformat(),source_url='https://example.com/',map_url='https://example.com/map',approved=True,sponsored=True,public_listing_consent=True)
 def run():
  (r/'content/businesses.json').write_text(json.dumps([b]));return subprocess.run(['python3',str(r/'tools/build_content.py'),'--only','podaturpet-local-business-directory.html'],capture_output=True,text=True)
 assert run().returncode==0
 text=(r/'podaturpet-local-business-directory.html').read_text();assert 'Sponsored / கட்டண விளம்பரம்' in text and '&lt;Test &amp; business&gt;' in text
 assert (r/'other.html').read_text()=='untouched';print('PASS labelled sponsored listing, escaped fields and targeted rebuild')
 b['public_listing_consent']=False;assert run().returncode!=0;print('PASS paid publication blocked without listing consent')
 b['public_listing_consent']=True;b['verified_on']=(datetime.date.today()-datetime.timedelta(days=91)).isoformat();assert run().returncode!=0;print('PASS stale paid listing blocked')
 b['verified_on']=(datetime.date.today()+datetime.timedelta(days=1)).isoformat();assert run().returncode!=0;print('PASS future verification blocked')
 b['verified_on']=datetime.date.today().isoformat();b['source_url']='javascript:alert(1)';assert run().returncode!=0;print('PASS unsafe source URL rejected')
print('5 directory publisher tests passed.')
