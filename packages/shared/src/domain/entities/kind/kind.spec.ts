import { Kind } from './kind.entity';
import { EmptyKindError } from '../../errors/kind/empty-kind.error';
import { EmptyKindLabelError } from '../../errors/kind/empty-kind-label.error';

describe('Kind', () => {
    it('should be able to create a kind successfully', () => {
        const k = Kind.create({
            kind: 'CONTENT',
            label: 'Conteúdo'
        });

        expect(k.isRight()).toBeTruthy();
        expect(k.value).toBeInstanceOf(Kind);
    });

    it('should return an error when trying to create a kind with empty kind value', () => {
        const k = Kind.create({
            kind: '',
            label: 'Conteúdo'
        });

        expect(k.isLeft()).toBeTruthy();
        expect(k.value).toBeInstanceOf(EmptyKindError);
    });

    it('should return an error when trying to create a kind with empty label', () => {
        const k = Kind.create({
            kind: 'CONTENT',
            label: ''
        });

        expect(k.isLeft()).toBeTruthy();
        expect(k.value).toBeInstanceOf(EmptyKindLabelError);
    });
});
