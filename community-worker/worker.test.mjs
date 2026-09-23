import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import worker from './worker.mjs';
import {createHash} from 'node:crypto';
const origin='https://podaturpet.com';
function setup(){
 const db=new DatabaseSync(':memory:');db.exec(readFileSync(new URL('./schema.sql',import.meta.url),'utf8'));
 const wrap=(sql,args=[])=>({bind(...a){return wrap(sql,a);},async first(){return db.prepare(sql).get(...args)||null;},async all(){return {results:db.prepare(sql).all(...args)};},async run(){return {meta:db.prepare(sql).run(...args)};}});
 const env={DB:{prepare:wrap,batch:async list=>Promise.all(list.map(s=>s.all()))},ADMIN_TOKEN:'a'.repeat(64),FORM_SECRET:'f'.repeat(64),ENABLED:'true',ALLOWED_ORIGINS:origin};
 async function req(path,body,admin=false,extra={}){const r=new Request('https://example.workers.dev'+path,{method:body?'POST':'GET',headers:{Origin:origin,...(body?{'Content-Type':'application/json'}:{}),...(admin?{Authorization:'Bearer '+env.ADMIN_TOKEN}:{}),...extra},body:body?JSON.stringify(body):undefined});Object.defineProperty(r,'cf',{value:{country:'IN',region:'Tamil Nadu',city:'Chennai'}});return worker.fetch(r,env);}
 return {db,env,req};
}
async function comment(req,changes={}){
 const {token}=await (await req('/v1/challenge?page=%2Findex.html')).json();let proof=0;while(!createHash('sha256').update(token+'.'+proof).digest('hex').startsWith('000'))proof++;
 const body={page:'/index.html',message:'Helpful page. Please add weaving details.',consent:true,name:'Reader',location:'Tamil Nadu',purpose:'textiles',token,proof,...changes};return {body,response:await req('/v1/comments',body)};
}
test('admin authentication, origin restriction and fail-closed configuration',async()=>{
 const {req,env}=setup();assert.equal((await req('/v1/admin/stats')).status,401);assert.equal((await req('/v1/admin/comments',undefined,false,{Authorization:'Bearer wrong'})).status,401);assert.equal((await req('/v1/admin/stats',undefined,true,{Origin:'https://evil.example'})).status,403);assert.equal((await req('/v1/admin/stats',undefined,true)).status,200);env.ENABLED='false';assert.equal((await req('/v1/admin/stats',undefined,true)).status,503);
});
test('analytics requires consent, honours privacy signals, strips all other fields and aggregates page views',async()=>{
 const {req,db}=setup();assert.equal((await req('/v1/view',{page:'/index.html',consent:false})).status,400);
 assert.equal((await req('/v1/view',{page:'/index.html?secret=1',consent:true})).status,400);
 await req('/v1/view',{page:'/index.html',consent:true},false,{'Sec-GPC':'1'});assert.equal(db.prepare('SELECT COUNT(*) n FROM page_views').get().n,0);
 for(let i=0;i<2;i++)assert.equal((await req('/v1/view',{page:'/index.html',consent:true,ip:'secret',name:'private',query:'private'})).status,200);
 const d=await (await req('/v1/admin/stats?days=1',undefined,true)).json();assert.equal(d.views,2);assert.equal(d.locations[0].city,'Chennai');assert.equal(db.prepare('SELECT COUNT(*) n FROM page_views').get().n,1);assert(!JSON.stringify(db.prepare('SELECT * FROM page_views').all()).includes('private'));
});
test('pending comments stay private; approve publishes; delete removes; replay rejected',async()=>{
 const {req}=setup();const {body,response}=await comment(req);assert.equal(response.status,200);const {id}=await response.json();assert.equal((await req('/v1/comments',body)).status,409);
 assert.equal((await (await req('/v1/comments?page=%2Findex.html')).json()).comments.length,0);
 const pending=await (await req('/v1/admin/comments',undefined,true)).json();assert.equal(pending.comments.length,1);
 assert.equal((await req('/v1/admin/moderate',{id,action:'approve'})).status,401);
 await req('/v1/admin/moderate',{id,action:'approve'},true);let list=await (await req('/v1/comments?page=%2Findex.html')).json();assert.equal(list.comments.length,1);assert.equal(list.comments[0].message,body.message);assert(!('consent_version' in list.comments[0]));
 await req('/v1/admin/moderate',{id,action:'delete'},true);assert.equal((await (await req('/v1/comments?page=%2Findex.html')).json()).comments.length,0);
});
test('validation rejects absent consent, malicious URLs, honeypot, invalid proof, oversized bodies and unknown paths',async()=>{
 const {req}=setup();for(const changes of [{consent:false},{website:'spam'},{message:'https://spam.example'},{token:'invalid'},{page:'/secret.html'},{message:'x'.repeat(1201)}])assert.equal((await comment(req,changes)).response.status,400);
 assert.equal((await req('/v1/comments',{message:'x'.repeat(17000)})).status,413);assert.equal((await req('/v1/admin/stats?days=1000',undefined,true)).status,400);assert.equal((await req('/v1/comments?page=%2Findex.html&before=-1')).status,400);
});
test('free-service application limits stop further writes',async()=>{
 const {req,db}=setup();const today=new Date().toISOString().slice(0,10);db.prepare('INSERT INTO budgets VALUES(?,?,?)').run(today,'views',5000);assert.equal((await req('/v1/view',{page:'/index.html',consent:true})).status,429);assert.equal(db.prepare('SELECT COUNT(*) n FROM page_views').get().n,0);
 db.prepare('INSERT INTO budgets VALUES(?,?,?)').run(today,'comments',100);assert.equal((await comment(req)).response.status,429);
});
test('expiry is enforced in reads and scheduled cleanup',async()=>{
 const {db,env,req}=setup();const t=Math.floor(Date.now()/1000);const insert=db.prepare('INSERT INTO comments(id,page,name,location,purpose,message,status,created,consent_version) VALUES(?,?,?,?,?,?,?,?,?)');
 insert.run('old-pending','/index.html','Anon','','','Old pending','pending',t-31*86400,'test');insert.run('old-public','/index.html','Anon','','','Old approved','approved',t-366*86400,'test');
 assert.equal((await (await req('/v1/admin/comments',undefined,true)).json()).comments.length,0);assert.equal((await (await req('/v1/comments?page=%2Findex.html')).json()).comments.length,0);await worker.scheduled({},env);assert.equal(db.prepare('SELECT COUNT(*) n FROM comments').get().n,0);
});
test('public pagination stays scoped to a page and excludes pending content',async()=>{
 const {db,req}=setup();const t=Math.floor(Date.now()/1000),insert=db.prepare('INSERT INTO comments(id,page,name,location,purpose,message,status,created,consent_version) VALUES(?,?,?,?,?,?,?,?,?)');
 for(let i=0;i<25;i++)insert.run('c'+i,'/index.html','Anon','','','Comment '+i,'approved',t,'test');insert.run('other','/privacy-policy.html','Anon','','','Other page','approved',t,'test');
 const first=await (await req('/v1/comments?page=%2Findex.html')).json();assert.equal(first.comments.length,20);const second=await (await req('/v1/comments?page=%2Findex.html&before='+first.next)).json();assert.equal(second.comments.length,5);assert.equal(second.next,null);assert.equal(new Set([...first.comments,...second.comments].map(x=>x.id)).size,25);
});
test('signed form token cannot be changed or used for a different page',async()=>{
 const {req}=setup();const {body}=await comment(req);const tampered=body.token.slice(0,-1)+(body.token.endsWith('a')?'b':'a');assert.equal((await req('/v1/comments',{...body,token:tampered})).status,400);assert.equal((await req('/v1/comments',{...body,page:'/privacy-policy.html'})).status,400);
});
