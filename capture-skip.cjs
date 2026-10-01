const {chromium}=require('/workspace/nelson-o.github.io/node_modules/playwright');
const sharp=require('/workspace/nelson-o.github.io/node_modules/sharp');const fs=require('node:fs/promises');
(async()=>{const dir='/workspace/upkeep-evidence/screenshots';await fs.mkdir(dir,{recursive:true});const browser=await chromium.launch();const evidence=[];
for(const locale of ['en','zh-tw','zh-cn','ja'])for(const theme of ['light','dark'])for(const width of [1280,390]){
 const shots=[];const states=[];
 for(const [side,port] of [['before',4491],['after',4494]]){
  const context=await browser.newContext({viewport:{width,height:900},deviceScaleFactor:1,reducedMotion:'reduce',colorScheme:theme}); const page=await context.newPage();
  const response=await page.goto(`http://localhost:${port}/${locale}/systems/?theme=${theme}`,{waitUntil:'networkidle'});if(response.status()!==200)throw Error('route');
  await page.evaluate(()=>document.fonts.ready);await page.keyboard.press('Tab');const skip=page.locator('a[href="#main-content"]');if(!await skip.evaluate(el=>el===document.activeElement))throw Error('not focused');
  await page.waitForFunction(()=>document.querySelector('a[href="#main-content"]').getBoundingClientRect().y>=0);
  const box=await skip.boundingBox();if(box.x<0||box.y<0||box.x+box.width>width)throw Error('clipped skip link');
  states.push({side,text:await skip.textContent(),box});
  shots.push(await page.screenshot({path:`${dir}/${locale}-${theme}-${width}-${side}.png`,clip:{x:0,y:0,width:Math.min(width,420),height:64},animations:'disabled',caret:'hide'}));await context.close();
 }
 const w=Math.min(width,420);const label=`<svg width="${w*2+20}" height="64"><rect width="100%" height="100%" fill="#e8edf3"/><g font-family="sans-serif" font-size="13" fill="#17212d"><text x="12" y="23">Before — main (1d6d7aa)</text><text x="${w+32}" y="23">After — #168 (39f7a9a)</text><text x="12" y="47">/${locale}/systems/ · ${theme} · ${width}px</text><text x="${w+32}" y="47">First Tab: skip link focused</text></g></svg>`;
 const name=`${locale}-${theme}-${width}-comparison.png`;await sharp({create:{width:w*2+20,height:128,channels:4,background:'#e8edf3'}}).composite([{input:Buffer.from(label),left:0,top:0},{input:shots[0],left:0,top:64},{input:shots[1],left:w+20,top:64}]).png().toFile(`${dir}/${name}`);evidence.push({locale,theme,width,states,file:name});console.log(name);
}await browser.close();await fs.writeFile('/workspace/upkeep-evidence/visual-evidence.json',JSON.stringify(evidence,null,2));})().catch(e=>{console.error(e);process.exit(1)});
