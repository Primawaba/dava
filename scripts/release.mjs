import {readFile,readdir,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
await mkdir('releases',{recursive:true});
const {version}=JSON.parse(await readFile('package.json','utf8'));
const basename=`conquer-web-${version}.zip`;
const output=resolve('releases/'+basename);
// Python's standard zipfile avoids relying on an npm archiving package.
execFileSync('python',['-c',`import pathlib,zipfile
root=pathlib.Path('dist')
with zipfile.ZipFile(${JSON.stringify(output)},'w',zipfile.ZIP_DEFLATED) as z:
 for p in sorted(root.rglob('*')):
  if p.is_file(): z.write(p,p.relative_to(root))
 z.write('README.md','DEVELOPMENT-README.md')
 z.write('ADAPTATION.md','ADAPTATION.md')
 z.write('VALIDATION.md','VALIDATION.md')
 z.write('PDF-RULES.md','PDF-RULES.md')
 z.writestr('LEIA-ME.txt','CONQUER - Cronicas do Abismo\\n\\nHospede o conteudo deste ZIP em um servidor estatico HTTPS ou plataforma de jogos HTML. index.html esta na raiz. Nao abra por file://. O jogo funciona offline apos carregar todos os arquivos pela primeira vez.\\n\\nEste e um jogo web/PWA, nao um instalador EXE/APK/IPA. Regras adaptadas: consulte ADAPTATION.md. Saves ficam no navegador; exporte arquivos para transferir entre aparelhos.\\n')
`]);
const zip=await readFile(output);const checksum=createHash('sha256').update(zip).digest('hex');
await writeFile('releases/SHA256SUMS.txt',`${checksum}  ${basename}\n`);
console.log(`Release written: ${output} (${(zip.length/1024/1024).toFixed(2)} MiB)\nSHA256 ${checksum}`);
