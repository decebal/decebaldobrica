import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
const root=fileURLToPath(new URL('../../../../',import.meta.url)).replace(/\/$/,''),out=root+'/docs/social/assets/weekly19-report-learning';
const expected=JSON.parse(fs.readFileSync(out+'/final-hashes.json'));
const applied={
 'article.mdx':fs.readFileSync(root+'/apps/web/content/blog/2026-11-02-rust-ai-weekly-19.mdx','utf8'),
 'linkedin.txt':fs.readFileSync(root+'/docs/social/rust-ai-weekly-19-linkedin.md','utf8').split('\n---\n')[1].trim(),
 'x.txt':fs.readFileSync(root+'/docs/social/rust-ai-weekly-19-x.md','utf8').split(/## [1-6]\n\n/).slice(1).map(x=>x.trim()).join('\n---\n'),
};
const hashes=Object.fromEntries(Object.entries(applied).map(([k,v])=>[k,crypto.createHash('sha256').update(v).digest('hex')]));
for(const k in expected)if(expected[k]!==hashes[k])throw Error('Applied copy differs from final hash: '+k);
const probe='/private/tmp/newsletter19-applied-probe';fs.mkdirSync(probe+'/newsletter19',{recursive:true});for(const[k,v]of Object.entries(applied))fs.writeFileSync(probe+'/newsletter19/'+k,v);fs.copyFileSync(out+'/newsletter19-facts.json',probe+'/newsletter19-facts.json');
const r=spawnSync(process.execPath,[out+'/newsletter19-evaluator.mjs'],{input:JSON.stringify({candidate_worktree:probe,evaluator_id:'newsletter_structure',run_id:'run-1793614371021-39922-a591f845',baseline_commit:'a591f8459ec4ec70b23b368218f80db102205e1a',evaluated_commit:'exact-applied-copy-hashes'}),encoding:'utf8',timeout:15000});if(r.status!==0)throw Error(r.stderr);
const result=JSON.parse(r.stdout);if(result.result.output.measurements.filter(m=>m.kind==='hard_gate').some(m=>!m.outcome.passed))throw Error(r.stderr);
fs.writeFileSync(out+'/final-applied-evaluation.json',JSON.stringify({hashes,matchRecordedFinal:true,comparisonToRunnerCommit:'manual corrections differ; runner selected commit is not final artifact identity',diagnostics:JSON.parse(r.stderr.trim()),evaluation:result},null,2));
const html=fs.readFileSync(root+'/docs/social/rust-ai-weekly-19-substack.html','utf8');const uploaded=fs.readFileSync(root+'/docs/social/rust-ai-weekly-19-substack-uploaded.html','utf8');
const text=s=>s.replace(/<[^>]+>/g,'');if(text(html)!==text(uploaded))throw Error('Substack source copies differ');
const synd=fs.readFileSync(root+'/docs/social/rust-ai-weekly-19-syndication.md','utf8');const body=applied['article.mdx'].replace(/^---[\s\S]*?---\s*/,'').replace(/\]\(\//g,'](https://decebaldobrica.com/');if(!synd.endsWith(body))throw Error('Syndication body mismatch');
const sourceImgs=[...applied['article.mdx'].matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)].map(m=>m[1]);
const artHashes=Object.fromEntries(sourceImgs.map(p=>[p,crypto.createHash('sha256').update(fs.readFileSync(root+'/apps/web/public'+p)).digest('hex')]));
fs.writeFileSync(out+'/synchronization.json',JSON.stringify({htmlAndUploadedTextEqual:true,syndicationBodyExact:true,images:sourceImgs,artHashes,sourceLinksUnchanged:JSON.stringify([...new Set([...fs.readFileSync(out+'/baseline-article.mdx','utf8').matchAll(/\]\(([^)]+)\)/g)].map(m=>m[1]))].sort())===JSON.stringify([...new Set([...applied['article.mdx'].matchAll(/\]\(([^)]+)\)/g)].map(m=>m[1]))].sort())},null,2));
console.log({hashes,metrics:JSON.parse(r.stderr.trim()),synchronized:true});
