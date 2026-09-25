import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { pathToFileURL } from 'node:url';

const runtimeFile = path.join(os.tmpdir(), 'ropiroll-generated', 'server-delivery-live.js');
if (!fs.existsSync(runtimeFile)) {
  await import('./delivery-builder.js');
}
await import(pathToFileURL(runtimeFile).href);
