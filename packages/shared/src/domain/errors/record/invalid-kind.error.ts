import { DomainError } from '..';

export class InvalidAuditRecordKindError implements DomainError {
    public readonly name: string = 'INVALID_AUDIT_RECORD_KIND_ERROR';
    public readonly reason: string = 'Invalid operation kind provided';
}
