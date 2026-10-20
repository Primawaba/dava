// Rasterize our original vector icon; no downloaded image dependencies.
import {chromium} from '@playwright/test';
import {readFile,writeFile} from 'node:fs/promises';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
try{const page=await browser.newPage();const svg=await readFile('public/assets/icon.svg','utf8');
for(const size of [192,512]){const data=await page.evaluate(async({svg,size})=>{const i=new Image();i.src='data:image/svg+xml;base64,'+btoa(svg);await i.decode();const c=document.createElement('canvas');c.width=size;c.height=size;c.getContext('2d').drawImage(i,0,0,size,size);return c.toDataURL('image/png').split(',')[1]},{svg,size});await writeFile(`public/assets/icon-${size}.png`,Buffer.from(data,'base64'))}
}finally{await browser.close()}
