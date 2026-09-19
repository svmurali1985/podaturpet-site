"""Isolated end-to-end publisher/moderation tests. No fixture reaches the live dataset."""
from pathlib import Path
from datetime import date,timedelta,datetime,timezone
import unittest,sys,tempfile,shutil,json,subprocess,copy,os
ROOT=Path(__file__).resolve().parents[2];sys.path.insert(0,str(ROOT/'tools'))
import marketplace_model as M
TODAY=datetime.now(timezone.utc).date().isoformat()
def application(pid='test-accountant'):
 return {'id':pid,'name':'ISOLATED QA ACCOUNTANT','description':{'en':'Test fixture only, never a real provider.','ta':'சோதனை மட்டும்; உண்மையான சேவையாளர் அல்ல.'},'services':['accounting'],'languages':['ta','en'],'areas':[{'country':'CA','region':'ON','city':'Toronto','mode':'local'}],'contact':{'phone':'+14165550199','whatsapp':'+14165550199','website':'https://example.com/'},'pricing':{'mode':'from','currency':'CAD','amount':'125.50','unit':'hour','taxes':'excluded','checked_on':TODAY},'sponsored':False}
def evidence():
 e={k:{'confirmed':True,'checked_on':TODAY,'evidence_ref':'TEST-EVIDENCE-NOT-REAL'} for k in ['identity','contact','consent','scope']};e['identity']['public_source']='https://example.com/';e['scope']['jurisdictions']=[{'country':'CA','region':'ON','lawful':True}];e['licences']=[{'service':'accounting','country':'CA','region':'ON','source':'https://www.cpaontario.ca/protecting-the-public/directories','checked_on':TODAY,'expires_on':(datetime.now(timezone.utc).date()+timedelta(days=120)).isoformat(),'active':True,'scope_confirmed':True}];return e
class ModelTests(unittest.TestCase):
 def test_01_valid_review_has_scoped_dates_no_private_evidence(self):
  p=M.review(application(),evidence());self.assertEqual(p['pricing']['currency'],'CAD');self.assertNotIn('TEST-EVIDENCE',json.dumps(p));self.assertEqual(M.public_record(p),p)
 def test_02_each_check_is_mandatory(self):
  for k in ['identity','contact','consent','scope']:
   e=evidence();e[k]['confirmed']=False
   with self.assertRaises(ValueError):M.review(application(),e)
 def test_03_future_or_old_checks_rejected(self):
  for delta in [1,-91]:
   e=evidence();e['contact']['checked_on']=(datetime.now(timezone.utc).date()+timedelta(days=delta)).isoformat()
   with self.assertRaises(ValueError):M.review(application(),e)
 def test_04_regulated_service_requires_correct_register(self):
  for source in ['https://example.com/','https://cpaontario.ca.evil.example/','javascript:alert(1)']:
   e=evidence();e['licences'][0]['source']=source
   with self.assertRaises(ValueError):M.review(application(),e)
 def test_05_licence_active_scope_and_expiry(self):
  for key,value in [('active',False),('scope_confirmed',False),('expires_on','2000-01-01')]:
   e=evidence();e['licences'][0][key]=value
   with self.assertRaises(ValueError):M.review(application(),e)
 def test_06_unknown_regulated_jurisdiction_rejected(self):
  a=application();a['areas'][0].update(country='DE',region='Berlin',city='Berlin');e=evidence();e['scope']['jurisdictions']=[{'country':'DE','region':'Berlin','lawful':True}]
  with self.assertRaises(ValueError):M.review(a,e)
 def test_07_remote_requires_each_served_country_scope(self):
  a=application();a['services']=['website-development'];a['areas'].append({'country':'US','region':'','city':'','mode':'remote'})
  with self.assertRaises(ValueError):M.review(a,evidence())
 def test_08_research_only_and_unknown_categories_fail(self):
  for cat in ['nursing','not-a-category']:
   a=application();a['services']=[cat]
   with self.assertRaises(ValueError):M.request(a)
 def test_09_no_safeguarding_shortcut(self):
  a=application();a['services']=['school-tutoring']
  with self.assertRaises(ValueError):M.review(a,evidence())
 def test_10_private_and_nested_data_fail_public_validation(self):
  for where in ['root','contact','checks']:
   p=M.review(application(),evidence());target=p if where=='root' else p[where];target['private_email']='PRIVATE@example.com'
   with self.assertRaises(ValueError):M.public_record(p)
 def test_11_contacts_urls_and_city_validation(self):
  for value in ['javascript:alert(1)','https://user:password@example.com/','https://127.0.0.1/','https://host.local/']:
   a=application();a['contact']['website']=value
   with self.assertRaises(ValueError):M.request(a)
  a=application();a['areas'][0]['city']='123 Main Street'
  with self.assertRaises(ValueError):M.request(a)
 def test_12_currency_precision_and_ranges(self):
  a=application();a['pricing'].update(currency='JPY',amount='12.50')
  with self.assertRaises(ValueError):M.request(a)
  a['pricing'].update(currency='KWD',amount='12.500');self.assertEqual(M.request(a)['pricing']['amount'],'12.500')
  a['pricing'].update(mode='range',maximum='1')
  with self.assertRaises(ValueError):M.request(a)
 def test_13_duplicate_records_rejected(self):
  p=M.review(application(),evidence())
  with self.assertRaises(ValueError):M.dataset([p,p])
