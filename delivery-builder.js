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
assets.index.b64 = Buffer.from(fs.readFileSync('index-delivery.html', 'utf8')
  .replace(/\/(style\.css|app\.js)\?v=[^"']+/g, '/$1?v=' + assetVersion))
  .toString('base64');
assets.css.b64 = fs.readFileSync('css-delivery.css').toString('base64');
assets.js.b64 = fs.readFileSync('app-redesign.js').toString('base64');
assets.home = {type:'application/javascript; charset=utf-8', b64:fs.readFileSync('home.js').toString('base64')};
assets['category-images'] = {type:'image/webp', b64:fs.readFileSync('category-images-v61.webp').toString('base64')};
assets['delivery-map'] = { type: 'image/jpeg', b64: delivery.map };
assets['hero-food'] = { type: 'image/webp', b64: fs.readFileSync('hero-v60.webp').toString('base64') };
assets['rr-food'] = {type:'image/webp',b64:fs.readFileSync('assets/rr-food.webp').toString('base64')};
assets['rr-mascot'] = {type:'image/webp',b64:fs.readFileSync('assets/rr-mascot.webp').toString('base64')};
assets['menu-v42-sprite'] = {type:'image/webp', b64:fs.readFileSync('menu-v42-sprite.webp').toString('base64')};
for (const key of ['shrimp','strips','calamari','onion','sprite']) {
  assets['fried-'+key] = {type:'image/webp', b64:fs.readFileSync('fried-assets/'+key+'.webp').toString('base64')};
}



for (const key of ["super-meat", "hunter", "pepperoni", "salmon", "mushroom", "margherita", "four-cheeses", "caesar-shrimp", "caesar-chicken"]) { assets['catalog-'+key]={type:'image/webp',b64:fs.readFileSync('catalog-photos/'+key+'.webp').toString('base64')}; }

let output = source.slice(0, found.index) +
  'const assets = ' + JSON.stringify(assets) +
  source.slice(found.index + found[0].length);
// Styles must revalidate as well as scripts when opening an existing tab.
output = output.replace('send(res,assets.css)', 'send(res,assets.css,"no-cache")');
const anchor = 'app.get("/api/logo",';
if (!output.includes(anchor)) throw new Error('Не удалось добавить изображения');
output = output.replace(anchor,
  'app.get("/api/catalog-photo/:key", (req,res) => { const asset=assets["catalog-"+String(req.params.key)]; if(!asset)return res.status(404).end();return send(res,asset,"no-cache"); });\n' +
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
