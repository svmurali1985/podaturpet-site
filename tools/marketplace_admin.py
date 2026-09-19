#!/usr/bin/env python3
"""Private, owner-operated provider moderation and outcomes. Never serve the store on the web."""
from pathlib import Path
from datetime import date,datetime,timezone
from decimal import Decimal
from contextlib import contextmanager
import argparse,json,os,re,tempfile,fcntl,hashlib
from marketplace_model import ROOT,request,review,public_record,catalogue,text

def atomic(path,data,mode=0o600):
 fd,tmp=tempfile.mkstemp(prefix='.pending-',dir=path.parent)
 try:
  with os.fdopen(fd,'w') as f:json.dump(data,f,ensure_ascii=False,indent=2);f.write('\n');f.flush();os.fsync(f.fileno())
  os.chmod(tmp,mode);os.replace(tmp,path)
 finally:
  if os.path.exists(tmp):os.unlink(tmp)

def load_input(path):
 p=Path(path).expanduser().resolve()
 if p.is_relative_to(ROOT):raise ValueError('Keep applications/check evidence outside the public website')
 if p.stat().st_size>65536:raise ValueError('Input is too large')
 return json.loads(p.read_text())

@contextmanager
def store(path):
 p=Path(path).expanduser().resolve()
 if p.is_relative_to(ROOT) or p==Path.home() or p==Path('/') or ROOT.is_relative_to(p):raise ValueError('Choose a dedicated private directory outside the website')
 if not p.exists():p.mkdir(parents=True,mode=0o700)
 if p.is_symlink():raise ValueError('Private store cannot be a symlink')
 os.chmod(p,0o700)
 lock=p/'moderation.lock'
 fd=os.open(lock,os.O_CREAT|os.O_RDWR,0o600)
 with os.fdopen(fd,'r+') as f:
  fcntl.flock(f,fcntl.LOCK_EX)
  target=p/'marketplace.json'
  if target.is_symlink():raise ValueError('Private database cannot be a symlink')
  data=json.loads(target.read_text()) if target.exists() else {'version':1,'providers':{},'outcomes':{},'audit':[]}
  if data.get('version')!=1:raise ValueError('Unsupported store version')
  yield data
  atomic(target,data)

