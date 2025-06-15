/**
 * Represents a field value with a machine-readable value and a human-readable label
 */
export interface FieldValueDTO {
    /**
     * Value of the field, no need to be human legible, could even be a simple number for ID's
     */
    value: string;

    /**
     * Label for the value of the field, must be a human legible pure text and will be displayed in UI
     */
    label: string;
}

/**
 * Represents the different types of audit operations
 */
export type AuditKind = 'CREATE' | 'UPDATE' | 'DELETE';

/**
 * Represents the description of an audit event with templating capabilities
 */
export interface AuditDescription {
    /**
     * Template for description. must be a human legible pure HTML text and will be displayed in UI and may have placeholders with `{{NAME}}`
     */
    template: string;

    /**
     * Values to be inserted in description template. The values will be placed according to its key, so a `NAME` property would replace the `{{NAME}}` placeholder
     */
    values: Record<string, string>;
}

/**
 * Represents kind information for an entity
 */
export interface EntityKind {
    /**
     * Entity's kind identifier. No need to be human legible, but needs to be constant, e.g. `CONTENT`, `FOLDER`
     */
    kind: string;

    /**
     * Entity's kind label. Must be human a legible pure text and will be displayed in UI, e.g. label for `CONTENT` could be "Conteúdo"
     */
    label: string;
}

/**
 * Represents an entity being audited
 */
export interface AuditEntity {
    /**
     * Entity's ID. Should be a UUID, will be used for filtering in reports
     */
    id: string;

    /**
     * Entity instance's title. Must be human a legible pure text and will be displayed in UI, eg. "Minha Pasta"
     */
    title: string;

    /**
     * URL to the entity in the UI
     */
    url: string;

    /**
     * Entity's kind information
     */
    kind: EntityKind;
}

/**
 * Represents the author of an audited action
 */
export interface AuditAuthor {
    /**
     * Author's ID. Should be a UUID
     */
    id: string;

    /**
     * Author's name
     */
    name: string;

    /**
     * Author's email
     */
    email: string;

    /**
     * Author's roles or permission level
     */
    roles: string[];

    /**
     * IP address where the operation originated from
     */
    ip: string;

    /**
     * User agent information
     */
    userAgent: string;
}

/**
 * Represents the agent author of an audited action
 */
export interface AuditAgent {
    /**
     * Agent's ID. Should be a UUID
     */
    id: string;

    /**
     * Author's name
     */
    name: string;
}

/**
 * Represents a changed field in an audit event
 */
export interface AuditField {
    /**
     * Name of the field that was changed. No need to be human legible, but needs to be constant, e.g. `description`
     */
    name: string;

    /**
     * Label for the field that was changed. Must be human a legible pure text and will be displayed in UI, e.g. label for `description` could be "Descrição"
     */
    label: string;

    /**
     * Field's information before the operation was applied (null for CREATE operations)
     */
    before: FieldValueDTO | null;

    /**
     * Field's information after the operation was applied (null for DELETE operations)
     */
    after: FieldValueDTO | null;
}

/**
 * Represents a complete audit record to be sent to the audit service
 */
export interface AuditRecordDTO {
    /**
     * Audit record ID in ULID format. Only available on retrieve
     */
    id?: string;

    /**
     * Type of the operation to be audited
     */
    kind: AuditKind;

    /**
     * Properties for description for the audited operation
     */
    description: AuditDescription;

    /**
     * Audited operation's target entity information
     */
    entity: AuditEntity;

    origin: 'USER' | 'SYSTEM' | 'AI';

    /**
     * Operation's author information
     */
    author: AuditAuthor | null;

    /**
     * Operation's agent information
     */
    agent: AuditAgent | null;

    /**
     * Operation's date
     */
    occurredAt: Date;

    /**
     * Fields that were changed in operation
     */
    fields: AuditField[];

    /**
     * Additional context that might be helpful for debugging or detailed auditing
     */
    metadata?: Record<string, string>;
}
