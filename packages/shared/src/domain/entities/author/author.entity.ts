import { EmptyAuthorIdError } from '../../errors/author/empty-id.error';
import { EmptyAuthorNameError } from '../../errors/author/empty-name.error';
import { InvalidAuthorEmailError } from '../../errors/author/invalid-email.error';
import { InvalidAuthorRolesError } from '../../errors/author/invalid-roles.error';
import { EmptyOriginIpError } from '../../errors/origin/empty-ip.error';
import { EmptyOriginUserAgentError } from '../../errors/origin/empty-user-agent.error';
import { Either, left, right } from '@audit/shared/either';

type AuthorProps = {
    id: string;
    name: string;
    email: string;
    roles: string[];
    ip: string;
    userAgent: string;
};

export class Author {
    private constructor(
        private readonly id: string,
        private readonly name: string,
        private readonly email: string,
        private readonly roles: string[],
        private readonly ip: string,
        private readonly userAgent: string
    ) {}

    public static create(
        p: AuthorProps
    ): Either<
        | EmptyAuthorIdError
        | EmptyAuthorNameError
        | InvalidAuthorEmailError
        | InvalidAuthorRolesError
        | EmptyOriginIpError
        | EmptyOriginUserAgentError,
        Author
    > {
        if (!p.id.length) {
            return left(new EmptyAuthorIdError());
        }

        if (!p.name.length) {
            return left(new EmptyAuthorNameError());
        }

        if (!p.email.length || !this.isValidEmail(p.email)) {
            return left(new InvalidAuthorEmailError());
        }

        if (!Array.isArray(p.roles)) {
            return left(new InvalidAuthorRolesError());
        }

        if (!p.ip.length) {
            return left(new EmptyOriginIpError());
        }

        if (!p.userAgent.length) {
            return left(new EmptyOriginUserAgentError());
        }

        const a = new Author(p.id, p.name, p.email, p.roles, p.ip, p.userAgent);
        return right(a);
    }

    private static isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    public toData() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            roles: this.roles,
            ip: this.ip,
            userAgent: this.userAgent
        };
    }
}
