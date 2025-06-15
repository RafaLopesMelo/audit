import { DomainError } from '..';

export class InvalidEntityKindError implements DomainError {
    public readonly name: string = 'INVALID_ENTITY_KIND_ERROR';
    public readonly reason: string = 'Invalid entity kind provided';
}
