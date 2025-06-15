import { AuditRecord, OperationKind } from './audit-record.entity';
import { Description } from '../description/description.entity';
import { Kind } from '../kind/kind.entity';
import { Entity } from '../entity/entity.entity';
import { Author } from '../author/author.entity';
import { Field, FieldValue } from '../field/field.entity';
import { InvalidAuditRecordKindError } from '../../errors/record/invalid-kind.error';
import { InvalidAuditRecordOccurredAtError } from '../../errors/record/invalid-occurred-at.error';
import { InvalidAuditRecordMetadataError } from '../../errors/record/invalid-metadata.error';
import { OriginKind } from '../origin/origin.entity';

describe('AuditRecord', () => {
    it('should be able to create an audit record successfully', () => {
        const description = Description.create({
            template: 'User {{user}} created content {{content}}',
            values: {
                user: 'John',
                content: 'My Content'
            }
        }).value as Description;

        const kind = Kind.create({
            kind: 'CONTENT',
            label: 'Conteúdo'
        }).value as Kind;

        const entity = Entity.create({
            id: '123e4567-e89b-12d3-a456-426614174000',
            title: 'My Content',
            url: '/content/123',
            kind
        }).value as Entity;

        const author = Author.create({
            id: '123e4567-e89b-12d3-a456-426614174001',
            name: 'John Doe',
            email: 'john.doe@example.com',
            roles: ['ADMIN', 'TEACHER'],
            ip: '192.168.1.1',
            userAgent:
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }).value as Author;

        const beforeValue = FieldValue.create({
            value: 'old-value',
            label: 'Old Value'
        }).value as FieldValue;

        const afterValue = FieldValue.create({
            value: 'new-value',
            label: 'New Value'
        }).value as FieldValue;

        const field = Field.create({
            name: 'description',
            label: 'Description',
            before: beforeValue,
            after: afterValue
        }).value as Field;

        const record = AuditRecord.create({
            kind: 'UPDATE',
            description,
            entity,
            author,
            origin: 'USER',
            occurredAt: new Date(),
            fields: [field],
            metadata: {
                additionalInfo: 'some additional info'
            }
        });

        expect(record.isRight()).toBeTruthy();
        expect(record.value).toBeInstanceOf(AuditRecord);
    });

    it('should be able to create an audit record with null author', () => {
        const description = Description.create({
            template: 'System updated content {{content}}',
            values: {
                content: 'My Content'
            }
        }).value as Description;

        const kind = Kind.create({
            kind: 'CONTENT',
            label: 'Conteúdo'
        }).value as Kind;

        const entity = Entity.create({
            id: '123e4567-e89b-12d3-a456-426614174000',
            title: 'My Content',
            url: '/content/123',
            kind
        }).value as Entity;

        const record = AuditRecord.create({
            kind: 'UPDATE',
            description,
            entity,
            author: null,
            origin: 'SYSTEM',
            occurredAt: new Date(),
            fields: [],
            metadata: {
                additionalInfo: 'automated update'
            }
        });

        expect(record.isRight()).toBeTruthy();
        expect(record.value).toBeInstanceOf(AuditRecord);
    });

    it('should return an error when trying to create an audit record with invalid kind', () => {
        const description = Description.create({
            template: 'User {{user}} created content {{content}}',
            values: {
                user: 'John',
                content: 'My Content'
            }
        }).value as Description;

        const kind = Kind.create({
            kind: 'CONTENT',
            label: 'Conteúdo'
        }).value as Kind;

        const entity = Entity.create({
            id: '123e4567-e89b-12d3-a456-426614174000',
            title: 'My Content',
            url: '/content/123',
            kind
        }).value as Entity;

        const author = Author.create({
            id: '123e4567-e89b-12d3-a456-426614174001',
            name: 'John Doe',
            email: 'john.doe@example.com',
            roles: ['ADMIN', 'TEACHER'],
            ip: '192.168.1.1',
            userAgent:
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }).value as Author;

        const record = AuditRecord.create({
            kind: 'INVALID_KIND' as unknown as OperationKind,
            description,
            entity,
            author,
            origin: 'USER',
            occurredAt: new Date(),
            fields: [],
            metadata: {}
        });

        expect(record.isLeft()).toBeTruthy();
        expect(record.value).toBeInstanceOf(InvalidAuditRecordKindError);
    });

    it('should return an error when trying to create an audit record with invalid occurredAt', () => {
        const description = Description.create({
            template: 'User {{user}} created content {{content}}',
            values: {
                user: 'John',
                content: 'My Content'
            }
        }).value as Description;

        const kind = Kind.create({
            kind: 'CONTENT',
            label: 'Conteúdo'
        }).value as Kind;

        const entity = Entity.create({
            id: '123e4567-e89b-12d3-a456-426614174000',
            title: 'My Content',
            url: '/content/123',
            kind
        }).value as Entity;

        const author = Author.create({
            id: '123e4567-e89b-12d3-a456-426614174001',
            name: 'John Doe',
            email: 'john.doe@example.com',
            roles: ['ADMIN', 'TEACHER'],
            ip: '192.168.1.1',
            userAgent:
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }).value as Author;

        const record = AuditRecord.create({
            kind: 'CREATE',
            description,
            entity,
            author,
            origin: 'USER',
            occurredAt: 'invalid-date' as unknown as Date,
            fields: [],
            metadata: {}
        });

        expect(record.isLeft()).toBeTruthy();
        expect(record.value).toBeInstanceOf(InvalidAuditRecordOccurredAtError);
    });

    it('should return an error when trying to create an audit record with invalid metadata', () => {
        const description = Description.create({
            template: 'User {{user}} created content {{content}}',
            values: {
                user: 'John',
                content: 'My Content'
            }
        }).value as Description;

        const kind = Kind.create({
            kind: 'CONTENT',
            label: 'Conteúdo'
        }).value as Kind;

        const entity = Entity.create({
            id: '123e4567-e89b-12d3-a456-426614174000',
            title: 'My Content',
            url: '/content/123',
            kind
        }).value as Entity;

        const author = Author.create({
            id: '123e4567-e89b-12d3-a456-426614174001',
            name: 'John Doe',
            email: 'john.doe@example.com',
            roles: ['ADMIN', 'TEACHER'],
            ip: '192.168.1.1',
            userAgent:
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }).value as Author;

        const record = AuditRecord.create({
            kind: 'CREATE',
            description,
            entity,
            author,
            origin: 'USER',
            occurredAt: new Date(),
            fields: [],
            metadata: 'invalid-metadata' as unknown as Record<string, string>
        });

        expect(record.isLeft()).toBeTruthy();
        expect(record.value).toBeInstanceOf(InvalidAuditRecordMetadataError);
    });

    it('should be able to create an audit record with all valid operation kinds', () => {
        const description = Description.create({
            template: 'Test template',
            values: {}
        }).value as Description;

        const kind = Kind.create({
            kind: 'CONTENT',
            label: 'Conteúdo'
        }).value as Kind;

        const entity = Entity.create({
            id: '123e4567-e89b-12d3-a456-426614174000',
            title: 'My Content',
            url: '/content/123',
            kind
        }).value as Entity;

        const author = Author.create({
            id: '123e4567-e89b-12d3-a456-426614174001',
            name: 'John Doe',
            email: 'john.doe@example.com',
            roles: ['ADMIN'],
            ip: '192.168.1.1',
            userAgent: 'Mozilla/5.0'
        }).value as Author;

        const createRecord = AuditRecord.create({
            kind: 'CREATE',
            description,
            entity,
            author,
            origin: 'USER',
            occurredAt: new Date(),
            fields: [],
            metadata: {}
        });

        expect(createRecord.isRight()).toBeTruthy();

        const updateRecord = AuditRecord.create({
            kind: 'UPDATE',
            description,
            entity,
            author,
            origin: 'USER',
            occurredAt: new Date(),
            fields: [],
            metadata: {}
        });

        expect(updateRecord.isRight()).toBeTruthy();

        const deleteRecord = AuditRecord.create({
            kind: 'DELETE',
            description,
            entity,
            author,
            origin: 'USER',
            occurredAt: new Date(),
            fields: [],
            metadata: {}
        });

        expect(deleteRecord.isRight()).toBeTruthy();
    });

    it('should be able to create an audit record with all valid origin types', () => {
        const description = Description.create({
            template: 'Test template',
            values: {}
        }).value as Description;

        const kind = Kind.create({
            kind: 'CONTENT',
            label: 'Conteúdo'
        }).value as Kind;

        const entity = Entity.create({
            id: '123e4567-e89b-12d3-a456-426614174000',
            title: 'My Content',
            url: '/content/123',
            kind
        }).value as Entity;

        const OriginKinds: OriginKind[] = ['USER', 'SYSTEM'];

        for (const OriginKind of OriginKinds) {
            const record = AuditRecord.create({
                kind: 'CREATE',
                description,
                entity,
                author: null,
                origin: OriginKind,
                occurredAt: new Date(),
                fields: [],
                metadata: {}
            });

            expect(record.isRight()).toBeTruthy();
            expect(record.value).toBeInstanceOf(AuditRecord);
        }
    });

    it('should use default values for optional properties', () => {
        const description = Description.create({
            template: 'Test template',
            values: {}
        }).value as Description;

        const kind = Kind.create({
            kind: 'CONTENT',
            label: 'Conteúdo'
        }).value as Kind;

        const entity = Entity.create({
            id: '123e4567-e89b-12d3-a456-426614174000',
            title: 'My Content',
            url: '/content/123',
            kind
        }).value as Entity;

        // Only provide required props
        const record = AuditRecord.create({
            description,
            entity
        });

        expect(record.isRight()).toBeTruthy();
        if (record.isRight()) {
            const data = record.value.toData();
            expect(data.kind).toBe('CREATE');
            expect(data.author).toBeNull();
            expect(data.origin).toBe('USER');
            expect(data.fields).toEqual([]);
            expect(data.occurredAt).toBeInstanceOf(Date);
        }
    });
});
