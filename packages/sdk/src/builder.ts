import {
    AuditKind,
    AuditRecordDTO,
    FieldValueDTO
} from '@audit/shared/dto/audit.dto';
import { AuditValidationError, AuditInternalError } from './errors';
import { AuditClient } from './client';
import { Either, left, right } from '@audit/shared/either';

import { Description } from '@audit/shared/domain/entities/description/description.entity';
import { AuditRecord } from '@audit/shared/domain/entities/record/audit-record.entity';
import { Entity } from '@audit/shared/domain/entities/entity/entity.entity';
import { Author } from '@audit/shared/domain/entities/author/author.entity';
import { Agent } from '@audit/shared/domain/entities/agent/agent.entity';
import {
    Field,
    FieldValue
} from '@audit/shared/domain/entities/field/field.entity';
import {
    Origin,
    OriginKind
} from '@audit/shared/domain/entities/origin/origin.entity';
import { Kind } from '@audit/shared/domain/entities/kind/kind.entity';
import { UnknownError } from '@audit/shared/domain/errors';

/**
 * Interface representing the step for setting the audit operation kind
 * This is typically the first step when using system-triggered audit logs,
 * or the second step after setting the author for user-triggered logs.
 */
export interface KindStep {
    /**
     * Sets the kind of audit operation
     * @param kind The kind of operation (CREATE, UPDATE, DELETE)
     * @returns The next step in the builder pattern
     */
    setKind(kind: AuditKind): DescriptionStep;
}

/**
 * Interface representing the step for setting the description of the audit operation
 * This step comes after setting the kind of operation and describes what happened
 * using a template with placeholders.
 */
export interface DescriptionStep {
    /**
     * Sets the description for the audit record
     * @param template Template string with placeholders like {{NAME}}
     * @param values Values to replace placeholders in the template
     * @returns The next step in the builder pattern
     */
    setDescription(
        template: string,
        values: Record<string, string>
    ): EntityStep;
}

/**
 * Interface representing the step for setting the entity that is being audited
 * This step comes after setting the description and identifies the specific object
 * that the audit log is about.
 */
export interface EntityStep {
    /**
     * Sets the entity information for the audit record
     * @param params Entity parameters
     * @param params.id Entity ID
     * @param params.title Entity title/name
     * @param params.url URL where the entity can be accessed
     * @param params.kind Entity kind information
     * @param params.kind.id Entity kind identifier
     * @param params.kind.label Entity kind human-readable label
     * @returns The next step in the builder pattern
     */
    setEntity(params: {
        id: string;
        title: string;
        url: string;
        kind: {
            id: string;
            label: string;
        };
    }): BuildStep;
}

/**
 * Interface representing the step for setting the author of the audit operation
 * This is the first step when creating user-triggered audit logs and provides
 * information about who performed the action being audited.
 */
export interface AuthorStep {
    /**
     * Sets a user as the author of the audit record
     * @param params Parameters for the user as author
     * @param params.id User ID
     * @param params.name User name
     * @param params.email User email
     * @param params.roles User roles
     * @param params.ip IP address of the user
     * @param params.userAgent User agent string
     * @returns The next step in the builder pattern
     */
    setAuthor(params: {
        id: string;
        name: string;
        email: string;
        roles: string[];
        ip: string;
        userAgent: string;
    }): KindStep;
}

/**
 * Interface representing the step for setting the AI assistant as the author
 * This is the first step when creating AI-triggered audit logs and provides
 * information about the AI assistant that performed the action being audited.
 */
export interface AIAuthorStep {
    /**
     * Sets an AI assistant as the author of the audit record
     * @param params Parameters for the AI assistant as author
     * @param params.id AI assistant ID
     * @param params.name AI assistant name
     * @returns The next step in the builder pattern
     */
    setAgent(params: { id: string; name: string }): KindStep;
}

/**
 * Interface representing the final building step of the audit record
 * This step comes after setting the entity and allows adding fields that were changed,
 * setting metadata, and finally sending the audit record.
 */
