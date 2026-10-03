const {chromium}=require('/workspace/nelson-o.github.io/node_modules/playwright');
const fs=require('node:fs/promises');
(async()=>{const dir='/workspace/oct3-evidence/screenshots';await fs.mkdir(dir,{recursive:true});const browser=await chromium.launch();const results=[];
const cases=[];
for(const locale of ['en','zh-tw','zh-cn','ja'])for(const theme of ['light','dark'])for(const width of [1280,390])cases.push({locale,theme,width,route:'systems/'});
for(const route of ['ideas/agent-loops/',''])for(const width of [1280,390])cases.push({locale:'en',theme:'light',width,route});
for(const c of cases){const {locale,theme,width,route}=c;const stem=`${locale}-${route.replaceAll('/','-')||'home-'}${theme}-${width}`;const states=[];
for(const [side,port] of [['before',4601],['after',4603]]){
const context=await browser.newContext({viewport:{width,height:900},deviceScaleFactor:1,reducedMotion:'reduce',colorScheme:theme});const page=await context.newPage();await page.goto(`http://localhost:${port}/${locale}/${route}?theme=${theme}`,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
const links=await page.locator('header nav a').evaluateAll(ls=>ls.map(a=>({text:a.textContent,href:a.getAttribute('href'),current:a.getAttribute('aria-current'),underline:getComputedStyle(a).textDecorationLine})));
const current=links.filter(l=>l.current);if(current.length!==(side==='after'&&route?1:0))throw Error('unexpected current count');
states.push({side,links});await page.getByRole('banner').screenshot({path:`${dir}/${stem}-${side}.png`,animations:'disabled',caret:'hide'});await context.close();
}results.push({...c,stem,states});console.log(stem);
}await browser.close();await fs.writeFile('/workspace/oct3-evidence/captures.json',JSON.stringify(results,null,2));})().catch(e=>{console.error(e);process.exit(1)});
