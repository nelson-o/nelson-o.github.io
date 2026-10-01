const sharp=require('/workspace/nelson-o.github.io/node_modules/sharp');
const fs=require('node:fs/promises');
(async()=>{
const dir='/workspace/verification/screenshots';
for(const r of JSON.parse(await fs.readFile('/workspace/verification/visual-evidence.json','utf8'))){
const stem=r.file.replace('-comparison.png',''); const before=await fs.readFile(`${dir}/${stem}-before.png`),after=await fs.readFile(`${dir}/${stem}-after.png`);
const {width:w,height:h}=await sharp(before).metadata();const gap=20,header=74;
const label=`<svg width="${w*2+gap}" height="${header}"><rect width="100%" height="100%" fill="#e8edf3"/><g font-family="sans-serif" font-size="${r.width===390?13:18}" fill="#17212d"><text x="12" y="25">Before — main (76721d7)</text><text x="${w+gap+12}" y="25">After — #167 (1b15b19)</text><text x="12" y="51">/${r.locale}/ · ${r.theme} · ${r.width}px · ${r.stress?'3× title stress':'latest-writing block'}</text><text x="${w+gap+12}" y="51">Pixel-identical · h1 → h2</text></g></svg>`;
await sharp({create:{width:w*2+gap,height:h+header,channels:4,background:'#e8edf3'}}).composite([{input:Buffer.from(label),top:0,left:0},{input:before,top:header,left:0},{input:after,top:header,left:w+gap}]).png().toFile(`${dir}/${r.file}`);
}
})();
