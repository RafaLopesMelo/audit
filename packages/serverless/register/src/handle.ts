import zlib from 'node:zlib';
import { promisify } from 'node:util';

import { Description } from '@audit/shared/domain/entities/description/description.entity';
import { AuditRecord } from '@audit/shared/domain/entities/record/audit-record.entity';
import { Either, left, right } from '@audit/shared/either';
import { Entity } from '@audit/shared/domain/entities/entity/entity.entity';
import { Author } from '@audit/shared/domain/entities/author/author.entity';
import { Agent } from '@audit/shared/domain/entities/agent/agent.entity';
import { Storage } from '@audit/shared/storage';
import {
    Field,
    FieldValue
} from '@audit/shared/domain/entities/field/field.entity';
import { Origin } from '@audit/shared/domain/entities/origin/origin.entity';
import { AuditRecordDTO } from '@audit/shared/dto/audit.dto';
import { Kind } from '@audit/shared/domain/entities/kind/kind.entity';
import { EmptyFieldValueError } from '@audit/shared/domain/errors/field/empty-value.error';
import { EmptyFieldLabelError } from '@audit/shared/domain/errors/field/empty-label.error';

import { ulid } from 'ulid';
import { Athena } from '@audit/shared/athena';

const gzip = promisify(zlib.gzip);
export const handle = async (input: AuditRecordDTO) => {
    const desc = Description.create({
        template: input.description.template,
        values: input.description.values
    });

    if (desc.isLeft()) {
        return left(desc.value);
    }

    const entityKind = Kind.create({
        kind: input.entity.kind.kind,
        label: input.entity.kind.label
    });

    if (entityKind.isLeft()) {
        return left(entityKind.value);
    }

    const entity = Entity.create({
        id: input.entity.id,
        title: input.entity.title,
        url: input.entity.url,
        kind: entityKind.value
    });

    if (entity.isLeft()) {
        return left(entity.value);
    }

    let author: Author | null = null;
    if (input.author) {
        const authorResult = Author.create({
            id: input.author.id,
            name: input.author.name,
            email: input.author.email,
            roles: input.author.roles,
            ip: input.author.ip,
            userAgent: input.author.userAgent
        });

        if (authorResult.isLeft()) {
            return left(authorResult.value);
        }

        author = authorResult.value;
    }

    let agent: Agent | null = null;
    if (input.agent) {
        const agentResult = Agent.create({
            id: input.agent.id,
            name: input.agent.name
        });

        if (agentResult.isLeft()) {
            return left(agentResult.value);
        }

        agent = agentResult.value;
    }

    const origin = Origin.create(input.origin);

    if (origin.isLeft()) {
        return left(origin.value);
    }

    const fields = buildFields(input);
    if (fields.isLeft()) {
        return left(fields.value);
    }

    const record = AuditRecord.create({
        kind: input.kind,
        description: desc.value,
        entity: entity.value,
        author,
        agent,
        origin: input.origin,
        occurredAt: new Date(input.occurredAt),
        fields: fields.value,
        metadata: input.metadata
    });

    if (record.isLeft()) {
        return left(record.value);
    }

    await saveToS3(record.value);

    return right(null);
};

function buildFields(
    input: AuditRecordDTO
): Either<EmptyFieldValueError | EmptyFieldLabelError, Field[]> {
    const fields: Field[] = [];
    if (input.fields && input.fields.length > 0) {
        for (const f of input.fields) {
            let before: FieldValue | null = null;
            if (f.before) {
                const b = FieldValue.create({
                    value: f.before.value,
                    label: f.before.label
                });

                if (b.isLeft()) {
                    return left(b.value);
                }

                before = b.value;
            }

            let after: FieldValue | null = null;
            if (f.after) {
                const a = FieldValue.create({
                    value: f.after.value,
                    label: f.after.label
                });

                if (a.isLeft()) {
                    return left(a.value);
                }

                after = a.value;
            }

            const field = Field.create({
                name: f.name,
                label: f.label,
                before,
                after
            });

            if (field.isLeft()) {
                return left(field.value);
            }

            fields.push(field.value);
        }
    }

    return right(fields);
}

function generateID(): string {
    return `audit_${ulid()}`;
}

async function saveToS3(record: AuditRecord) {
    const d = record.toData();

    const json = {
        id: generateID(),
        entity: {
            id: d.entity.id,
            title: d.entity.title,
            kind: d.entity.kind,
            url: d.entity.url
        },
        author: d.author
            ? {
                  id: d.author.id,
                  name: d.author.name,
                  email: d.author.email,
                  roles: d.author.roles,
                  ip: d.author.ip,
                  userAgent: d.author?.userAgent
              }
            : null,
        description: {
            template: d.description.template,
            values: d.description.values
        },
        fields: d.fields.map((f) => ({
            name: f.name,
            label: f.label,
            before: f.before
                ? {
                      label: f.before.label,
                      value: f.before.value
                  }
                : null,
            after: f.after
                ? {
                      label: f.after.label,
                      value: f.after.value
                  }
                : null
        })),
        agent: d.agent
            ? {
                  id: d.agent.id,
                  name: d.agent.name
              }
            : null,
        occurredAt: d.occurredAt,
        origin: d.origin,
        kind: d.kind,
        metadata: d.metadata || {}
    };

    const date = json.occurredAt.toISOString().slice(0, 10);

    const storage = new Storage();
    await storage.upload(
        `database/records/dt=${date}/${json.id}.json.gz`,
        await gzip(JSON.stringify(json) + '\n'),
        {}
    );

    const athena = new Athena();
    await athena.repair(Athena.TABLE, [['dt', date]]);
}
