import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import AdmZip from 'adm-zip';

if (!fs.existsSync('server-logo.js')) {
  new AdmZip('server-logo.zip').extractAllTo('.', true);
}

const source = fs.readFileSync('server-logo.js', 'utf8');
const found = source.match(/const assets = (\{.*\});/);
if (!found) throw new Error('Не удалось найти файлы сайта');

const assets = JSON.parse(found[1]);
const delivery = JSON.parse(fs.readFileSync('delivery-assets.json', 'utf8'));
assets.index.b64 = delivery.index;
assets.css.b64 = delivery.css;
assets['delivery-map'] = { type: 'image/jpeg', b64: delivery.map };

let output = source.slice(0, found.index) +
  'const assets = ' + JSON.stringify(assets) +
  source.slice(found.index + found[0].length);
const anchor = 'app.get("/api/logo",';
if (!output.includes(anchor)) throw new Error('Не удалось добавить карту');
output = output.replace(anchor,
  'app.get("/delivery-map.jpg", (_req,res) => send(res,assets["delivery-map"]));\n' + anchor);

const runtimeFile = path.resolve('server-delivery-live.js');
fs.writeFileSync(runtimeFile, output);
await import(pathToFileURL(runtimeFile).href);