class WorkflowTests(unittest.TestCase):
 def setUp(self):
  self.temp=tempfile.TemporaryDirectory();self.base=Path(self.temp.name);self.site=self.base/'site';shutil.copytree(ROOT/'tools',self.site/'tools',ignore=shutil.ignore_patterns('__pycache__'));shutil.copytree(ROOT/'content',self.site/'content');shutil.copy2(ROOT/'podaturpet-local-business-directory.html',self.site/'podaturpet-local-business-directory.html');self.store=self.base/'private';self.app=self.base/'application.json';self.checks=self.base/'checks.json';self.app.write_text(json.dumps(application()));self.checks.write_text(json.dumps(evidence()))
 def tearDown(self):self.temp.cleanup()
 def cli(self,*args,ok=True):
  r=subprocess.run([sys.executable,str(self.site/'tools/marketplace_admin.py'),'--store',str(self.store),*args],capture_output=True,text=True)
  if ok:self.assertEqual(r.returncode,0,r.stderr)
  else:self.assertNotEqual(r.returncode,0,r.stdout)
  return r
 def approve(self):
  self.cli('submit','--file',str(self.app));self.cli('review','--id','test-accountant','--file',str(self.checks));self.cli('approve','--id','test-accountant','--reason','QA-fixture-reviewed')
 def test_14_full_private_review_publish_pipeline(self):
  self.cli('submit','--file',str(self.app));self.cli('approve','--id','test-accountant','--reason','skip-review',ok=False);self.cli('publish');self.assertEqual(json.loads((self.site/'content/businesses.json').read_text()),[])
  self.cli('review','--id','test-accountant','--file',str(self.checks));self.cli('approve','--id','test-accountant','--reason','QA-reviewed');self.cli('publish')
  r=subprocess.run([sys.executable,str(self.site/'tools/build_content.py'),'--only','podaturpet-local-business-directory.html'],capture_output=True,text=True);self.assertEqual(r.returncode,0,r.stderr)
  public=(self.site/'content/businesses-public.js').read_text();self.assertIn('ISOLATED QA ACCOUNTANT',public);self.assertNotIn('TEST-EVIDENCE-NOT-REAL',public);self.assertNotIn('evidence_ref',public)
  self.assertEqual(os.stat(self.store/'marketplace.json').st_mode & 0o777,0o600)
 def test_15_pause_revokes_public_listing_on_publish(self):
  self.approve();self.cli('publish');self.cli('pause','--id','test-accountant','--reason','complaint-review');self.cli('publish');self.assertEqual(json.loads((self.site/'content/businesses.json').read_text()),[])
 def test_16_unknown_existing_public_records_not_destroyed(self):
  (self.site/'content/businesses.json').write_text(json.dumps([M.review(application(),evidence())]));self.cli('publish',ok=False);self.assertEqual(len(json.loads((self.site/'content/businesses.json').read_text())),1)
 def test_17_private_store_in_website_rejected(self):
  self.store=self.site/'private';self.cli('init',ok=False);self.assertFalse(self.store.exists())
 def test_18_outcomes_require_receipt_consent_and_transition(self):
  self.approve();base=['outcome','--ref','PS-0123456789ABCDEF','--provider','test-accountant','--evidence-ref','ticket-1']
  self.cli(*base,'--stage','won',ok=False);self.cli(*base,'--stage','received',ok=False);self.cli(*base,'--stage','received','--consent');self.cli(*base,'--stage','qualified');self.cli(*base,'--stage','quoted');self.cli(*base,'--stage','won','--amount','240.50','--currency','CAD')
  report=json.loads(self.cli('report').stdout);self.assertEqual(report['won_value_by_currency'],{'CAD':'240.50'});self.assertNotIn('PS-0123456789ABCDEF',json.dumps(report))
  self.cli(*base,'--stage','won','--amount','240.50','--currency','CAD',ok=False)
  self.cli(*base,'--stage','withdrawn');self.assertEqual(json.loads(self.cli('report').stdout)['won_value_by_currency'],{})
 def test_19_templates_are_private_and_not_overwritten(self):
  self.cli('template','--kind','application');self.assertTrue((self.store/'application-template.json').exists());self.cli('template','--kind','application',ok=False)
 def test_20_refuse_pending_data_files_in_public_website(self):
  dest=self.site/'application.json';dest.write_bytes(self.app.read_bytes());self.cli('submit','--file',str(dest),ok=False)
if __name__=='__main__':unittest.main(verbosity=2)
