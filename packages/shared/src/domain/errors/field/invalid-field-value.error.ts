import { DomainError } from '..';

export class InvalidFieldValueError implements DomainError {
    public readonly name: string = 'INVALID_FIELD_VALUE_ERROR';
    public readonly reason: string;

    constructor(field: string) {
        this.reason = `Invalid field value provided for ${field}`;
    }
}
