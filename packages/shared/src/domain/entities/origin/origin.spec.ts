import { Origin, OriginKind } from './origin.entity';

describe('Origin', () => {
    it('should be able to create a USER origin successfully', () => {
        const origin = Origin.create('USER');

        expect(origin.isRight()).toBeTruthy();
        expect(origin.value).toBeInstanceOf(Origin);
        expect(origin.value.toData()).toBe('USER');
    });

    it('should be able to create a SYSTEM origin successfully', () => {
        const origin = Origin.create('SYSTEM');

        expect(origin.isRight()).toBeTruthy();
        expect(origin.value).toBeInstanceOf(Origin);
        expect(origin.value.toData()).toBe('SYSTEM');
    });

    it('should be able to create an AI origin successfully', () => {
        const origin = Origin.create('AI');

        expect(origin.isRight()).toBeTruthy();
        expect(origin.value).toBeInstanceOf(Origin);
        expect(origin.value.toData()).toBe('AI');
    });

    it('should default to USER when given an invalid origin type', () => {
        const origin = Origin.create('INVALID' as OriginKind);

        expect(origin.isRight()).toBeTruthy();
        expect(origin.value).toBeInstanceOf(Origin);
        expect(origin.value.toData()).toBe('USER');
    });
});