export interface BuildStep {
    /**
     * Adds a field that was changed in the operation
     * @param params Parameters for adding a field
     * @param params.name Field name (machine-readable)
     * @param params.label Field label (human-readable)
     * @param params.before Field value before the operation
     * @param params.after Field value after the operation
     * @returns This build step for method chaining
     */
    addField(params: {
        name: string;
        label: string;
        before: FieldValueDTO | null;
        after: FieldValueDTO | null;
    }): BuildStep;

    /**
     * Adds metadata to the audit record
     * @param metadata Additional metadata as key-value pairs
     * @returns This build step for method chaining
     */
    setMetadata(metadata: Record<string, string>): BuildStep;

    /**
     * Builds the audit record and sends it using the associated client
     * @returns Promise that resolves to Either an error or success (null)
     */
    send(): Promise<Either<AuditValidationError | AuditInternalError, null>>;
}

/**
 * Step Builder implementation for creating audit records
 * Ensures all required fields are set before building
 */
export class AuditRecordBuilder
    implements
        KindStep,
        DescriptionStep,
        EntityStep,
        AuthorStep,
        AIAuthorStep,
        BuildStep
{
    private record: Partial<AuditRecordDTO> = {
        author: null,
        agent: null
    };
    private static client: AuditClient;

    private constructor(origin: AuditRecordDTO['origin']) {
        this.record.origin = origin;

        this.record.fields = [];
        this.record.occurredAt = new Date();
    }

    /**
     * Create a new AuditRecordBuilder instance for user-triggered audit logs
     * @returns A new builder instance starting with AuthorStep
     */
    public static fromUser(): AuthorStep {
        return new AuditRecordBuilder('USER');
    }

    /**
     * Create a new AuditRecordBuilder instance for system-triggered audit logs
     * @returns A new builder instance starting with KindStep
     */
    public static fromSystem(): KindStep {
        return new AuditRecordBuilder('SYSTEM');
    }

    /**
     * Create a new AuditRecordBuilder instance for AI-triggered audit logs
     * @returns A new builder instance starting with AIAuthorStep
     */
    public static fromAI(): AIAuthorStep {
        return new AuditRecordBuilder('AI');
    }

    /**
     * Sets the kind of audit operation
     * @param kind The kind of operation (CREATE, UPDATE, DELETE)
     * @returns The next step in the builder pattern (DescriptionStep)
     */
    public setKind(kind: AuditKind): DescriptionStep {
        this.record.kind = kind;
        return this;
    }

    /**
     * Sets the description for the audit record
     * @param template Template string with placeholders like {{NAME}}
     * @param values Values to replace placeholders in the template
     * @returns The next step in the builder pattern (EntityStep)
     * @example
     * builder.setDescription(
     *   "User {{userName}} updated the {{entityType}} {{entityName}}",
     *   {
     *     userName: "John Doe",
     *     entityType: "course",
     *     entityName: "Introduction to TypeScript"
     *   }
     * )
     */
    public setDescription(
        template: string,
        values: Record<string, string>
    ): EntityStep {
        this.record.description = { template, values };
        return this;
    }

    /**
     * Sets the entity information for the audit record
     * @param params Entity parameters
     * @param params.id Entity ID
     * @param params.title Entity instance title/name
     * @param params.url URL where the entity can be accessed
     * @param params.kind Entity kind information
     * @param params.kind.id Entity kind identifier
     * @param params.kind.label Entity kind human-readable label
     * @returns The next step in the builder pattern (BuildStep)
     * @example
     * builder.setEntity({
     *   id: "course-123",
     *   title: "Introduction to TypeScript",
     *   url: "/courses/123",
     *   kind: {
     *     id: "COURSE",
     *     label: "Course"
     *   }
     * })
     */
    public setEntity(params: {
        id: string;
        title: string;
        url: string;
        kind: {
            id: string;
            label: string;
        };
    }): BuildStep {
        this.record.entity = {
            id: params.id,
            title: params.title,
            url: params.url,
            kind: {
                kind: params.kind.id,
                label: params.kind.label
            }
        };
        return this;
    }

    /**
     * Sets a user as the author of the audit record
     * @param params Parameters for the user as author
     * @param params.id User ID
     * @param params.name User name
     * @param params.email User email
     * @param params.roles User roles/permissions
     * @param params.ip IP address of the user
     * @param params.userAgent User agent string of the browser/client
     * @returns The next step in the builder pattern (KindStep)
     * @example
     * builder.setAuthor({
     *   id: "user-123",
     *   name: "John Doe",
     *   email: "john@example.com",
     *   roles: ["PROFESSOR", "ADMIN"],
     *   ip: "192.168.1.1",
     *   userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
     * })
     */
    public setAuthor(params: {
        id: string;
        name: string;
        email: string;
        roles: string[];
        ip: string;
        userAgent: string;
    }): KindStep {
        this.record.author = {
            id: params.id,
            name: params.name,
            email: params.email,
            roles: params.roles,
            ip: params.ip,
            userAgent: params.userAgent
        };
        return this;
    }

    /**
     * Sets an AI assistant as the agent of the audit record
     * @param params Parameters for the AI assistant as author
     * @param params.id AI assistant ID or identifier
     * @param params.name AI assistant name (e.g., "Claude", "GPT-4")
     * @returns The next step in the builder pattern (KindStep)
     * @example
     * builder.setAgent({
     *   id: "xxxxx-xxxxxx-xxxxxx-xxxxx",
     *   name: "Claude",
     * })
     */
    public setAgent(params: { id: string; name: string }): KindStep {
        this.record.agent = {
            id: params.id,
            name: params.name
        };
        return this;
    }

    /**
     * Adds a field that was changed in the operation
     * @param params Parameters for adding a field
     * @param params.name Field name (machine-readable)
     * @param params.label Field label (human-readable)
     * @param params.before Field value before the operation
     * @param params.after Field value after the operation
     * @returns This build step for method chaining
     * @example
     * builder.addField({
     *   name: "title",
     *   label: "Title",
     *   before: { value: "Intro to TypeScript", label: "Intro to TypeScript" },
     *   after: { value: "Introduction to TypeScript", label: "Introduction to TypeScript" }
     * })
     */
    public addField(params: {
        name: string;
        label: string;
        before: FieldValueDTO | null;
        after: FieldValueDTO | null;
    }): BuildStep {
        this.record.fields = this.record.fields || [];
        this.record.fields.push({
            name: params.name,
            label: params.label,
            before: params.before,
            after: params.after
        });
        return this;
    }

    /**
     * Adds metadata to the audit record
     * @param metadata Additional metadata as key-value pairs
     * @returns This build step for method chaining
     * @example
     * builder.setMetadata({
     *   browser: "Chrome",
     *   platform: "Windows",
     *   organizationId: "org-456"
     * })
     */
    public setMetadata(metadata: Record<string, string>): BuildStep {
        this.record.metadata = metadata;
        return this;
    }

    /**
     * Builds the audit record and validates it
     * Internal method called by send() to create the final record
     * @returns Either a validation error or the valid audit record
     */
    public build(): Either<AuditValidationError, AuditRecordDTO> {
        const r = this.record as AuditRecordDTO;

        const result = AuditRecordBuilder.validateRequiredFields(r);

        if (result.isLeft()) {
            return left(result.value);
        }

        return right(r);
    }

    /**
     * Builds the audit record and sends it to the audit service
     * Final step in the builder pattern that validates and submits the record
     * @returns Promise that resolves to Either an error or success (null)
     * @example
     * const result = await builder.send();
     *
     * if (result.isLeft()) {
     *   console.error(`Error sending audit record: ${result.value.reason}`);
     * } else {
     *   console.log("Audit record sent successfully");
     * }
     */
    public async send(): Promise<
        Either<AuditValidationError | AuditInternalError, null>
    > {
        try {
            if (!AuditRecordBuilder.client) {
                AuditRecordBuilder.client = await AuditClient.create();
            }

            const r = this.build();

            if (r.isLeft()) {
                return left(r.value);
            }

            return AuditRecordBuilder.client.send(r.value);
        } catch {
            return left(new AuditInternalError());
        }
    }

    /**
     * Validates that all required fields are present
     * @returns Either a AuditValidationError if fields are missing or right(null) if validation passes
     */
    private static validateRequiredFields(
        record: AuditRecordDTO
    ): Either<AuditValidationError, null> {
        try {
            const desc = Description.create({
                template: record.description.template,
                values: record.description.values
            });

            if (desc.isLeft()) {
                return left(AuditValidationError.from(desc.value));
            }

            const entityKind = Kind.create({
                kind: record.entity.kind.kind,
                label: record.entity.kind.label
            });

            if (entityKind.isLeft()) {
                return left(AuditValidationError.from(entityKind.value));
            }

            const entity = Entity.create({
                id: record.entity.id,
                title: record.entity.title,
                url: record.entity.url,
                kind: entityKind.value
            });

            if (entity.isLeft()) {
                return left(AuditValidationError.from(entity.value));
            }

            let author: Author | null = null;
            if (record.author) {
                const authorResult = Author.create({
                    id: record.author.id,
                    name: record.author.name,
                    email: record.author.email,
                    roles: record.author.roles,
                    ip: record.author.ip,
                    userAgent: record.author.userAgent
                });

                if (authorResult.isLeft()) {
                    return left(AuditValidationError.from(authorResult.value));
                }

                author = authorResult.value;
            }

            let agent: Agent | null = null;
            if (record.agent) {
                const agentResult = Agent.create({
                    id: record.agent.id,
                    name: record.agent.name
                });

                if (agentResult.isLeft()) {
                    return left(AuditValidationError.from(agentResult.value));
                }

                agent = agentResult.value;
            }

            const origin = Origin.create(record.origin);

            if (origin.isLeft()) {
                return left(origin.value);
            }

            // Validate origin-author/agent consistency
            const originValidation =
                AuditRecordBuilder.validateOriginConsistency(
                    record.origin,
                    author,
                    agent
                );

            if (originValidation.isLeft()) {
                return left(originValidation.value);
            }

            const fields: Field[] = [];
            for (const f of record.fields) {
                let before: FieldValue | null = null;
                if (f.before) {
                    const b = FieldValue.create({
                        value: f.before.value,
                        label: f.before.label
                    });

                    if (b.isLeft()) {
                        return left(AuditValidationError.from(b.value));
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
                        return left(AuditValidationError.from(a.value));
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
                    return left(AuditValidationError.from(field.value));
                }

                fields.push(field.value);
            }

            const r = AuditRecord.create({
                kind: record.kind,
                description: desc.value,
                entity: entity.value,
                author,
                agent,
                origin: record.origin,
                occurredAt: record.occurredAt,
                fields: fields,
                metadata: record.metadata
            });

            if (r.isLeft()) {
                return left(AuditValidationError.from(r.value));
            }

            return right(null);
        } catch {
            return left(AuditValidationError.from(new UnknownError()));
        }
    }

    /**
     * Validates origin-author/agent consistency
     * @param origin The origin type (USER, SYSTEM, AI)
     * @param author The author (if any)
     * @param agent The agent (if any)
     * @returns Either a validation error or null if valid
     */
    private static validateOriginConsistency(
        origin: OriginKind,
        author: Author | null,
        agent: Agent | null
    ): Either<AuditValidationError, null> {
        switch (origin) {
            case 'USER':
                if (!author) {
                    return left(
                        new AuditValidationError(
                            'USER origin requires an author but none was provided'
                        )
                    );
                }
                if (agent) {
                    return left(
                        new AuditValidationError(
                            'USER origin cannot have an agent, only an author'
                        )
                    );
                }
                break;

            case 'AI':
                if (!agent) {
                    return left(
                        new AuditValidationError(
                            'AI origin requires an agent but none was provided'
                        )
                    );
                }
                if (author) {
                    return left(
                        new AuditValidationError(
                            'AI origin cannot have an author, only an agent'
                        )
                    );
                }
                break;

            case 'SYSTEM':
                if (author) {
                    return left(
                        new AuditValidationError(
                            'SYSTEM origin cannot have an author'
                        )
                    );
                }
                if (agent) {
                    return left(
                        new AuditValidationError(
                            'SYSTEM origin cannot have an agent'
                        )
                    );
                }
                break;

            default:
                return left(
                    new AuditValidationError(`Invalid origin type: ${origin}`)
                );
        }

        return right(null);
    }
}
