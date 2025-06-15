import type { DomainError } from '@audit/shared/domain/errors';

export interface AuditError {
    name: string;
    reason: string;
}

/**
 * @description Invalid audit record data provided
 */
export class AuditValidationError implements AuditError {
    public readonly name = 'AUDIT_VALIDATION_ERROR';
    public readonly reason: string;

    constructor(reason: string) {
        this.reason = 'Invalid audit register data provided: ' + reason;
    }

    public static from(e: DomainError) {
        return new AuditValidationError(e.reason);
    }
}

/**
 * @description Internal error during operation
 */
export class AuditInternalError implements AuditError {
    public readonly name = 'AUDIT_INTERNAL_ERROR';
    public readonly reason =
        'An expected internal error has occurred while registering audit log';
}
