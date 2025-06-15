import { Env } from '@audit/shared/env';
import { handle } from './handle';

import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';

export const handler = async (
    event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
    try {
        await Env.load();

        const params = event.queryStringParameters;

        if (!params?.lang) {
            return response(400, {
                message: 'Missing language parameter'
            });
        }

        const data = await handle({
            lang: params.lang,
            search: params.search,
            limit: params.limit ? Number(params.limit) : undefined,
            offset: params.offset ? Number(params.offset) : undefined
        });

        return response(200, data);
    } catch (e) {
        console.error(e);
        return response(500, { message: 'Internal Server Error' });
    }
};

function response(
    status: number,
    body: Record<string, unknown>
): APIGatewayProxyResultV2 {
    return {
        statusCode: status,
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    };
}
