import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const runtimeFile = path.resolve('server-delivery-live.js');
if (!fs.existsSync(runtimeFile)) {
  await import('./delivery-builder.js');
}
await import(pathToFileURL(runtimeFile).href);
