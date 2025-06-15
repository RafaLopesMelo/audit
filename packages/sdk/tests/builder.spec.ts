import { right } from '@audit/shared/either';
import { AuditRecordBuilder } from '../src/builder';
import { AuditValidationError } from '../src/errors';
import { AuditClient } from '../src/client';

describe('AuditRecordBuilder', () => {
    it('should build a valid audit record with user author', () => {
        const builder = AuditRecordBuilder.fromUser('api-key')
            .setAuthor({
                id: '456',
                name: 'John Doe',
                email: 'john@example.com',
                roles: ['PROFESSOR'],
                ip: '192.168.1.1',
                userAgent: 'Mozilla/5.0...'
            })
            .setKind('CREATE')
            .setDescription('User {{name}} created folder {{folder}}', {
                name: 'John Doe',
                folder: 'My Documents'
            })
            .setEntity({
                id: '123',
                title: 'My Documents',
                url: '/folders/123',
                kind: {
                    id: 'FOLDER',
                    label: 'Pasta'
                }
            })
            .addField({
                name: 'name',
                label: 'Nome',
                before: null,
                after: { value: 'My Documents', label: 'My Documents' }
            })
            .setMetadata({
                organizationId: '789'
            }) as AuditRecordBuilder;

        const r = builder.build();

        expect(r.isRight()).toBe(true);

        if (r.isRight()) {
            const record = r.value;

            expect(record).toMatchObject({
                kind: 'CREATE',
                description: {
                    template: 'User {{name}} created folder {{folder}}',
                    values: {
                        name: 'John Doe',
                        folder: 'My Documents'
                    }
                },
                entity: {
                    id: '123',
                    title: 'My Documents',
                    url: '/folders/123',
                    kind: {
                        kind: 'FOLDER',
                        label: 'Pasta'
                    }
                },
                origin: 'USER',
                author: {
                    id: '456',
                    name: 'John Doe',
                    email: 'john@example.com',
                    roles: ['PROFESSOR'],
                    ip: '192.168.1.1',
                    userAgent: 'Mozilla/5.0...'
                },
                occurredAt: expect.any(Date),
                fields: [
                    {
                        name: 'name',
                        label: 'Nome',
                        before: null,
                        after: { value: 'My Documents', label: 'My Documents' }
                    }
                ],
                metadata: {
                    organizationId: '789'
                }
            });
        }
    });

    it('should build a valid audit record with system author', () => {
        const builder = AuditRecordBuilder.fromSystem('api-key')
            .setKind('CREATE')
            .setDescription('User {{name}} created folder {{folder}}', {
                name: 'John Doe',
                folder: 'My Documents'
            })
            .setEntity({
                id: '123',
                title: 'My Documents',
                url: '/folders/123',
                kind: {
                    id: 'FOLDER',
                    label: 'Pasta'
                }
            })
            .addField({
                name: 'name',
                label: 'Nome',
                before: null,
                after: { value: 'My Documents', label: 'My Documents' }
            })
            .setMetadata({
                organizationId: '789'
            }) as AuditRecordBuilder;

        const r = builder.build();

        expect(r.isRight()).toBe(true);

        if (r.isRight()) {
            const record = r.value;

            expect(record).toMatchObject({
                kind: 'CREATE',
                agent: null,
                description: {
                    template: 'User {{name}} created folder {{folder}}',
                    values: {
                        name: 'John Doe',
                        folder: 'My Documents'
                    }
                },
                entity: {
                    id: '123',
                    title: 'My Documents',
                    url: '/folders/123',
                    kind: {
                        kind: 'FOLDER',
                        label: 'Pasta'
                    }
                },
                origin: 'SYSTEM',
                author: null,
                occurredAt: expect.any(Date),
                fields: [
                    {
                        name: 'name',
                        label: 'Nome',
                        before: null,
                        after: { value: 'My Documents', label: 'My Documents' }
                    }
                ],
                metadata: {
                    organizationId: '789'
                }
            });
        }
    });

    it('should build a valid audit record with AI author', () => {
        const builder = AuditRecordBuilder.fromAI('api-key')
            .setAgent({
                id: '123',
                name: 'agent'
            })
            .setKind('CREATE')
            .setDescription('User {{name}} created folder {{folder}}', {
                name: 'John Doe',
                folder: 'My Documents'
            })
            .setEntity({
                id: '123',
                title: 'My Documents',
                url: '/folders/123',
                kind: {
                    id: 'FOLDER',
                    label: 'Pasta'
                }
            })
            .addField({
                name: 'name',
                label: 'Nome',
                before: null,
                after: { value: 'My Documents', label: 'My Documents' }
            })
            .setMetadata({
                organizationId: '789'
            }) as AuditRecordBuilder;

        const r = builder.build();

        expect(r.isRight()).toBe(true);

        if (r.isRight()) {
            const record = r.value;

            expect(record).toMatchObject({
                kind: 'CREATE',
                agent: {
                    id: '123',
                    name: 'agent'
                },
                description: {
                    template: 'User {{name}} created folder {{folder}}',
                    values: {
                        name: 'John Doe',
                        folder: 'My Documents'
                    }
                },
                entity: {
                    id: '123',
                    title: 'My Documents',
                    url: '/folders/123',
                    kind: {
                        kind: 'FOLDER',
                        label: 'Pasta'
                    }
                },
                origin: 'AI',
                author: null,
                occurredAt: expect.any(Date),
                fields: [
                    {
                        name: 'name',
                        label: 'Nome',
                        before: null,
                        after: { value: 'My Documents', label: 'My Documents' }
                    }
                ],
                metadata: {
                    organizationId: '789'
                }
            });
        }
    });

    it('should return Left with AuditValidationError when building an incomplete record', () => {
        const builder = AuditRecordBuilder.fromUser('api-key');

        const result = (builder as AuditRecordBuilder).build();
        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(AuditValidationError);
    });

    it('should build a valid update record', () => {
        const builder = AuditRecordBuilder.fromUser('api-key')
            .setAuthor({
                id: '456',
                name: 'John Doe',
                email: 'john@example.com',
                roles: ['PROFESSOR'],
                ip: '192.168.1.1',
                userAgent: 'Mozilla/5.0...'
            })
            .setKind('UPDATE')
            .setDescription('User {{name}} updated folder {{folder}}', {
                name: 'John Doe',
                folder: 'My Documents'
            })
            .setEntity({
                id: '123',
                title: 'My Documents',
                url: '/folders/123',
                kind: {
                    id: 'FOLDER',
                    label: 'Pasta'
                }
            })
            .addField({
                name: 'name',
                label: 'Nome',
                before: { value: 'Old Documents', label: 'Old Documents' },
                after: { value: 'My Documents', label: 'My Documents' }
            }) as AuditRecordBuilder;

        const r = builder.build();

        expect(r.isRight()).toBe(true);

        if (r.isRight()) {
            const record = r.value;
            expect(record.kind).toBe('UPDATE');
            expect(record.fields[0].before).toEqual({
                value: 'Old Documents',
                label: 'Old Documents'
            });
            expect(record.fields[0].after).toEqual({
                value: 'My Documents',
                label: 'My Documents'
            });
        }
    });

    it('should build a valid delete record', () => {
        const builder = AuditRecordBuilder.fromUser('api-key')
            .setAuthor({
                id: '456',
                name: 'John Doe',
                email: 'john@example.com',
                roles: ['PROFESSOR'],
                ip: '192.168.1.1',
                userAgent: 'Mozilla/5.0...'
            })
            .setKind('DELETE')
            .setDescription('User {{name}} deleted folder {{folder}}', {
                name: 'John Doe',
                folder: 'My Documents'
            })
            .setEntity({
                id: '123',
                title: 'My Documents',
                url: '/folders/123',
                kind: {
                    id: 'FOLDER',
                    label: 'Pasta'
                }
            })
            .addField({
                name: 'name',
                label: 'Nome',
                before: { value: 'My Documents', label: 'My Documents' },
                after: null
            }) as AuditRecordBuilder;

        const r = builder.build();

        expect(r.isRight()).toBe(true);

        if (r.isRight()) {
            const record = r.value;
            expect(record.kind).toBe('DELETE');
            expect(record.fields[0].before).toEqual({
                value: 'My Documents',
                label: 'My Documents'
            });
            expect(record.fields[0].after).toBeNull();
        }
    });

    it('should build and send record in one step', async () => {
        const mockClient = {
            send: vi.fn().mockResolvedValue(right(null))
        };

        vi.spyOn(AuditClient, 'create').mockResolvedValueOnce(
            mockClient as unknown as AuditClient
        );

        const builder = AuditRecordBuilder.fromUser('api-key')
            .setAuthor({
                id: 'id',
                name: 'name',
                email: 'email@email.com',
                roles: [],
                ip: 'ip',
                userAgent: 'userAgent'
            })
            .setKind('CREATE')
            .setDescription('Description', {})
            .setEntity({
                id: 'id',
                title: 'title',
                url: 'url',
                kind: {
                    id: 'kind',
                    label: 'label'
                }
            });

        await builder.send();

        expect(mockClient.send).toHaveBeenCalled();
    });

    describe('Origin-Author/Agent Validation', () => {
        it('should reject USER origin without author', () => {
            const builder = AuditRecordBuilder.fromUser('api-key')
                .setAuthor({
                    id: '456',
                    name: 'John Doe',
                    email: 'john@example.com',
                    roles: ['PROFESSOR'],
                    ip: '192.168.1.1',
                    userAgent: 'Mozilla/5.0...'
                })
                .setKind('CREATE')
                .setDescription('Test {{action}}', { action: 'create' })
                .setEntity({
                    id: '123',
                    title: 'Test Entity',
                    url: '/test/123',
                    kind: { id: 'TEST', label: 'Test' }
                }) as AuditRecordBuilder;

            // Manually remove the author to test validation
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (builder as any).record.author = null;

            const result = builder.build();
            expect(result.isLeft()).toBe(true);
            expect((result.value as AuditValidationError).reason).toContain(
                'USER origin requires an author'
            );
        });

        it('should reject USER origin with agent', () => {
            const builder = AuditRecordBuilder.fromUser('api-key')
                .setAuthor({
                    id: '456',
                    name: 'John Doe',
                    email: 'john@example.com',
                    roles: ['PROFESSOR'],
                    ip: '192.168.1.1',
                    userAgent: 'Mozilla/5.0...'
                })
                .setKind('CREATE')
                .setDescription('Test {{action}}', { action: 'create' })
                .setEntity({
                    id: '123',
                    title: 'Test Entity',
                    url: '/test/123',
                    kind: { id: 'TEST', label: 'Test' }
                }) as AuditRecordBuilder;

            // Manually add an agent to test validation
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (builder as any).record.agent = { id: 'ai-1', name: 'AI Agent' };

            const result = builder.build();
            expect(result.isLeft()).toBe(true);
            expect((result.value as AuditValidationError).reason).toContain(
                'USER origin cannot have an agent'
            );
        });

        it('should reject AI origin without agent', () => {
            const builder = AuditRecordBuilder.fromAI('api-key')
                .setAgent({ id: 'ai-1', name: 'AI Agent' })
                .setKind('CREATE')
                .setDescription('Test {{action}}', { action: 'create' })
                .setEntity({
                    id: '123',
                    title: 'Test Entity',
                    url: '/test/123',
                    kind: { id: 'TEST', label: 'Test' }
                }) as AuditRecordBuilder;

            // Manually remove agent to test validation
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (builder as any).record.agent = null;

            const result = builder.build();
            expect(result.isLeft()).toBe(true);
            expect((result.value as AuditValidationError).reason).toContain(
                'AI origin requires an agent'
            );
        });

        it('should reject AI origin with author', () => {
            const builder = AuditRecordBuilder.fromAI('api-key')
                .setAgent({ id: 'ai-1', name: 'AI Agent' })
                .setKind('CREATE')
                .setDescription('Test {{action}}', { action: 'create' })
                .setEntity({
                    id: '123',
                    title: 'Test Entity',
                    url: '/test/123',
                    kind: { id: 'TEST', label: 'Test' }
                }) as AuditRecordBuilder;

            // Manually add an author to test validation
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (builder as any).record.author = {
                id: '456',
                name: 'John Doe',
                email: 'john@example.com',
                roles: ['PROFESSOR'],
                ip: '192.168.1.1',
                userAgent: 'Mozilla/5.0...'
            };

            const result = builder.build();
            expect(result.isLeft()).toBe(true);
            expect((result.value as AuditValidationError).reason).toContain(
                'AI origin cannot have an author'
            );
        });

        it('should reject SYSTEM origin with author', () => {
            const builder = AuditRecordBuilder.fromSystem('api-key')
                .setKind('CREATE')
                .setDescription('Test {{action}}', { action: 'create' })
                .setEntity({
                    id: '123',
                    title: 'Test Entity',
                    url: '/test/123',
                    kind: { id: 'TEST', label: 'Test' }
                }) as AuditRecordBuilder;

            // Manually add an author to test validation
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (builder as any).record.author = {
                id: '456',
                name: 'John Doe',
                email: 'john@example.com',
                roles: ['PROFESSOR'],
                ip: '192.168.1.1',
                userAgent: 'Mozilla/5.0...'
            };

            const result = builder.build();
            expect(result.isLeft()).toBe(true);
            expect((result.value as AuditValidationError).reason).toContain(
                'SYSTEM origin cannot have an author'
            );
        });

        it('should reject SYSTEM origin with agent', () => {
            const builder = AuditRecordBuilder.fromSystem('api-key')
                .setKind('CREATE')
                .setDescription('Test {{action}}', { action: 'create' })
                .setEntity({
                    id: '123',
                    title: 'Test Entity',
                    url: '/test/123',
                    kind: { id: 'TEST', label: 'Test' }
                }) as AuditRecordBuilder;

            // Manually add an agent to test validation
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (builder as any).record.agent = { id: 'ai-1', name: 'AI Agent' };

            const result = builder.build();
            expect(result.isLeft()).toBe(true);
            expect((result.value as AuditValidationError).reason).toContain(
                'SYSTEM origin cannot have an agent'
            );
        });
    });
});
