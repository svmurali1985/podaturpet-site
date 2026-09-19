"""Original global extension of content/businesses.json. No network or third-party packages."""
from pathlib import Path
from datetime import date,timedelta,datetime,timezone
from decimal import Decimal,InvalidOperation
from urllib.parse import urlparse
import json,re,ipaddress
ROOT=Path(__file__).resolve().parents[1]
def catalogue():return json.loads((ROOT/'content/services.json').read_text())
def text(v,name,limit=160):
 if not isinstance(v,str) or not v.strip() or len(v)>limit or any(ord(c)<32 for c in v):raise ValueError('Invalid '+name)
 return v.strip()
def url(v):
 v=text(v,'HTTPS URL',500);u=urlparse(v)
 try:port=u.port
 except ValueError:raise ValueError('Invalid URL port')
 if u.scheme!='https' or not u.hostname or '.' not in u.hostname or u.username or u.password or port not in (None,443) or u.fragment or u.hostname.endswith(('.local','.internal','.localhost')):raise ValueError('Public HTTPS URL required')
 try:ipaddress.ip_address(u.hostname);raise ValueError('Use public domain URLs, not IP addresses')
 except ValueError as e:
  if str(e)=='Use public domain URLs, not IP addresses':raise
 return v

def checked(v,max_age=90,today=None):
 today=today or datetime.now(timezone.utc).date()
 if not isinstance(v,str) or not re.fullmatch(r'\d{4}-\d{2}-\d{2}',v):raise ValueError('ISO check date required')
 d=date.fromisoformat(v)
 if d>today or (today-d).days>max_age:raise ValueError('Check is future-dated or needs renewal')
 return v

def request(record):
 """Normalize an application; no evidence or private fields are ever copied by default."""
 D=catalogue();services={s['id']:s for s in D['services']};r=record
 pid=text(r.get('id'),'provider ID',48)
 if not re.fullmatch('[a-z0-9][a-z0-9-]{2,47}',pid):raise ValueError('Invalid provider ID')
 name=text(r.get('name'),'business name',100)
 desc=r.get('description',{});description={l:text(desc.get(l),'description '+l,500) for l in ['en','ta']}
 selected=r.get('services');langs=r.get('languages');areas=r.get('areas')
 if not isinstance(selected,list) or not 1<=len(selected)<=5 or len(set(selected))!=len(selected) or any(s not in services or not services[s]['launch'] for s in selected):raise ValueError('Choose 1–5 enabled services; research-only services cannot publish')
 if not isinstance(langs,list) or not langs or len(set(langs))!=len(langs) or any(l not in D['languages'] for l in langs):raise ValueError('Invalid service languages')
 if not isinstance(areas,list) or not 1<=len(areas)<=30:raise ValueError('Explicit service areas required')
 locations=[]
 for a in areas:
  if a.get('country') not in D['countries']:raise ValueError('ISO country required')
  region=str(a.get('region','')).strip();city=str(a.get('city','')).strip()
  if len(region)>80 or len(city)>80 or any(c.isdigit() for c in city) or any(c in city+region for c in '<>@/\\') or any(ord(c)<32 for c in city+region):raise ValueError('Use city/region only, never a street address')
  mode=a.get('mode')
  if mode not in ['local','remote'] or mode=='local' and not city:raise ValueError('Local services require a city; remote areas require a country')
  locations.append(dict(country=a['country'],region=region,city=city,mode=mode))
 c=r.get('contact',{});contact={}
 for key in ['phone','whatsapp']:
  if c.get(key):
   v=text(c[key],key,20)
   if not re.fullmatch(r'\+[1-9]\d{6,14}',v):raise ValueError('Use E.164 public phone with +country code')
   contact[key]=v
 if c.get('website'):contact['website']=url(c['website'])
 if not contact:raise ValueError('At least one public contact channel required')
 price=r.get('pricing',{});mode=price.get('mode')
 if mode not in ['quote','fixed','from','range']:raise ValueError('Pricing mode required')
 pricing={'mode':mode}
 if mode!='quote':
  if price.get('currency') not in D['currencies']:raise ValueError('Supported explicit currency required')
  if price.get('unit') not in ['hour','visit','project','session','item']:raise ValueError('Pricing unit required')
  if price.get('taxes') not in ['included','excluded','confirm']:raise ValueError('Tax disclosure required')
  values={}
  for k in ['amount']+(['maximum'] if mode=='range' else []):
   v=str(price.get(k,''))
   if not re.fullmatch(r'\d{1,9}(\.\d{1,3})?',v) or Decimal(v)>Decimal('100000000'):raise ValueError('Invalid quoted price')
   # Support currencies with 0/3 minor digits without silently rounding away detail.
   precision=0 if price['currency'] in ['BIF','CLP','DJF','GNF','ISK','JPY','KMF','KRW','PYG','RWF','UGX','VND','VUV','XAF','XOF','XPF'] else 3 if price['currency'] in ['BHD','IQD','JOD','KWD','LYD','OMR','TND'] else 2
   if '.' in v and len(v.split('.')[1])>precision:raise ValueError('Too many decimal places for this currency')
   values[k]=v
  if mode=='range' and Decimal(values['maximum'])<Decimal(values['amount']):raise ValueError('Reversed price range')
  pricing.update(currency=price['currency'],unit=price['unit'],taxes=price['taxes'],checked_on=checked(price.get('checked_on')),**values)
 if not isinstance(r.get('sponsored',False),bool):raise ValueError('Sponsored must be a boolean')
 return dict(schema_version=2,id=pid,name=name,description=description,services=selected,languages=langs,areas=locations,contact=contact,pricing=pricing,sponsored=r.get('sponsored',False))

