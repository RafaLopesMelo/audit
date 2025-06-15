import { DomainError } from '..';

export class InvalidAuditRecordOccurredAtError implements DomainError {
    public readonly name: string = 'INVALID_AUDIT_RECORD_OCCURRED_AT_ERROR';
    public readonly reason: string = 'Invalid operation date provided';
}
