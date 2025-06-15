import { DomainError } from '..';

export class EmptyFieldValueError implements DomainError {
    public readonly name: string = 'EMPTY_FIELD_VALUE_ERROR';
    public readonly reason: string = 'Empty field value provided';
}
