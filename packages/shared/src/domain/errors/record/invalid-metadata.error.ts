import { DomainError } from '..';

export class InvalidAuditRecordMetadataError implements DomainError {
    public readonly name: string = 'INVALID_AUDIT_RECORD_METADATA_ERROR';
    public readonly reason: string = 'Invalid operation metadata provided';
}