def review(application,evidence,today=None):
 """Require dated, attributable checks. These gates cannot replace truthful human verification."""
 today=today or datetime.now(timezone.utc).date();p=request(application);D=catalogue();e=evidence
 for name in ['identity','contact','consent','scope']:
  item=e.get(name,{})
  if item.get('confirmed') is not True:raise ValueError(name+' check required')
  checked(item.get('checked_on'),today=today)
  text(item.get('evidence_ref'),name+' private evidence reference',120)
 identity=url(e['identity'].get('public_source'))
 # The individual methods, reviewer and evidence references remain private.
 for a in p['areas']:
  if not any(x.get('country')==a['country'] and x.get('region','')==a['region'] and x.get('lawful') is True for x in e['scope'].get('jurisdictions',[])):raise ValueError('Document lawful scope for every served jurisdiction')
 risk={s['id']:s['risk'] for s in D['services']}
 if any(risk[s]=='safeguarding' for s in p['services']):
  safeguarding=e.get('safeguarding',{})
  if safeguarding.get('confirmed') is not True or safeguarding.get('guardian_contact_only') is not True:raise ValueError('Safeguarding review and guardian-only contact required')
  checked(safeguarding.get('checked_on'),today=today);text(safeguarding.get('evidence_ref'),'safeguarding evidence',120)
 licences=[]
 for service in p['services']:
  if risk[service]!='regulated':continue
  for a in p['areas']:
   allowed=[reg for reg in D['registers'] if service in reg['services'] and reg['country']==a['country'] and (not reg['region'] or reg['region']==a['region'])]
   if not allowed:raise ValueError('No reviewed professional-register policy for this service/jurisdiction')
   candidates=[x for x in e.get('licences',[]) if x.get('service')==service and x.get('country')==a['country'] and x.get('region','')==a['region']]
   if not candidates:raise ValueError('Professional licence evidence required')
   licence=candidates[0];u=url(licence.get('source'));host=urlparse(u).hostname
   if not any(host==urlparse(D['sources'][g['source']]['url']).hostname.removeprefix('www.') or host==urlparse(D['sources'][g['source']]['url']).hostname or host.endswith('.'+urlparse(D['sources'][g['source']]['url']).hostname.removeprefix('www.')) for g in allowed):raise ValueError('Use the approved professional register for licence evidence')
   checked(licence.get('checked_on'),30,today=today)
   if licence.get('active') is not True or licence.get('scope_confirmed') is not True:raise ValueError('Active status and permitted practice scope must be confirmed')
   expiry=date.fromisoformat(licence.get('expires_on',''))
   if expiry<today:raise ValueError('Expired licence')
   licences.append({k:licence[k] for k in ['service','country','region','checked_on','expires_on','source']})
 expiry=min(date.fromisoformat(e[k]['checked_on'])+timedelta(days=90) for k in ['identity','contact','consent','scope'])
 for x in licences:expiry=min(expiry,date.fromisoformat(x['checked_on'])+timedelta(days=30),date.fromisoformat(x['expires_on']))
 if p['pricing']['mode']!='quote':expiry=min(expiry,date.fromisoformat(p['pricing']['checked_on'])+timedelta(days=90))
 p['checks']={'identity_on':e['identity']['checked_on'],'contact_on':e['contact']['checked_on'],'consent_on':e['consent']['checked_on'],'scope_on':e['scope']['checked_on'],'source':identity,'valid_until':expiry.isoformat(),'licences':licences}
 if any(risk[s]=='safeguarding' for s in p['services']):p['checks']['safeguarding_on']=e['safeguarding']['checked_on'];p['checks']['valid_until']=min(expiry,date.fromisoformat(e['safeguarding']['checked_on'])+timedelta(days=90)).isoformat()
 return p

