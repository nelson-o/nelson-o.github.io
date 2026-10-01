const {chromium}=require('/workspace/nelson-o.github.io/node_modules/playwright');
const sharp=require('/workspace/nelson-o.github.io/node_modules/sharp');
const fs=require('node:fs/promises');
(async()=>{
 const dir='/workspace/verification/screenshots'; await fs.mkdir(dir,{recursive:true});
 const browser=await chromium.launch(); const results=[];
 for(const locale of ['en','zh-tw','zh-cn','ja']) for(const theme of ['light','dark']) for(const width of [1280,390]) for(const stress of (locale==='en'&&width===390?[false,true]:[false])) {
  const shots=[]; const evidence=[];
  for(const [side,port] of [['before',4391],['after',4392]]) {
   const context=await browser.newContext({viewport:{width,height:900},deviceScaleFactor:1,colorScheme:theme,reducedMotion:'reduce'});
   const page=await context.newPage();
   const response=await page.goto(`http://localhost:${port}/${locale}/?theme=${theme}`,{waitUntil:'networkidle'}); if(response.status()!==200) throw Error('route failed');
   await page.evaluate(async()=>{document.querySelectorAll('[data-deferred-art]').forEach(e=>e.setAttribute('data-deferred-art','ready'));document.querySelectorAll('img[loading="lazy"]').forEach(e=>e.loading='eager');await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
   const heading=page.locator('main > section').last().locator('header');
   if(stress) await heading.locator('h1,h2').evaluate(el=>el.textContent=Array(3).fill(el.textContent).join(' '));
   await heading.scrollIntoViewIfNeeded();
   await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
   evidence.push(await page.locator('main').last().evaluate(el=>[...el.querySelectorAll('h1,h2,h3')].map(h=>({tag:h.tagName,text:h.textContent}))));
   shots.push(await heading.screenshot({path:`${dir}/${locale}-${theme}-${width}${stress?'-stress':''}-${side}.png`,animations:'disabled',caret:'hide'}));
   await context.close();
  }
  const a=await sharp(shots[0]).raw().toBuffer({resolveWithObject:true}), b=await sharp(shots[1]).raw().toBuffer({resolveWithObject:true});
  const identical=a.info.width===b.info.width&&a.info.height===b.info.height&&a.data.equals(b.data);
  if(!identical) throw Error(`Unexpected appearance change ${locale} ${theme} ${width}`);
  if(evidence[0].filter(h=>h.tag==='H1').length!==2||evidence[1].filter(h=>h.tag==='H1').length!==1) throw Error('Heading assertion failed');
  const w=a.info.width,h=a.info.height,gap=20,header=74;
  const label=`<svg width="${w*2+gap}" height="${header}"><rect width="100%" height="100%" fill="#e8edf3"/><g font-family="sans-serif" font-size="${width===390?13:18}" fill="#17212d"><text x="12" y="25">Before — main (76721d7)</text><text x="${w+gap+12}" y="25">After — heading (1b15b19)</text><text x="12" y="51">/${locale}/ · ${theme} · ${width}px · ${stress?'3× title stress':'latest-writing block'}</text><text x="${w+gap+12}" y="51">Pixel-identical · h1 → h2</text></g></svg>`;
  const file=`${locale}-${theme}-${width}${stress?'-stress':''}-comparison.png`;
  await sharp({create:{width:w*2+gap,height:h+header,channels:4,background:'#e8edf3'}}).composite([{input:Buffer.from(label),top:0,left:0},{input:shots[0],top:header,left:0},{input:shots[1],top:header,left:w+gap}]).png().toFile(`${dir}/${file}`);
  results.push({locale,theme,width,stress,deviceScaleFactor:1,identical,file,before:evidence[0],after:evidence[1]}); console.log(file,identical);
 }
 await fs.writeFile('/workspace/verification/visual-evidence.json',JSON.stringify(results,null,2)); await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
