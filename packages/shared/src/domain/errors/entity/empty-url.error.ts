import { DomainError } from '..';

export class EmptyEntityUrlError implements DomainError {
    public readonly name: string = 'EMPTY_ENTITY_URL_ERROR';
    public readonly reason: string = 'Empty entity url provided';
}
