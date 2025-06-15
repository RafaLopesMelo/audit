import { DomainError } from '..';

export class EmptyAuthorNameError implements DomainError {
    public readonly name: string = 'EMPTY_AUTHOR_NAME_ERROR';
    public readonly reason: string = 'Empty author name provided';
}
