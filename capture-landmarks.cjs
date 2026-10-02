const {chromium}=require('/workspace/nelson-o.github.io/node_modules/playwright');
const sharp=require('/workspace/nelson-o.github.io/node_modules/sharp');const fs=require('node:fs/promises');
(async()=>{const dir='/workspace/oct2-evidence/screenshots';await fs.mkdir(dir,{recursive:true});const browser=await chromium.launch();const results=[];
for(const route of ['','systems/','footprint/'])for(const locale of ['en','zh-tw'])for(const theme of ['light','dark'])for(const width of [1280,390])for(const diagnostic of (locale==='en'&&theme==='light'&&width===390?[false,true]:[false])){
 const shots=[],states=[];
 for(const [side,port] of [['before',4591],['after',4592]]){
  const context=await browser.newContext({viewport:{width,height:900},deviceScaleFactor:1,reducedMotion:'reduce',colorScheme:theme});const page=await context.newPage();
  await page.goto(`http://localhost:${port}/${locale}/${route}?theme=${theme}`,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
  const count=await page.getByRole('main').count();if(count!==(side==='before'?2:1))throw Error('landmark count');
  states.push({side,mainLandmarks:count});
  const stem=`${locale}-${route.replaceAll('/','')||'home'}-${theme}-${width}${diagnostic?'-diagnostic':''}`;
  let shot;
  if(diagnostic){
   await page.addStyleTag({content:'main::before { content: "main landmark (diagnostic)"; display: block; color: #fff; background: #8b165a; font: 14px/28px monospace; padding-left: 8px; }'});
   const main=page.locator('#main-content');await main.scrollIntoViewIfNeeded();const box=await main.boundingBox();
   shot=await page.screenshot({path:`${dir}/${stem}-${side}.png`,clip:{x:box.x,y:box.y,width:box.width,height:Math.min(280,box.height)},animations:'disabled',caret:'hide'});
  }else{
   const block=page.locator('#main-content > :first-child > :first-child');await block.scrollIntoViewIfNeeded();
   shot=await block.screenshot({path:`${dir}/${stem}-${side}.png`,animations:'disabled',caret:'hide'});
  }
  shots.push(shot);await context.close();
 }
 const a=await sharp(shots[0]).raw().toBuffer({resolveWithObject:true}),b=await sharp(shots[1]).raw().toBuffer({resolveWithObject:true});
 const identical=a.info.width===b.info.width&&a.info.height===b.info.height&&a.data.equals(b.data);
 if(!diagnostic&&!identical)throw Error(`unexpected pixels ${route} ${locale} ${theme} ${width}`);
 const w=Math.max(a.info.width,b.info.width),h=Math.max(a.info.height,b.info.height),gap=20,header=70;
 const label=`<svg width="${w*2+gap}" height="70"><rect width="100%" height="100%" fill="#e8edf3"/><g font-family="sans-serif" font-size="13" fill="#17212d"><text x="10" y="23">Before — main (1d6d7aa)</text><text x="${w+30}" y="23">After — landmark fix</text><text x="10" y="45">/${locale}/${route} · ${theme} · ${width}px</text><text x="${w+30}" y="45">${diagnostic?'DIAGNOSTIC CSS: label each main':'Normal view: pixel-identical'}</text><text x="${w+30}" y="63">Main landmarks: 2 → 1</text></g></svg>`;
 const file=`${locale}-${route.replaceAll('/','')||'home'}-${theme}-${width}${diagnostic?'-diagnostic':''}-comparison.png`;
 await sharp({create:{width:w*2+gap,height:h+header,channels:4,background:'#e8edf3'}}).composite([{input:Buffer.from(label),top:0,left:0},{input:shots[0],top:header,left:0},{input:shots[1],top:header,left:w+gap}]).png().toFile(`${dir}/${file}`);
 results.push({route:`/${locale}/${route}`,locale,theme,width,diagnostic,identical,states,file});console.log(file);
}await browser.close();await fs.writeFile('/workspace/oct2-evidence/visual-evidence.json',JSON.stringify(results,null,2));})().catch(e=>{console.error(e);process.exit(1)});
