import * as esbuild from 'esbuild';
import path from 'node:path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sharedPath = path.resolve(__dirname, '../shared/src');

const baseConfig = {
    entryPoints: ['src/index.ts'],
    bundle: true,
    sourcemap: true,
    platform: 'node',
    target: 'node18',
    external: [
        '@aws-sdk/client-ssm',
        '@aws-sdk/client-iam',
        '@aws-sdk/client-sqs',
        '@aws-sdk/client-secrets-manager'
    ],
    alias: {
        '@audit/shared': sharedPath
    },
    minify: true
};

// Build ESM
await esbuild.build({
    ...baseConfig,
    format: 'esm',
    outfile: 'dist/index.esm.js'
});

// Build CJS
await esbuild.build({
    ...baseConfig,
    format: 'cjs',
    outfile: 'dist/index.cjs.js'
});

const { execSync } = await import('child_process');

try {
    execSync(
        'pnpm tsc --emitDeclarationOnly --outDir dist/types -p tsconfig.build.json',
        {
            stdio: 'inherit'
        }
    );
    execSync('pnpm tsc-alias --outDir dist/types -p tsconfig.build.json', {
        stdio: 'inherit'
    });
} catch (error) {
    console.warn('TypeScript declaration generation failed:', error.message);
}
