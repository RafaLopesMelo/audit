import { DomainError } from '..';

export class EmptyFieldNameError implements DomainError {
    public readonly name: string = 'EMPTY_FIELD_NAME_ERROR';
    public readonly reason: string = 'Empty field name provided';
}
