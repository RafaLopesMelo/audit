import { DomainError } from '..';

export class InvalidAuthorEmailError implements DomainError {
    public readonly name: string = 'INVALID_AUTHOR_EMAIL_ERROR';
    public readonly reason: string = 'Invalid author email provided';
}
