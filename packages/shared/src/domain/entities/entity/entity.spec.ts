import { Entity } from './entity.entity';
import { Kind } from '../kind/kind.entity';
import { EmptyEntityIdError } from '../../errors/entity/empty-id.error';
import { EmptyEntityTitleError } from '../../errors/entity/empty-title.error';
import { EmptyEntityUrlError } from '../../errors/entity/empty-url.error';
import { InvalidEntityKindError } from '../../errors/entity/invalid-kind.error';

describe('Entity', () => {
    it('should be able to create an entity successfully', () => {
        const kind = Kind.create({
            kind: 'CONTENT',
            label: 'Conteúdo'
        });

        const entity = Entity.create({
            id: '123e4567-e89b-12d3-a456-426614174000',
            title: 'My Content',
            url: '/content/123',
            kind: kind.value as Kind
        });

        expect(entity.isRight()).toBeTruthy();
        expect(entity.value).toBeInstanceOf(Entity);
    });

    it('should return an error when trying to create an entity with empty id', () => {
        const kind = Kind.create({
            kind: 'CONTENT',
            label: 'Conteúdo'
        });

        const entity = Entity.create({
            id: '',
            title: 'My Content',
            url: '/content/123',
            kind: kind.value as Kind
        });

        expect(entity.isLeft()).toBeTruthy();
        expect(entity.value).toBeInstanceOf(EmptyEntityIdError);
    });

    it('should return an error when trying to create an entity with empty title', () => {
        const kind = Kind.create({
            kind: 'CONTENT',
            label: 'Conteúdo'
        });

        const entity = Entity.create({
            id: '123e4567-e89b-12d3-a456-426614174000',
            title: '',
            url: '/content/123',
            kind: kind.value as Kind
        });

        expect(entity.isLeft()).toBeTruthy();
        expect(entity.value).toBeInstanceOf(EmptyEntityTitleError);
    });

    it('should return an error when trying to create an entity with empty url', () => {
        const kind = Kind.create({
            kind: 'CONTENT',
            label: 'Conteúdo'
        });

        const entity = Entity.create({
            id: '123e4567-e89b-12d3-a456-426614174000',
            title: 'My Content',
            url: '',
            kind: kind.value as Kind
        });

        expect(entity.isLeft()).toBeTruthy();
        expect(entity.value).toBeInstanceOf(EmptyEntityUrlError);
    });

    it('should return an error when trying to create an entity with invalid kind', () => {
        const entity = Entity.create({
            id: '123e4567-e89b-12d3-a456-426614174000',
            title: 'My Content',
            url: '/content/123',
            kind: {} as unknown as Kind
        });

        expect(entity.isLeft()).toBeTruthy();
        expect(entity.value).toBeInstanceOf(InvalidEntityKindError);
    });
});
