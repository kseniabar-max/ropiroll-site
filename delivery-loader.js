import path from 'node:path';
import os from 'node:os';
import { pathToFileURL } from 'node:url';

// Always rebuild the generated server on process startup. Timeweb may retain
// /tmp between deploys, so checking only for file existence serves stale assets.
await import('./delivery-builder.js');
const runtimeFile = path.join(os.tmpdir(), 'ropiroll-generated', 'server-delivery-live.js');
await import(pathToFileURL(runtimeFile).href);
