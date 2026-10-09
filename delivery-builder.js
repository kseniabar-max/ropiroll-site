import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import AdmZip from 'adm-zip';

if (!fs.existsSync('server-logo.js')) {
  new AdmZip('server-logo.zip').extractAllTo('.', true);
}

const source = fs.readFileSync('server-logo.js', 'utf8');
const found = source.match(/const assets = (\{.*\});/);
if (!found) throw new Error('Не удалось найти файлы сайта');

const assets = JSON.parse(found[1]);
const delivery = JSON.parse(fs.readFileSync('delivery-assets.json', 'utf8'));
assets.index.b64 = fs.readFileSync('index-delivery.html').toString('base64');
assets.css.b64 = fs.readFileSync('css-delivery.css').toString('base64');
assets.js.b64 = fs.readFileSync('app-redesign.js').toString('base64');
assets.home = {type:'application/javascript; charset=utf-8', b64:fs.readFileSync('home.js').toString('base64')};
assets['category-images'] = {type:'image/webp', b64:fs.readFileSync('category-images-v61.webp').toString('base64')};
assets['delivery-map'] = { type: 'image/jpeg', b64: delivery.map };
assets['hero-food'] = { type: 'image/webp', b64: fs.readFileSync('hero-v60.webp').toString('base64') };

let output = source.slice(0, found.index) +
  'const assets = ' + JSON.stringify(assets) +
  source.slice(found.index + found[0].length);
const anchor = 'app.get("/api/logo",';
if (!output.includes(anchor)) throw new Error('Не удалось добавить изображения');
output = output.replace(anchor,
  'app.get("/api/category-images", (_req,res) => send(res,assets["category-images"]));\n' +
  'app.get("/home.js", (_req,res) => send(res,assets.home,"no-cache"));\n' +
  'app.get("/delivery-map.jpg", (_req,res) => send(res,assets["delivery-map"]));\n' +
  'app.get("/api/hero-food", (_req,res) => send(res,assets["hero-food"]));\n' + anchor);

// Catalogue mode must reject requests from older cached order pages as well.
const ordersStart = output.indexOf('let pool;');
const ordersEnd = output.indexOf('app.use((_req,res)=>send(res,assets.index', ordersStart);
if (ordersStart < 0 || ordersEnd < 0) throw new Error('Не удалось отключить онлайн-заказы');
output = output.slice(0, ordersStart) +
  'app.all("/api/order", (_req,res) => res.status(405).json({error:"Заказы принимаются только по телефону",phone:"+79641695122"}));\n' +
  output.slice(ordersEnd);
output = output.replace('import crypto from "node:crypto";\n', '')
  .replace('import pg from "pg";\n', '')
  .replace('import nodemailer from "nodemailer";\n', '');

const runtimeDir = path.join(os.tmpdir(), 'ropiroll-generated');
fs.mkdirSync(runtimeDir, { recursive: true });
fs.writeFileSync(path.join(runtimeDir, 'package.json'), '{"type":"module"}');
const modulesLink = path.join(runtimeDir, 'node_modules');
if (!fs.existsSync(modulesLink)) {
  fs.symlinkSync(path.resolve('node_modules'), modulesLink, 'dir');
}
fs.writeFileSync(path.join(runtimeDir, 'server-delivery-live.js'), output);
console.log('Готов электронный каталог с заказом только по телефону');
