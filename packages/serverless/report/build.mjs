import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import * as esbuild from 'esbuild';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sharedPath = path.resolve(__dirname, '../../shared/src');

await esbuild.build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    minify: true,
    sourcemap: true,
    platform: 'node',
    target: 'es2020',
    outfile: 'dist/index.js',
    external: [],
    alias: {
        '@audit/shared': sharedPath
    }
});

const publicSource = path.resolve(__dirname, './public');
const publicTarget = path.resolve(__dirname, './dist/public');

await fs.mkdir(publicTarget);
await fs.cp(publicSource, publicSource, {
    recursive: true
});
