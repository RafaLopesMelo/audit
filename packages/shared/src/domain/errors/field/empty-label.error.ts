import { DomainError } from '..';

export class EmptyFieldLabelError implements DomainError {
    public readonly name: string = 'EMPTY_FIELD_LABEL_ERROR';
    public readonly reason: string = 'Empty field label provided';
}
