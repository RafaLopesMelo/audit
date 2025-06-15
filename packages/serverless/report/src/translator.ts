import zlib from 'node:zlib';
import { readdir, readFile } from 'node:fs/promises';
import { promisify } from 'node:util';

import { Storage } from '@audit/shared/storage';
import { LLM } from './llm';

type CacheIndexedByLang = Map<string, Record<string, string>>;

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);
export class Translator {
    private static llm: LLM;
    private static readonly cache: CacheIndexedByLang = new Map();
    private static readonly storage = new Storage();

    public constructor(private readonly lang: string) {
        if (!Translator.llm) {
            Translator.llm = LLM.getInstance();
        }
    }

    public async translate(texts: string[]) {
        const cache = await Translator.loadCache(this.lang);

        const obj: Record<string, string> = {};
        const missing: string[] = [];

        for (const t of texts) {
            if (!t) {
                continue;
            }

            if (cache[t]) {
                obj[t] = cache[t];
                continue;
            }

            missing.push(t);
        }

        if (missing.length === 0) {
            return obj;
        }

        const r = await Translator.llm.ask(`
            Please follow the instructions below precisely:

            **Translation Instructions:**
            - **Do NOT translate any content enclosed in double curly braces (e.g., {{PLACEHOLDER}}). Leave them exactly as they are.**
            - **Respond with a single JSON object. Each key should be the original text, and each value should be its accurate translation.**

            Translate the following texts to ${this.lang}, strictly adhering to the instructions above:

            ${missing.join('\n')}
        `);

        console.log(JSON.stringify(missing));

        try {
            const json = JSON.parse(r);
            Object.assign(cache, json);
            return obj;
        } catch (e) {
            console.error('Error parsing translation: ' + r);
            throw e;
        }
    }

    private static getCacheKey(lang: string) {
        return `i18n/${lang}.json`;
    }

    private static async loadCache(lang: string) {
        if (Translator.cache.get(lang)) {
            return Translator.cache.get(lang)!;
        }

        const [remote, local] = await Promise.all([
            Translator.loadRemoteCache(lang),
            Translator.loadLocalCache(lang)
        ]);

        const cache = { ...remote, ...local };

        Translator.cache.set(lang, cache);
        return Translator.cache.get(lang)!;
    }

    private static async loadLocalCache(
        lang: string
    ): Promise<Record<string, string>> {
        try {
            console.log('RMELO', await readdir(`${process.cwd()}/`));
            console.log('RMELO 2', await readdir(`${process.cwd()}/public`));
            const local = await readFile(
                `${process.cwd()}/public/${Translator.getCacheKey(lang)}`
            );

            console.log(local.toString('utf8'));
            return JSON.parse(local.toString('utf8'));
        } catch {
            console.error('file not found');
            return {};
        }
    }

    private static async loadRemoteCache(
        lang: string
    ): Promise<Record<string, string>> {
        const cached = Translator.cache.get(lang);
        if (cached) {
            return cached;
        }

        const remote = await Translator.storage.load(
            Translator.getCacheKey(lang)
        );

        if (!remote) {
            return {};
        }

        const c = await gunzip(remote);
        return JSON.parse(c.toString());
    }

    private static async saveCache(lang: string) {
        const cache = Translator.cache.get(lang);

        if (!cache) {
            return;
        }

        await Translator.storage.upload(
            Translator.getCacheKey(lang),
            await gzip(JSON.stringify(cache) + '\n'),
            {}
        );
    }

    public async destroy() {
        await Translator.saveCache(this.lang);
    }
}
