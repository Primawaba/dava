import {execFileSync} from 'node:child_process';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
await import('./build.mjs');
await mkdir('releases',{recursive:true});
const {version}=JSON.parse(await readFile('package.json','utf8'));
const output=`releases/CONQUER-${version}.zip`;
execFileSync('python',['-c',`import zipfile
with zipfile.ZipFile('${output}','w',zipfile.ZIP_DEFLATED) as z:
 for f in ['JOGAR-CONQUER.html','LEIA-ME.txt','README.md','VALIDATION.md']: z.write(f,f)
`]);
await writeFile(output+'.sha256',createHash('sha256').update(await readFile(output)).digest('hex')+'\n');
console.log(output);
