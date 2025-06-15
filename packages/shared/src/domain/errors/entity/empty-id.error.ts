import { DomainError } from '..';

export class EmptyEntityIdError implements DomainError {
    public readonly name: string = 'EMPTY_ENTITY_ID_ERROR';
    public readonly reason: string = 'Empty entity id provided';
}
