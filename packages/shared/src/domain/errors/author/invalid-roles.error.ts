import { DomainError } from '..';

export class InvalidAuthorRolesError implements DomainError {
    public readonly name: string = 'INVALID_AUTHOR_ROLES_ERROR';
    public readonly reason: string = 'Invalid author roles provided';
}
