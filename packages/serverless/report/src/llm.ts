import { GoogleGenAI } from '@google/genai';

export class LLM {
    private static instance: LLM;
    private client: GoogleGenAI;

    private constructor() {
        const credentials = process.env.GOOGLE_CREDENTIALS_JSON;
        if (!credentials) {
            throw new Error(
                'Missing GOOGLE_CREDENTIALS_JSON environment variable'
            );
        }

        this.client = new GoogleGenAI({
            vertexai: true,
            googleAuthOptions: {
                credentials: JSON.parse(credentials)
            }
        });
    }

    public static getInstance(): LLM {
        if (!LLM.instance) {
            LLM.instance = new LLM();
        }

        return LLM.instance;
    }

    public async ask(prompt: string): Promise<string> {
        const r = await this.client.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: prompt.trim(),
            config: {
                responseMimeType: 'application/json'
            }
        });

        return r.text!;
    }
}
