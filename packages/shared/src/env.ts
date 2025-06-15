import { Logger } from './logger';

import {
    GetSecretValueCommand,
    SecretsManagerClient
} from '@aws-sdk/client-secrets-manager';

export class Env {
    private static readonly logger = Logger('Env');

    public static async load() {
        if (process.env.ENV === 'production') {
            await this.loadProd();
            return;
        }

        this.loadDev();
    }

    private static loadDev() {
        this.logger.log('Loading development environment variables...');

        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const dotenv = require('dotenv');
        dotenv.config();

        this.logger.log(
            'Development environment variables loaded successfully!'
        );
    }

    private static async loadProd() {
        this.logger.log('Loading production environment variables...');

        const client = new SecretsManagerClient();
        const command = new GetSecretValueCommand({
            SecretId: process.env.AWS_SECRET_ID
        });

        const result = await client.send(command);
        if (!result.SecretString) {
            throw new Error(
                'Error while reading production environment variables'
            );
        }

        const json = JSON.parse(result.SecretString);

        for (const [key, value] of Object.entries(json)) {
            process.env[key] = String(value);
        }

        this.logger.log(
            'Production environment variables loaded successfully!'
        );
    }
}
