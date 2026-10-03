const sharp=require('/workspace/nelson-o.github.io/node_modules/sharp');
const fs=require('node:fs/promises');
(async()=>{const dir='/workspace/oct3-evidence/screenshots';const cases=JSON.parse(await fs.readFile('/workspace/oct3-evidence/captures.json'));
for(const c of cases){const a=await sharp(`${dir}/${c.stem}-before.png`).metadata();const b=await sharp(`${dir}/${c.stem}-after.png`).metadata();const w=Math.max(a.width,b.width),h=Math.max(a.height,b.height),gap=20,header=54;
const label=`<svg width="${w*2+gap}" height="54"><rect width="100%" height="100%" fill="#e8edf3"/><g font-family="sans-serif" font-size="13" fill="#17212d"><text x="10" y="21">Before — main (02e2fc8)</text><text x="${w+30}" y="21">After — #173 (012d0c2)</text><text x="10" y="43">${c.locale} · ${c.theme} · ${c.width}px</text><text x="${w+30}" y="43">${c.route ? (c.route==='systems/'?'Systems index':'Ideas article') : 'Home control'}</text></g></svg>`;
await sharp({create:{width:w*2+gap,height:h+header,channels:4,background:'#e8edf3'}}).composite([{input:Buffer.from(label),top:0,left:0},{input:`${dir}/${c.stem}-before.png`,top:header,left:0},{input:`${dir}/${c.stem}-after.png`,top:header,left:w+gap}]).png().toFile(`${dir}/${c.stem}-comparison.png`);
}console.log(`Composed ${cases.length} pairs`);})();
