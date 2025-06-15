import { DomainError } from '..';

export class InvalidDescriptionValueError implements DomainError {
    public readonly name: string = 'INVALID_DESCRIPTION_VALUE';
    public readonly reason: string = 'Invalid description value provided.';
}
