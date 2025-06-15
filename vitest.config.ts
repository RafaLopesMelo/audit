import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    test: {
        projects: [
            {
                test: {
                    name: { label: 'library', color: 'green' },
                    include: ['packages/sdk/**/*.spec.ts']
                },
                extends: true
            },
            {
                test: {
                    name: { label: 'register', color: 'cyan' },
                    include: ['packages/serverless/**/*.spec.ts']
                },
                extends: true
            },
            {
                test: {
                    name: { label: 'report', color: 'cyan' },
                    include: ['packages/serverless/report/**/*.spec.ts']
                },
                extends: true
            },
            {
                test: {
                    name: { label: 'shared', color: 'magenta' },
                    include: ['packages/shared/**/*.spec.ts']
                },
                extends: true
            }
        ],
        globals: true
    },
    plugins: [tsconfigPaths()]
});