def public_record(r,today=None):
 """Validate released records, reject private properties and expired checks at build time."""
 today=today or datetime.now(timezone.utc).date();p=request(r)
 if set(r)-set(p)-{'checks'}:raise ValueError('Private or unsupported properties in public provider record')
 if any(r.get(k)!=v for k,v in p.items()):raise ValueError('Public record must use canonical fields only; nested private properties are forbidden')
 c=r.get('checks',{})
 allowed={'identity_on','contact_on','consent_on','scope_on','source','valid_until','licences','safeguarding_on'}
 if set(c)-allowed:raise ValueError('Private properties in public checks')
 for k in ['identity_on','contact_on','consent_on','scope_on']:checked(c.get(k),today=today)
 if date.fromisoformat(c.get('valid_until',''))<today:raise ValueError('Provider review expired; pause or renew before publishing')
 # Reconstruct only a validation envelope; no invented human evidence is published.
 ev={k:{'confirmed':True,'checked_on':c[k+'_on'],'evidence_ref':'previously-reviewed'} for k in ['identity','contact','consent','scope']}
 ev['identity']['public_source']=c['source'];ev['scope']['jurisdictions']=[dict(country=a['country'],region=a['region'],lawful=True) for a in p['areas']]
 ev['licences']=[dict(x,active=True,scope_confirmed=True) for x in c.get('licences',[])]
 if c.get('safeguarding_on'):ev['safeguarding']={'confirmed':True,'guardian_contact_only':True,'checked_on':c['safeguarding_on'],'evidence_ref':'previously-reviewed'}
 expected=review(p,ev,today=today)
 if c['valid_until']!=expected['checks']['valid_until']:raise ValueError('Review expiry does not match evidence dates')
 if any(set(x)-{'service','country','region','checked_on','expires_on','source'} for x in c.get('licences',[])):raise ValueError('Private licence fields in public data')
 return expected

def dataset(records):
 public=[public_record(r) for r in records if r.get('schema_version')==2]
 ids=[p['id'] for p in public]
 if len(ids)!=len(set(ids)):raise ValueError('Duplicate provider IDs')
 D=catalogue();site=json.loads((ROOT/'content/site.json').read_text())
 return {'version':2,'providers':sorted(public,key=lambda p:p['name'].casefold()),'services':[{k:s[k] for k in ['id','name','aliases','launch','risk']} for s in D['services']],'countries':D['countries'],'currencies':D['currencies'],'languages':D['languages'],'cities':D['cities'],'registers':D['registers'],'sources':D['sources'],'team':{'name':'Podaturpet / MuraRaj','whatsapp':site['whatsapp'],'email':site['email']},'ui':json.loads((ROOT/'content/services-locales.json').read_text())}
