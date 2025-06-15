import { Author } from './author.entity';
import { EmptyAuthorIdError } from '../../errors/author/empty-id.error';
import { EmptyAuthorNameError } from '../../errors/author/empty-name.error';
import { InvalidAuthorEmailError } from '../../errors/author/invalid-email.error';
import { InvalidAuthorRolesError } from '../../errors/author/invalid-roles.error';
import { EmptyOriginIpError } from '../../errors/origin/empty-ip.error';
import { EmptyOriginUserAgentError } from '../../errors/origin/empty-user-agent.error';

describe('Author', () => {
    it('should be able to create an author successfully', () => {
        const author = Author.create({
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'John Doe',
            email: 'john.doe@example.com',
            roles: ['ADMIN', 'TEACHER'],
            ip: '192.168.1.1',
            userAgent:
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        });

        expect(author.isRight()).toBeTruthy();
        expect(author.value).toBeInstanceOf(Author);
    });

    it('should return an error when trying to create an author with empty id', () => {
        const author = Author.create({
            id: '',
            name: 'John Doe',
            email: 'john.doe@example.com',
            roles: ['ADMIN', 'TEACHER'],
            ip: '192.168.1.1',
            userAgent:
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        });

        expect(author.isLeft()).toBeTruthy();
        expect(author.value).toBeInstanceOf(EmptyAuthorIdError);
    });

    it('should return an error when trying to create an author with empty name', () => {
        const author = Author.create({
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: '',
            email: 'john.doe@example.com',
            roles: ['ADMIN', 'TEACHER'],
            ip: '192.168.1.1',
            userAgent:
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        });

        expect(author.isLeft()).toBeTruthy();
        expect(author.value).toBeInstanceOf(EmptyAuthorNameError);
    });

    it('should return an error when trying to create an author with invalid email', () => {
        const author = Author.create({
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'John Doe',
            email: 'invalid-email',
            roles: ['ADMIN', 'TEACHER'],
            ip: '192.168.1.1',
            userAgent:
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        });

        expect(author.isLeft()).toBeTruthy();
        expect(author.value).toBeInstanceOf(InvalidAuthorEmailError);
    });

    it('should return an error when trying to create an author with empty email', () => {
        const author = Author.create({
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'John Doe',
            email: '',
            roles: ['ADMIN', 'TEACHER'],
            ip: '192.168.1.1',
            userAgent:
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        });

        expect(author.isLeft()).toBeTruthy();
        expect(author.value).toBeInstanceOf(InvalidAuthorEmailError);
    });

    it('should return an error when trying to create an author with invalid roles', () => {
        const author = Author.create({
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'John Doe',
            email: 'john.doe@example.com',
            roles: 'ADMIN' as unknown as [],
            ip: '192.168.1.1',
            userAgent:
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        });

        expect(author.isLeft()).toBeTruthy();
        expect(author.value).toBeInstanceOf(InvalidAuthorRolesError);
    });

    it('should return an error when trying to create an author with empty ip', () => {
        const author = Author.create({
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'John Doe',
            email: 'john.doe@example.com',
            roles: ['ADMIN', 'TEACHER'],
            ip: '',
            userAgent:
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        });

        expect(author.isLeft()).toBeTruthy();
        expect(author.value).toBeInstanceOf(EmptyOriginIpError);
    });

    it('should return an error when trying to create an author with empty userAgent', () => {
        const author = Author.create({
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'John Doe',
            email: 'john.doe@example.com',
            roles: ['ADMIN', 'TEACHER'],
            ip: '192.168.1.1',
            userAgent: ''
        });

        expect(author.isLeft()).toBeTruthy();
        expect(author.value).toBeInstanceOf(EmptyOriginUserAgentError);
    });

    it('should be able to create an author with empty roles array', () => {
        const author = Author.create({
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'John Doe',
            email: 'john.doe@example.com',
            roles: [],
            ip: '192.168.1.1',
            userAgent:
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        });

        expect(author.isRight()).toBeTruthy();
        expect(author.value).toBeInstanceOf(Author);
    });
});
