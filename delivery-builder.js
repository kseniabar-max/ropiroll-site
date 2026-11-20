import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import AdmZip from 'adm-zip';

if (!fs.existsSync('server-logo.js')) {
  new AdmZip('server-logo.zip').extractAllTo('.', true);
}

const source = fs.readFileSync('server-logo.js', 'utf8');
const found = source.match(/const assets = (\{.*\});/);
if (!found) throw new Error('Не удалось найти файлы сайта');

const assets = JSON.parse(found[1]);
const delivery = JSON.parse(fs.readFileSync('delivery-assets.json', 'utf8'));
// Change asset URLs with their contents so Safari cannot reuse an older layout.
const assetVersion = createHash('sha256')
  .update(fs.readFileSync('css-delivery.css'))
  .update(fs.readFileSync('app-redesign.js'))
  .digest('hex').slice(0, 16);
const comboImageFiles = ["E70B47F5-09C1-40B7-B7C5-37E9CEBD286E.png","FA9F6F4B-1AD4-48C0-949E-C119184DAC7F.png","ABDB3E2E-28F7-443B-A342-0FFEA54795E7.png","AA569255-8D07-44F2-B8A1-1B423E645BB4.png","5C3F7ABC-4A43-4CF3-8DCC-E19D40D734ED.png","3F10E051-2A3D-4AB0-9EB6-9D34BA86174F.png","92843018-91B9-4540-80EC-4400241D896D.png","5B91EE46-3AB7-4111-9867-0A3182B18E39.png"];
comboImageFiles.forEach((filename,index)=>{assets['combo-'+(index+1)]={type:'image/png',b64:fs.readFileSync(filename).toString('base64')};});
assets['careers-team'] = {type:'image/webp', b64:fs.readFileSync('assets/ropiroll-team.webp').toString('base64')};
assets['fried-wings-new'] = {type:'image/jpeg', b64:fs.readFileSync('IMG_1036.jpeg').toString('base64')};
const careersBlock = `
<style>
#rr-careers{max-width:1160px;margin:30px auto;padding:clamp(16px,3vw,28px);border:2px solid #f36b43;border-radius:28px;background:#fff7ef;color:#241d1a;box-sizing:border-box;font-family:inherit}
#rr-careers .rr-eyebrow{color:#e75a2e;font-size:14px;font-weight:800;letter-spacing:.13em}
#rr-careers h2{font-size:clamp(26px,4vw,38px);line-height:1.12;margin:12px 0;color:#241d1a}
#rr-careers h2 span{color:#e95e30}
#rr-careers p{font-size:clamp(14px,1.8vw,17px);color:#655a55;margin:12px 0}
#rr-careers .rr-terms{display:flex;gap:28px;flex-wrap:wrap;margin:16px 0}
#rr-careers .rr-terms div{display:grid;gap:5px}
#rr-careers .rr-terms small{font-size:14px;color:#796b63}
#rr-careers .rr-terms strong{font-size:clamp(19px,2.5vw,25px);color:#a63d24}
#rr-careers .rr-call{display:flex;align-items:center;justify-content:center;gap:12px;background:#fa582c;color:#fff;text-decoration:none;font-size:clamp(16px,2.5vw,21px);font-weight:800;border-radius:14px;padding:13px 10px;margin:14px 0 18px;box-shadow:0 10px 22px #e85b3030}
#rr-careers img{display:block;width:100%;height:auto;border-radius:14px;object-fit:contain;max-height:320px;object-position:center}
@media(max-width:650px){#rr-careers{margin:20px 15px;padding:16px 16px;border-radius:20px}#rr-careers .rr-terms{gap:20px}#rr-careers img{max-height:none}}
</style>
<section id="rr-careers" aria-labelledby="rr-careers-title">
<span class="rr-eyebrow">ПРИГЛАШАЕМ В КОМАНДУ</span>
<h2 id="rr-careers-title">Требуются повара<br>в <span>РопиРолл</span></h2>

<div class="rr-terms"><div><small>График</small><strong>2/2 или 3/3</strong></div><div><small>Оплата</small><strong>300 ₽/час</strong></div></div>
<p>Осоргино, ул. Новая, 2/1</p>

<a class="rr-call" href="tel:+79874928568" aria-label="Позвонить по вакансии">☎ &nbsp;8 (987) 492-85-68</a>
<img src="/api/careers-team.webp" alt="Команда поваров РопиРолл" loading="lazy" width="1672" height="941">
</section>`;
const comboPromoBlock = `
<style>
#rr-combo-promo{background:radial-gradient(ellipse at 80% 0%,#56200d 0%,#18100c 48%,#100d0b 100%);color:#fff;padding:34px 16px 38px;margin:20px 0 28px;overflow:hidden}
#rr-combo-promo .rr-combo-inner{max-width:1160px;margin:auto}
#rr-combo-promo .rr-combo-eyebrow{display:inline-block;background:#f65a21;padding:8px 18px;border-radius:40px;font-size:14px;font-weight:800;letter-spacing:.06em}
#rr-combo-promo h2{font-size:clamp(34px,6vw,68px);line-height:1.04;letter-spacing:-.035em;margin:16px 0 8px;color:#fff;font-weight:900}
#rr-combo-promo h2 em{font-style:normal;color:#ff672b}
#rr-combo-promo .rr-combo-sub{font-size:clamp(15px,2.2vw,20px);color:#f8e4d6;margin:0 0 20px}
#rr-combo-promo .rr-combo-gallery{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
#rr-combo-promo .rr-combo-card{display:block;overflow:hidden;border-radius:15px;background:#fff4e7;border:1px solid #e9824b;transition:transform .2s}
#rr-combo-promo .rr-combo-card:hover{transform:translateY(-3px)}
#rr-combo-promo .rr-combo-card img{display:block;width:100%;height:auto;aspect-ratio:1;object-fit:contain}
#rr-combo-promo .rr-combo-bottom{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-top:22px;flex-wrap:wrap}
#rr-combo-promo .rr-combo-from{font-weight:900;font-size:clamp(22px,4vw,34px)}#rr-combo-promo .rr-combo-from strong{color:#ff682e}
#rr-combo-promo .rr-combo-button{background:#f65a21;color:white;text-decoration:none;font-weight:800;padding:15px 25px;border-radius:13px}
@media(max-width:650px){#rr-combo-promo{padding:27px 15px 30px;margin:12px 0 20px}#rr-combo-promo .rr-combo-gallery{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:12px;padding-bottom:12px;-webkit-overflow-scrolling:touch}#rr-combo-promo .rr-combo-card{flex:0 0 77%;scroll-snap-align:center}#rr-combo-promo .rr-combo-bottom{align-items:stretch}#rr-combo-promo .rr-combo-button{text-align:center;width:100%}}
</style>
<section id="rr-combo-promo" aria-labelledby="rr-combo-title"><div class="rr-combo-inner">
<span class="rr-combo-eyebrow">НОВИНКИ В РОПИРОЛЛ</span>
<h2 id="rr-combo-title">ВЫГОДНЫЕ <em>КОМБО</em></h2>
<p class="rr-combo-sub">Любимые блюда вместе — ещё вкуснее и выгоднее!</p>
<div class="rr-combo-gallery"><a href="#menu" data-cat="Комбо" class="rr-combo-card" aria-label="Комбо № 1"><img src="/api/combo-photo/1" alt="Комбо № 1" loading="lazy"></a><a href="#menu" data-cat="Комбо" class="rr-combo-card" aria-label="Комбо № 2"><img src="/api/combo-photo/2" alt="Комбо № 2" loading="lazy"></a><a href="#menu" data-cat="Комбо" class="rr-combo-card" aria-label="Комбо № 3"><img src="/api/combo-photo/3" alt="Комбо № 3" loading="lazy"></a><a href="#menu" data-cat="Комбо" class="rr-combo-card" aria-label="Комбо № 4"><img src="/api/combo-photo/4" alt="Комбо № 4" loading="lazy"></a><a href="#menu" data-cat="Комбо" class="rr-combo-card" aria-label="Комбо № 5"><img src="/api/combo-photo/5" alt="Комбо № 5" loading="lazy"></a><a href="#menu" data-cat="Комбо" class="rr-combo-card" aria-label="Комбо № 6"><img src="/api/combo-photo/6" alt="Комбо № 6" loading="lazy"></a><a href="#menu" data-cat="Комбо" class="rr-combo-card" aria-label="Комбо № 7"><img src="/api/combo-photo/7" alt="Комбо № 7" loading="lazy"></a><a href="#menu" data-cat="Комбо" class="rr-combo-card" aria-label="Комбо № 8"><img src="/api/combo-photo/8" alt="Комбо № 8" loading="lazy"></a></div>
<div class="rr-combo-bottom"><span class="rr-combo-from">8 комбо-наборов · от <strong>450 ₽</strong></span><a class="rr-combo-button" href="#menu" data-cat="Комбо">Выбрать комбо →</a></div>
</div></section>`;
assets.index.b64 = Buffer.from(fs.readFileSync('index-delivery.html', 'utf8')
  .replace('<section id="categories"', comboPromoBlock + '<section id="categories"')
  .replace('</main>', careersBlock + '</main>')
  .replace(/\/(style\.css|app\.js)\?v=[^"']+/g, '/$1?v=' + assetVersion))
  .toString('base64');
assets.css.b64 = fs.readFileSync('css-delivery.css').toString('base64');
// Legal documents are served as standalone pages while preserving the phone-only catalogue.
const legalSlugs = ["offer", "privacy", "consent", "delivery", "requisites"];
for (const slug of legalSlugs) {
  assets["legal-" + slug] = {
    type: "text/html; charset=utf-8",
    b64: fs.readFileSync("legal/" + slug + ".html").toString("base64")
  };
}

assets.js.b64 = fs.readFileSync('app-redesign.js').toString('base64');
assets.home = {type:'application/javascript; charset=utf-8', b64:fs.readFileSync('home.js').toString('base64')};
assets['category-images'] = {type:'image/webp', b64:fs.readFileSync('category-images-v61.webp').toString('base64')};
assets['delivery-map'] = { type: 'image/jpeg', b64: delivery.map };
assets['hero-food'] = { type: 'image/webp', b64: fs.readFileSync('hero-v60.webp').toString('base64') };
assets['rr-food'] = {type:'image/webp',b64:fs.readFileSync('assets/rr-food.webp').toString('base64')};
assets['rr-mascot'] = {type:'image/webp',b64:fs.readFileSync('assets/rr-mascot.webp').toString('base64')};
assets['menu-v42-sprite'] = {type:'image/webp', b64:fs.readFileSync('menu-v42-sprite.webp').toString('base64')};
for (const key of ['wasabi','ginger','soy','chopsticks','cheese','bbq']) {
  assets['addon-'+key] = {type:'image/webp', b64:fs.readFileSync('assets/addons/'+key+'.webp').toString('base64')};
}
for (const key of ['shrimp','strips','calamari','onion','sprite']) {
  assets['fried-'+key] = {type:'image/webp', b64:fs.readFileSync('fried-assets/'+key+'.webp').toString('base64')};
}



for (const key of ["fish-hot-20261031","ebi-hot-20261031","chicken-hot-20261031","unagi-hot-20261031"]) { assets["catalog-"+key]={type:"image/webp",b64:fs.readFileSync("catalog-photos/"+key+".webp").toString("base64")}; }
for (const key of ["set-more-love-20261028","set-spring-20261028","set-assorti-20261028","set-mexico-20261028","set-fish-20261028","set-sea-gifts-20261028","set-hot-20261028","set-men-20261028","set-classic-20261028","set-evening-20261028","classic-eel-20261026", "chicken-bbq-20261023", "volcano-20261022", "tatar", "pizza-caesar", "bavarian", "hawaiian", "carpaccio", "super-meat", "hunter", "pepperoni", "salmon", "mushroom", "margherita", "four-cheeses", "caesar-shrimp", "caesar-chicken", "set-california", "shawarma-cheese", "shawarma-thai", "shawarma-long"]) { assets['catalog-'+key]={type:'image/webp',b64:fs.readFileSync('catalog-photos/'+key+'.webp').toString('base64')}; }

let output = source.slice(0, found.index) +
  'const assets = ' + JSON.stringify(assets) +
  source.slice(found.index + found[0].length);
// Styles must revalidate as well as scripts when opening an existing tab.
output = output.replace('send(res,assets.css)', 'send(res,assets.css,"no-cache")');
const anchor = 'app.get("/api/logo",';
if (!output.includes(anchor)) throw new Error('Не удалось добавить изображения');
output = output.replace(anchor,
  'app.get("/api/combo-photo/:number", (req,res) => { const n=Number(req.params.number); if(!Number.isInteger(n)||n<1||n>8)return res.status(404).end(); return send(res,assets["combo-"+n],"no-cache"); });\n' +
  'app.get("/api/careers-team.webp", (_req,res) => send(res,assets["careers-team"],"no-cache"));\n' +
  'app.get("/api/fried-wings-new.jpeg", (_req,res) => send(res,assets["fried-wings-new"],"no-cache"));\n' +
  'app.get("/api/catalog-photo/:key", (req,res) => { const asset=assets["catalog-"+String(req.params.key)]; if(!asset)return res.status(404).end();return send(res,asset,"no-cache"); });\n' +
  'app.get("/api/addon-photo/:key", (req,res) => { const key=String(req.params.key||""); if(!["wasabi","ginger","soy","chopsticks","cheese","bbq"].includes(key))return res.status(404).end(); return send(res,assets["addon-"+key],"no-cache"); });\n' +
  'app.get("/api/category-images", (_req,res) => send(res,assets["category-images"]));\n' +
  'app.get("/home.js", (_req,res) => send(res,assets.home,"no-cache"));\n' +
  'app.get("/delivery-map.jpg", (_req,res) => send(res,assets["delivery-map"]));\n' +
  'app.get("/api/hero-food", (_req,res) => send(res,assets["hero-food"]));\n' +
  'app.get("/api/rr-food.webp", (_req,res) => send(res,assets["rr-food"],"no-cache"));\n' +
  'app.get("/api/rr-mascot.webp", (_req,res) => send(res,assets["rr-mascot"],"no-cache"));\n' +
  'app.get("/api/menu-v42-sprite.webp", (_req,res) => send(res,assets["menu-v42-sprite"],"no-cache"));\n' +
  'app.get("/api/fried-photo/:key", (req,res) => { const key = String(req.params.key||""); if(!["shrimp","strips","calamari","onion","sprite"].includes(key)) return res.status(404).end(); return send(res,assets["fried-"+key],"no-cache"); });\n' + anchor);

// Catalogue mode must reject requests from older cached order pages as well.
const ordersStart = output.indexOf('let pool;');
const ordersEnd = output.indexOf('app.use((_req,res)=>send(res,assets.index', ordersStart);
if (ordersStart < 0 || ordersEnd < 0) throw new Error('Не удалось отключить онлайн-заказы');
output = output.slice(0, ordersStart) +
  'app.all("/api/order", (_req,res) => res.status(405).json({error:"Заказы принимаются только по телефону",phone:"+79632375357"}));\n' +
  output.slice(ordersEnd);
// Diagnostics: identify the exact version served on the real domain.
const legalRoutes = [
  'app.get("/legal/:slug", (req,res) => { const slug=String(req.params.slug || ""); if (!["offer","privacy","consent","delivery","requisites"].includes(slug)) return res.status(404).end(); res.set("Cache-Control","no-cache"); return send(res,assets["legal-"+slug],"no-cache"); });',
  'app.get("/legal", (_req,res) => res.redirect(302,"/legal/requisites"));'
].join("\n");
const legalFallbackAnchor = 'app.use((_req,res)=>send(res,assets.index';
const legalFallbackPosition = output.indexOf(legalFallbackAnchor);
if (legalFallbackPosition < 0) throw new Error('Не удалось найти финальный маршрут сайта');
output = output.slice(0,legalFallbackPosition) + legalRoutes + "\n" + output.slice(legalFallbackPosition);

const diagnosticAnchor = 'app.use((_req,res)=>send(res,assets.index';
const diagnosticPosition = output.indexOf(diagnosticAnchor);
if (diagnosticPosition < 0) throw new Error('Не удалось найти обработчик главной страницы');
output = output.slice(0, diagnosticPosition) +
  'app.get("/api/site-version", (_req,res) => res.set("Cache-Control","no-store").json({version:"ropi-editorial-20261017",phone:"+79632375357",hero:"Ощути вкус"}));\\n'.replace('\\n','\n') +
  'app.get("/", (_req,res) => { res.set("Cache-Control","no-store, max-age=0"); return send(res,assets.index,"no-cache"); });\\n'.replace('\\n','\n') +
  output.slice(diagnosticPosition);

output = output.replace('import crypto from "node:crypto";\n', '')
  .replace('import pg from "pg";\n', '')
  .replace('import nodemailer from "nodemailer";\n', '');

const runtimeDir = path.resolve('generated-site');
fs.mkdirSync(runtimeDir, { recursive: true });
fs.writeFileSync(path.join(runtimeDir, 'package.json'), '{"type":"module"}');
const modulesLink = path.join(runtimeDir, 'node_modules');
if (!fs.existsSync(modulesLink)) {
  fs.symlinkSync(path.resolve('node_modules'), modulesLink, 'dir');
}
fs.writeFileSync(path.join(runtimeDir, 'server-delivery-live.js'), output);
console.log('Готов электронный каталог с заказом только по телефону');