def main(argv=None):
 parser=argparse.ArgumentParser(description=__doc__)
 parser.add_argument('--store',required=True,help='Dedicated PRIVATE directory outside the website')
 parser.add_argument('--actor',default='owner',help='Operator alias, not a customer name')
 sub=parser.add_subparsers(dest='command',required=True)
 sub.add_parser('init');sub.add_parser('status');sub.add_parser('publish');sub.add_parser('report')
 x=sub.add_parser('template');x.add_argument('--kind',choices=['application','checks'],required=True)
 for cmd in ['submit','review']:
  x=sub.add_parser(cmd);x.add_argument('--file',required=True)
  if cmd=='review':x.add_argument('--id',required=True)
 for cmd in ['approve','pause','reject','revoke']:
  x=sub.add_parser(cmd);x.add_argument('--id',required=True);x.add_argument('--reason',required=True,help='Short non-sensitive audit reason')
 x=sub.add_parser('outcome');x.add_argument('--ref',required=True);x.add_argument('--provider',required=True);x.add_argument('--stage',required=True,choices=['received','qualified','quoted','won','lost','withdrawn']);x.add_argument('--consent',action='store_true');x.add_argument('--evidence-ref',required=True,help='Private ticket reference; no message, name, phone or document');x.add_argument('--amount');x.add_argument('--currency')
 args=parser.parse_args(argv)
 if not re.fullmatch('[A-Za-z0-9_-]{1,40}',args.actor):parser.error('Use a short operator alias')
 try:
  with store(args.store) as data:
   providers=data['providers'];cmd=args.command;stamp=datetime.now(timezone.utc).isoformat();audit={'at':stamp,'actor':args.actor,'action':cmd}
   if cmd=='init':print('Private moderation store ready. Nothing published.');return
   if cmd=='status':
    print(json.dumps({'providers':[{ 'id':k,'status':v['status']} for k,v in providers.items()],'recorded_outcomes':len(data['outcomes'])},indent=2));return
   if cmd=='template':
    destination=Path(args.store).expanduser().resolve()/(args.kind+'-template.json')
    if destination.exists():raise ValueError('Template already exists; keep or rename your existing file')
    if args.kind=='application':
     template={'id':'','name':'','description':{'en':'','ta':''},'services':[],'languages':[],'areas':[{'country':'','region':'','city':'','mode':'local'}],'contact':{'phone':'','whatsapp':'','website':''},'pricing':{'mode':'quote'},'sponsored':False}
    else:
     template={k:{'confirmed':False,'checked_on':'','evidence_ref':''} for k in ['identity','contact','consent','scope']};template['identity']['public_source']='';template['scope']['jurisdictions']=[{'country':'','region':'','lawful':False}];template['licences']=[];template['safeguarding']={'confirmed':False,'checked_on':'','evidence_ref':'','guardian_contact_only':False}
    atomic(destination,template);print('Blank private template:',destination);return
   if cmd=='submit':
    app=request(load_input(args.file));pid=app['id'];old=providers.get(pid)
    if old and old['status']=='approved':raise ValueError('Pause an approved listing before replacing its application')
    providers[pid]={'application':app,'status':'pending','revision':(old or {}).get('revision',0)+1};audit['provider']=pid
   elif cmd=='review':
    p=providers.get(args.id)
    if not p or p['status'] not in ['pending','reviewed','paused']:raise ValueError('Review a pending or paused application')
    ev=load_input(args.file);approved=review(p['application'],ev)
    p.update(evidence=ev,public=approved,status='reviewed',reviewer=args.actor);audit['provider']=args.id
   elif cmd in ['approve','pause','reject','revoke']:
    p=providers.get(args.id)
    if not p:raise ValueError('Unknown provider')
    reason=text(args.reason,'audit reason',160)
    if cmd=='approve':
     if p['status']!='reviewed':raise ValueError('Only a reviewed application can be approved')
     p['public']=review(p['application'],p['evidence']);p['status']='approved'
    else:p['status']={'pause':'paused','reject':'rejected','revoke':'revoked'}[cmd]
    audit.update(provider=args.id,reason=reason)
   elif cmd=='publish':
    path=ROOT/'content/businesses.json';current=json.loads(path.read_text());managed=set(providers)
    unmanaged=[p for p in current if p.get('schema_version')==2 and p.get('id') not in managed]
    if unmanaged:raise ValueError('Public managed records are missing from this private store; refusing destructive replacement')
    result=[p for p in current if p.get('schema_version')!=2];published=[];withheld=[]
    for pid,p in providers.items():
     if p['status']!='approved':continue
     try:pub=review(p['application'],p['evidence']);public_record(pub)
     except ValueError:withheld.append(pid);continue
     published.append(pub)
    result.extend(sorted(published,key=lambda p:p['name'].casefold()));atomic(path,result,0o644)
    audit.update(count=len(published),withheld=withheld,public_sha256=hashlib.sha256(path.read_bytes()).hexdigest())
    print('Published',len(published),'approved provider records; expired/invalid withheld:',len(withheld))
    print('Now run: python3 tools/build_content.py --only podaturpet-local-business-directory.html')
   elif cmd=='outcome':
    if not re.fullmatch('PS-[A-F0-9]{16}',args.ref):raise ValueError('Use the random PS- reference from the consented enquiry')
    if args.provider not in providers:raise ValueError('Unknown provider')
    evidence=text(args.evidence_ref,'private evidence reference',120)
    if not re.fullmatch('[A-Za-z0-9_-]{1,120}',evidence):raise ValueError('Use an opaque ticket ID, never personal text')
    existing=data['outcomes'].get(args.ref);stage=args.stage
    transitions={None:['received'],'received':['qualified','lost','withdrawn'],'qualified':['quoted','lost','withdrawn'],'quoted':['won','lost','withdrawn'],'won':['withdrawn'],'lost':['withdrawn'],'withdrawn':[]}
    old=existing['stage'] if existing else None
    if stage not in transitions[old]:raise ValueError('Invalid outcome transition; record actual receipt before qualification/quote/win')
    if existing and existing['provider']!=args.provider:raise ValueError('Provider cannot change for an enquiry reference')
    if not existing and not args.consent:raise ValueError('Actual receipt plus consent evidence is required; a click is not receipt')
    item=dict(existing or {'provider':args.provider,'history':[],'consented':True});item['stage']=stage;item['history']=item['history']+[{'stage':stage,'at':stamp,'evidence_ref':evidence}]
    if stage=='won':
     if args.currency not in catalogue()['currencies'] or not args.amount or not re.fullmatch(r'\d{1,9}(\.\d{1,3})?',args.amount):raise ValueError('A won result requires actual amount and explicit currency')
     item['value']={'amount':args.amount,'currency':args.currency}
    if stage=='withdrawn':item={'provider':args.provider,'stage':'withdrawn','consented':False,'history':[{'stage':'withdrawn','at':stamp}]}
    data['outcomes'][args.ref]=item;audit.update(reference=args.ref,provider=args.provider,stage=stage)
   elif cmd=='report':
    counts={s:0 for s in ['received','qualified','quoted','won','lost','withdrawn']};totals={}
    for item in data['outcomes'].values():
     counts[item['stage']]+=1
     if item['stage']=='won':
      v=item['value'];totals[v['currency']]=totals.get(v['currency'],Decimal(0))+Decimal(v['amount'])
    print(json.dumps({'scope':'operator-recorded outcomes, not browser clicks; no automatic payment verification','current_stages':counts,'won_value_by_currency':{k:str(v) for k,v in totals.items()},'currency_conversion':'none'},indent=2));return
   data['audit'].append(audit)
   if cmd not in ['publish']:print('Recorded:',cmd,'— private store only. Publish and rebuild explicitly for website changes.')
 except (ValueError,OSError,KeyError,TypeError) as e:parser.exit(1,'Stopped: '+str(e)+'\n')
if __name__=='__main__':main()
