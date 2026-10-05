const {chromium}=require('/workspace/nelson-o.github.io/node_modules/playwright');
const fs=require('node:fs/promises');
(async()=>{const dir='/workspace/oct5-evidence/screenshots';await fs.mkdir(dir,{recursive:true});const b=await chromium.launch();const results=process.env.RECAPTURE_JA ? JSON.parse(await fs.readFile('/workspace/oct5-evidence/captures.json')).filter(c=>!(c.locale==='ja'&&c.width===320)) : [];const cases=[];
for(const locale of ['en','zh-tw','zh-cn','ja'])for(const theme of ['light','dark'])for(const width of [320,390])cases.push({locale,theme,width,profile:false});
for(const locale of ['en','zh-tw'])for(const theme of ['light','dark'])cases.push({locale,theme,width:1280,profile:false});
for(const locale of ['en','de'])for(const theme of ['light','dark'])cases.push({locale,theme,width:390,profile:true});
for(const c of cases){if(process.env.RECAPTURE_JA && !(c.locale==='ja'&&c.width===320))continue;const {locale,theme,width,profile}=c;const stem=`${locale}-${theme}-${width}-${profile?'profile':'site'}`;const states=[];
for(const [side,port] of [['before',4621],['after',4623]]){
const context=await b.newContext({viewport:{width,height:900},deviceScaleFactor:1,reducedMotion:'reduce',colorScheme:theme});const p=await context.newPage();await p.goto(`http://localhost:${port}/${locale}/${profile?'profile/2026':'systems'}/?theme=${theme}`,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);const button=p.locator('button.theme-toggle');await button.click();const panel=p.locator(`[data-placement=${profile?'above':'below'}]`);await panel.evaluate(async n=>{await Promise.all(n.getAnimations().map(a=>a.finished.catch(()=>{})))});
const box=await panel.boundingBox();if(side==='after'&&(box.x<0||box.x+box.width>width))throw Error(`clipped ${stem}`);
let clip={x:0,y:0,width,height:locale==='ja'&&width===320?440:380};
if(profile){const buttonBox=await button.boundingBox();clip={x:0,y:Math.max(0,box.y-12),width,height:Math.ceil(buttonBox.y+buttonBox.height-box.y+24)}}
await p.screenshot({path:`${dir}/${stem}-${side}.png`,clip,animations:'disabled',caret:'hide'});states.push({side,panel:box,transform:await panel.evaluate(n=>getComputedStyle(n).transform)});await context.close();
}results.push({...c,stem,states});console.log(stem);
}await b.close();await fs.writeFile('/workspace/oct5-evidence/captures.json',JSON.stringify(results,null,2));})().catch(e=>{console.error(e);process.exit(1)});
