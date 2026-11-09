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
assets['careers-team'] = {type:'image/webp', b64:fs.readFileSync('assets/ropiroll-team.webp').toString('base64')};
const careersBlock = `
<style>
#rr-careers{max-width:1160px;margin:55px auto;padding:clamp(22px,5vw,44px);border:2px solid #f36b43;border-radius:28px;background:#fff7ef;color:#241d1a;box-sizing:border-box;font-family:inherit}
#rr-careers .rr-eyebrow{color:#e75a2e;font-size:14px;font-weight:800;letter-spacing:.13em}
#rr-careers h2{font-size:clamp(30px,5vw,48px);line-height:1.12;margin:24px 0;color:#241d1a}
#rr-careers h2 span{color:#e95e30}
#rr-careers p{font-size:clamp(16px,2vw,21px);color:#655a55}
#rr-careers .rr-terms{display:flex;gap:48px;flex-wrap:wrap;margin:28px 0}
#rr-careers .rr-terms div{display:grid;gap:8px}
#rr-careers .rr-terms small{font-size:16px;color:#796b63}
#rr-careers .rr-terms strong{font-size:clamp(22px,3vw,30px);color:#a63d24}
#rr-careers .rr-call{display:flex;align-items:center;justify-content:center;gap:12px;background:#fa582c;color:#fff;text-decoration:none;font-size:clamp(18px,3vw,25px);font-weight:800;border-radius:15px;padding:20px 12px;margin:20px 0 28px;box-shadow:0 10px 22px #e85b3030}
#rr-careers img{display:block;width:100%;height:auto;border-radius:17px;aspect-ratio:1672/941;object-fit:cover}
@media(max-width:650px){#rr-careers{margin:30px 15px;padding:22px 18px;border-radius:22px}#rr-careers .rr-terms{gap:25px}}
</style>
<section id="rr-careers" aria-labelledby="rr-careers-title">
<span class="rr-eyebrow">ПРИГЛАШАЕМ В КОМАНДУ</span>
<h2 id="rr-careers-title">Требуются повара<br>в <span>РопиРолл</span></h2>
<p>Готовь с нами — стань частью нашей команды!</p>
<div class="rr-terms"><div><small>График</small><strong>2/2 или 3/3</strong></div><div><small>Оплата</small><strong>300 ₽/час</strong></div></div>
<p>Осоргино, ул. Новая, 2/1</p>
<p>По всем вопросам звоните:</p>
<a class="rr-call" href="tel:+79874928568" aria-label="Позвонить по вакансии">☎ &nbsp;8 (987) 492-85-68</a>
<img src="/api/careers-team.webp" alt="Команда поваров РопиРолл" loading="lazy" width="1672" height="941">
</section>`;
assets.index.b64 = Buffer.from(fs.readFileSync('index-delivery.html', 'utf8')
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
  'app.get("/api/careers-team.webp", (_req,res) => send(res,assets["careers-team"],"no-cache"));\n' +
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


