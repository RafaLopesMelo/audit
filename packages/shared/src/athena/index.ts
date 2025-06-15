import {
    AthenaClient,
    StartQueryExecutionCommand,
    GetQueryExecutionCommand,
    GetQueryResultsCommand
} from '@aws-sdk/client-athena';
import {
    EntityNotFoundException,
    GetPartitionCommand,
    GlueClient
} from '@aws-sdk/client-glue';

const athena = new AthenaClient({});
const glue = new GlueClient({});
export class Athena {
    public static TABLE = 'records';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public async query<T = Record<string, any>>(q: string) {
        const cmd = new StartQueryExecutionCommand({
            QueryString: q.trim(),
            QueryExecutionContext: {
                Database: process.env.AWS_ATHENA_DATABASE_NAME
            },
            WorkGroup: process.env.AWS_ATHENA_WORKGROUP
        });

        const r = await athena.send(cmd);
        const opID = r.QueryExecutionId;

        while (true) {
            await new Promise((r) => setTimeout(r, 1000));

            const statusCmd = new GetQueryExecutionCommand({
                QueryExecutionId: opID
            });

            const r = await athena.send(statusCmd);
            const state = r.QueryExecution?.Status?.State || '';

            if (['FAILED', 'CANCELLED'].includes(state)) {
                console.error(JSON.stringify(r.QueryExecution));
                throw new Error('query failed');
            }

            if (['RUNNING', 'QUEUED'].includes(state)) {
                continue;
            }

            break;
        }

        const resultCmd = new GetQueryResultsCommand({
            QueryExecutionId: opID
        });

        const result = await athena.send(resultCmd);
        const rows = result.ResultSet?.Rows;

        if (!rows) {
            throw new Error('Invalid query result');
        }

        const headers = rows[0]?.Data?.map((d) => d.VarCharValue) || [];

        const data = rows.slice(1).map((row) => {
            const obj = {} as T;

            row.Data?.forEach((cell, i) => {
                const value = cell.VarCharValue ?? null;
                const field = headers[i] as keyof typeof obj;

                try {
                    obj[field] = JSON.parse(value || '');
                } catch {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    obj[field] = value as any;
                }
            });

            return obj;
        });

        return data;
    }

    public async repair(table: string, partitions: string[][]) {
        const skipRepair = await this.partitionExists(table, partitions);

        if (skipRepair) {
            return;
        }

        const stmt = partitions.map((p) => `${p[0]}='${p[1]}'`).join(',');
        await this.query(`
            ALTER TABLE ${table} ADD IF NOT EXISTS PARTITION (${stmt})
        `);
    }

    private async partitionExists(table: string, partitions: string[][]) {
        const database = process.env.AWS_ATHENA_DATABASE_NAME;

        try {
            const command = new GetPartitionCommand({
                DatabaseName: database,
                TableName: table,
                PartitionValues: partitions.map((p) => p[1])
            });

            await glue.send(command);
            return true;
        } catch (err) {
            if (err instanceof EntityNotFoundException) {
                return false;
            }
            throw err;
        }
    }
}
