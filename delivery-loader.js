import path from 'node:path';
import { pathToFileURL } from 'node:url';

// Assets are generated at build time, not at runtime: runtime may be read-only.
const runtimeFile = path.resolve('generated-site/server-delivery-live.js');
await import(pathToFileURL(runtimeFile).href);
