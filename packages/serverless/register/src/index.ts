import { Logger } from '@audit/shared/logger';
import { Env } from '@audit/shared/env';
import { Either, left, right } from '@audit/shared/either';
import { handle } from './handle';

import { SQSEvent, SQSBatchResponse } from 'aws-lambda';

const logger = Logger('Entrypoint');

export const handler = async (event: SQSEvent): Promise<SQSBatchResponse> => {
    await Env.load();

    const r: Either<string, void>[] = await Promise.all(
        event.Records.map(async (record) => {
            try {
                const id = record.messageAttributes.id.stringValue;

                logger.log(`Processing record ${id}...`);

                const r = await handle(JSON.parse(record.body));
                if (r.isLeft()) {
                    logger.error(
                        `Error processing record with ID ${id}: ${JSON.stringify(r.value)}`
                    );
                    return left(record.messageId);
                }

                logger.log(`Record ${id} processed successfully!`);
                return right(undefined);
            } catch (error) {
                if (error instanceof Error) {
                    logger.error('An error occured: ' + error.message);
                    logger.error(error.stack as string);
                }

                return left(record.messageId);
            }
        })
    );

    return {
        batchItemFailures: r
            .filter((r) => r.isLeft())
            .map((r) => ({ itemIdentifier: r.value }))
    };
};
