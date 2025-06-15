import { randomUUID } from 'node:crypto';

import { AuditRecordDTO } from '@audit/shared/dto/audit.dto';
import { Either, left, right } from '@audit/shared/either';
import { getQueueParameterName } from './config';
import { AuditInternalError } from './errors';

import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';
import { IAMClient, ListAccountAliasesCommand } from '@aws-sdk/client-iam';

export class AuditClient {
    private readonly queue: string | null = null;
    private readonly client: SQSClient = new SQSClient({});

    private constructor(queue: string | null) {
        if (!queue) {
            console.warn(
                'development environment identified, skipping audit log registering...'
            );
            return;
        }
        this.queue = queue;
    }

    public static async create() {
        const q = await AuditClient.discover();
        return new AuditClient(q);
    }

    public static async discover(): Promise<string | null> {
        try {
            const iam = new IAMClient({});
            const { AccountAliases } = await iam.send(
                new ListAccountAliasesCommand({ MaxItems: 1 })
            );

            if (!AccountAliases?.length) {
                return null;
            }

            const env = AccountAliases[0];

            const ssm = new SSMClient({});
            const region = await ssm.config.region();

            const { Parameter } = await ssm.send(
                new GetParameterCommand({
                    Name: getQueueParameterName(env, region),
                    WithDecryption: false
                })
            );

            if (!Parameter?.Value) {
                return null;
            }

            const secrets = JSON.parse(Parameter.Value);

            return secrets.QUEUE_URL || null;
        } catch {
            return null;
        }
    }

    public async send(
        record: AuditRecordDTO
    ): Promise<Either<AuditInternalError, null>> {
        try {
            if (!this.queue) {
                return right(null);
            }

            const cmd = new SendMessageCommand({
                QueueUrl: this.queue,
                MessageBody: JSON.stringify(record),
                MessageAttributes: {
                    id: {
                        DataType: 'String',
                        StringValue: randomUUID()
                    }
                },
                MessageGroupId: randomUUID(),
                MessageDeduplicationId: randomUUID()
            });

            await this.client.send(cmd);

            return right(null);
        } catch {
            return left(new AuditInternalError());
        }
    }
}
