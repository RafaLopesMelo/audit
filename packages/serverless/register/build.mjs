import * as esbuild from 'esbuild';
import path from 'node:path';
import { fileURLToPath } from 'url';

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
