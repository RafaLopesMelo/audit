import { Either, left, right } from '@audit/shared/either';
import { Description } from '../description/description.entity';
import { Entity } from '../entity/entity.entity';
import { Author } from '../author/author.entity';
import { Agent } from '../agent/agent.entity';
import { OriginKind } from '../origin/origin.entity';
import { Field } from '../field/field.entity';
import { InvalidAuditRecordKindError } from '../../errors/record/invalid-kind.error';
import { InvalidAuditRecordOccurredAtError } from '../../errors/record/invalid-occurred-at.error';
import { InvalidAuditRecordMetadataError } from '../../errors/record/invalid-metadata.error';

export type OperationKind = 'CREATE' | 'UPDATE' | 'DELETE';

export type AuditRecordProps = {
    kind: OperationKind;
    description: Description;
    entity: Entity;
    author: Author | null;
    agent: Agent | null;
    origin: OriginKind;
    occurredAt: Date;
    fields: Field[];
    metadata?: Record<string, string>;
};

export class AuditRecord {
    private constructor(private readonly props: AuditRecordProps) {}

    public static create(
        props: Partial<AuditRecordProps>
    ): Either<
        | InvalidAuditRecordKindError
        | InvalidAuditRecordOccurredAtError
        | InvalidAuditRecordMetadataError,
        AuditRecord
    > {
        const validKinds: OperationKind[] = ['CREATE', 'UPDATE', 'DELETE'];
        if (props.kind && !validKinds.includes(props.kind)) {
            return left(new InvalidAuditRecordKindError());
        }

        if (
            props.occurredAt &&
            (!(props.occurredAt instanceof Date) ||
                isNaN(props.occurredAt.getTime()))
        ) {
            return left(new InvalidAuditRecordOccurredAtError());
        }

        if (props.metadata && typeof props.metadata !== 'object') {
            return left(new InvalidAuditRecordMetadataError());
        }

        // Set default values for optional properties
        const recordProps: AuditRecordProps = {
            kind: props.kind || 'CREATE',
            description: props.description!,
            entity: props.entity!,
            author: props.author || null,
            agent: props.agent || null,
            origin: props.origin || 'USER',
            occurredAt: props.occurredAt || new Date(),
            fields: props.fields || [],
            metadata: props.metadata
        };

        const r = new AuditRecord(recordProps);
        return right(r);
    }

    public toData() {
        return {
            kind: this.props.kind,
            description: this.props.description.toData(),
            entity: this.props.entity.toData(),
            author: this.props.author ? this.props.author.toData() : null,
            agent: this.props.agent ? this.props.agent.toData() : null,
            origin: this.props.origin,
            occurredAt: this.props.occurredAt,
            fields: this.props.fields.map((field) => field.toData()),
            ...(this.props.metadata && { metadata: this.props.metadata })
        };
    }
}
