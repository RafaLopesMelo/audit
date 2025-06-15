import { InputAuditReportDTO } from './dto';
import { Translator } from './translator';
import { Athena } from '@audit/shared/athena';
import { AuditRecordDTO } from '@audit/shared/dto/audit.dto';

import dayjs from 'dayjs';

export const handle = async (input: InputAuditReportDTO) => {
    const limit = getLimit(input.limit);
    const offset = getOffset(input.offset);

    let where = '';
    if (input.search) {
        where = `AND (entity.title = '${input.search}' OR author.name = '${input.search}' OR author.email = '${input.search}')`;
    }

    const ago30Days = dayjs().subtract(30, 'd').toISOString().slice(0, 10);

    const db = new Athena();

    const [result, [totalCount]] = await Promise.all([
        db.query<AuditRecordDTO>(
            `
            SELECT 
                id, 
                kind, 
                origin, 
                occurredAt, 
                CAST(description AS JSON) AS description, 
                CAST(entity AS JSON) AS entity,
                CAST(author AS JSON) AS author,
                CAST(agent AS JSON) AS agent,
                CAST(fields AS JSON) AS fields,
                CAST(metadata AS JSON) AS metadata
            FROM records 
            WHERE dt >= DATE '${ago30Days}' ${where}
            OFFSET 0
            LIMIT 10
            `
        ),
        db.query<{ count: number }>(
            `
            SELECT COUNT(*) AS count FROM ${Athena.TABLE}
            WHERE dt >= DATE '${ago30Days}' ${where}
            `
        )
    ]);

    const translator = new Translator(input.lang);

    const data = [];
    for (const r of result) {
        const translation = await translator.translate([
            r.entity.kind.label,
            r.description.template,
            ...r.fields.flatMap((f) => {
                return [
                    f.label,
                    f.before?.label as string,
                    f.after?.label as string
                ];
            })
        ]);

        data.push({
            id: r.id,
            kind: r.kind,
            occurredAt: r.occurredAt,
            description: {
                template: translation[r.description.template],
                values: r.description.values
            },
            entity: {
                id: r.entity.id,
                title: r.entity.title,
                url: r.entity.url,
                kind: {
                    kind: r.entity.kind.kind,
                    label: translation[r.entity.kind.label]
                }
            },
            origin: r.origin,
            author: r.author
                ? {
                      id: r.author.id,
                      name: r.author.name,
                      email: r.author.email,
                      roles: r.author.roles,
                      ip: r.author.ip,
                      userAgent: r.author.userAgent
                  }
                : null,
            agent: r.agent
                ? {
                      id: r.agent.id,
                      name: r.agent.name
                  }
                : null,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            fields: r.fields.map((f: any) => ({
                name: f.name,
                label: translation[f.label],
                before: f.before
                    ? {
                          label: translation[f.before.label],
                          value: f.before.value
                      }
                    : null,
                after: f.after
                    ? {
                          label: translation[f.after.label],
                          value: f.after.value
                      }
                    : null
            })),
            metadata: r.metadata
        });
    }

    await translator.destroy();

    const r = {
        metadata: {
            limit,
            offset,
            totalCount,
            hasMore: Number(totalCount.count) > limit + offset
        },
        data
    };

    return r;
};

function getLimit(limit?: number) {
    const DEFAULT_LIMIT = 10;

    if (!limit) {
        return DEFAULT_LIMIT;
    }

    if (limit > 100) {
        return DEFAULT_LIMIT;
    }

    return limit;
}

function getOffset(offset?: number) {
    const DEFAULT_OFFSET = 0;

    if (!offset || offset < 0) {
        return DEFAULT_OFFSET;
    }

    return offset;
}
