import { DomainError } from '..';

export class EmptyAuthorIdError implements DomainError {
    public readonly name: string = 'EMPTY_AUTHOR_ID_ERROR';
    public readonly reason: string = 'Empty author id provided';
}
