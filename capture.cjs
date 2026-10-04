const {chromium}=require('/workspace/nelson-o.github.io/node_modules/playwright');
const fs=require('node:fs/promises');
(async()=>{const dir='/workspace/oct4-evidence/screenshots';await fs.mkdir(dir,{recursive:true});const b=await chromium.launch();const results=[];
for(const locale of ['en','zh-tw'])for(const theme of ['light','dark'])for(const width of [1280,390])for(const state of ['open','keyboard-exit']){
const stem=`${locale}-${theme}-${width}-${state}`;const states=[];
for(const [side,port] of [['before',4611],['after',4613]]){
const context=await b.newContext({viewport:{width,height:900},deviceScaleFactor:1,reducedMotion:'reduce',colorScheme:theme});const p=await context.newPage();await p.goto(`http://localhost:${port}/${locale}/systems/?theme=${theme}`,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);const button=p.locator('button.theme-toggle');await button.click();await p.locator('input[type=radio]:checked').waitFor();
if(state==='keyboard-exit'){await p.keyboard.press('Shift+Tab');await p.keyboard.press('Shift+Tab');}
const expanded=await button.getAttribute('aria-expanded');if(expanded!==((side==='after'&&state==='keyboard-exit')?'false':'true'))throw Error('expanded mismatch');
await p.evaluate(()=>window.scrollTo(0,0));await p.screenshot({path:`${dir}/${stem}-${side}.png`,clip:{x:0,y:0,width,height:width===390?470:400},animations:'disabled',caret:'hide'});
states.push({side,expanded,focus:await p.evaluate(()=>({tag:document.activeElement.tagName,text:document.activeElement.textContent,href:document.activeElement.getAttribute('href')}))});await context.close();
}results.push({locale,theme,width,state,stem,states});console.log(stem);
}await b.close();await fs.writeFile('/workspace/oct4-evidence/captures.json',JSON.stringify(results,null,2));})().catch(e=>{console.error(e);process.exit(1)});
