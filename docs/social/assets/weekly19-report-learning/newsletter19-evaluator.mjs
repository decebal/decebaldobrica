import fs from 'node:fs';
import path from 'node:path';
const request=JSON.parse(fs.readFileSync(0,'utf8')),root=request.candidate_worktree;
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const a=read('newsletter19/article.mdx'),l=read('newsletter19/linkedin.txt'),x=read('newsletter19/x.txt'),facts=JSON.parse(read('newsletter19-facts.json'));
const norm=s=>s.replace(/^\s*- /gm,'').replace(/[*`]/g,'').replace(/\s/g,'');
const missing=[];for(const b of facts.article)if(!norm(a).includes(b))missing.push(b.slice(0,100));
for(const b of facts.articleAnchors)if(!a.includes(b))missing.push(b);
for(const [text,anchors] of [[l,facts.linkedin],[x,facts.x]])for(const b of anchors)if(!text.includes(b))missing.push(b);
const body=a.replace(/^---[\s\S]*?---\s*/,'');
const prose=body.slice(body.indexOf('Astral announced'));
const wordCount=s=>s.trim().split(/\s+/).filter(Boolean).length;
const positions=[
  [prose,'Run the proposed parser against that corpus before changing extraction code.'],
  [l,'My first check would be a corpus of accepted archives, explicit rejected cases and a separate extraction policy.'],
  [x,'Start with real accepted archives, explicit rejected cases and a separate extraction policy.'],
].map(([text,anchor])=>text.includes(anchor)?wordCount(text.slice(0,text.indexOf(anchor))):100000);
const parts=x.split('\n---\n');
const weight=s=>[...s.replace(/https:\/\/\S+/g,'x'.repeat(23))].reduce((n,c)=>{const k=c.codePointAt(0);return n+(k<=0x10ff||k>=0x2000&&k<=0x200d||k>=0x2010&&k<=0x201f||k>=0x2032&&k<=0x2037?1:2)},0);
const paragraphs=body.split(/\n\n/).filter(p=>!p.startsWith('#')&&!p.startsWith('!')&&!p.startsWith('[')&&!p.startsWith('-'));
const substance=wordCount(body)>=facts.baselineBodyWords*0.85&&paragraphs.every(p=>wordCount(p)<=100)&&parts.length===6&&parts.every((p,i)=>p.startsWith(`${i+1}/6`)&&weight(p)<=280)&&[...l].length<3000&&positions.every(n=>n<100000);
const bait=!['comment below','repost this','agree?','game-changer',"you won't believe",'we achieved','I built','I discovered','we increased'].some(b=>`${a}\n${l}\n${x}`.includes(b));
const gate=(name,passed)=>({kind:'hard_gate',name,outcome:{passed,detail:null}});
console.error(JSON.stringify({positions,total:positions.reduce((s,n)=>s+n,0),missing,words:wordCount(body),xLengths:parts.map(weight)}));
console.log(JSON.stringify({protocol_version:1,result:{status:'success',output:{evaluator_id:request.evaluator_id,run_id:request.run_id,baseline_commit:request.baseline_commit,evaluated_commit:request.evaluated_commit,measurements:[gate('evidence_preserved',missing.length===0),gate('substance_and_platform',substance),gate('no_selected_bait',bait),{kind:'numeric',name:'words_before_actions',metric_kind:'objective',direction:'minimize',value:positions.reduce((s,n)=>s+n,0)}],observations:[],artifacts:[],warnings:[{code:'structural_proxy_only',detail:'Literal retention and action placement only. No model-behaviour, comprehension, newsletter, reach or conversion improvement established. Manual review required.'}]}}}));
