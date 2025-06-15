import { Description } from './description.entity';
import { InvalidDescriptionValueError } from '../../errors/description/invalid-description-value.error';
import { DescriptionValueWithNoPlaceholderError } from '../../errors/description/value-with-no-placeholder-provided.error';
import { EmptyDescriptionTemplateError } from '../../errors/description/empty-template.error';

describe('Description', () => {
    it('should be able to create a description successfully', () => {
        const d = Description.create({
            template: 'my template from {{label}}',
            values: {
                label: 'test'
            }
        });

        expect(d.isRight()).toBeTruthy();
        expect(d.value).toBeInstanceOf(Description);
    });

    it('should create a description with multiple placeholders', () => {
        const d = Description.create({
            template: 'Hello {{name}} {{lastName}}!',
            values: {
                name: 'John',
                lastName: 'Doe'
            }
        });

        expect(d.isRight()).toBeTruthy();
        expect(d.value).toBeInstanceOf(Description);
    });

    it('should create a description with multiple occurrences of the same placeholder', () => {
        const d = Description.create({
            template: 'Hello {{name}}, your username is {{name}}!',
            values: {
                name: 'John'
            }
        });

        expect(d.isRight()).toBeTruthy();
        expect(d.value).toBeInstanceOf(Description);
    });

    it('should return an error when a value is not a string', () => {
        const d = Description.create({
            template: 'Hello {{name}}!',
            values: {
                name: 123 as unknown as string
            }
        });

        expect(d.isLeft()).toBeTruthy();
        expect(d.value).toBeInstanceOf(InvalidDescriptionValueError);
    });

    it('should return an error when a value has no corresponding placeholder', () => {
        const d = Description.create({
            template: 'Hello {{name}}!',
            values: {
                name: 'John',
                age: '30'
            }
        });

        expect(d.isLeft()).toBeTruthy();
        expect(d.value).toBeInstanceOf(DescriptionValueWithNoPlaceholderError);
    });

    it('should return an error when trying to create a description with empty template', () => {
        const d = Description.create({
            template: '',
            values: {}
        });

        expect(d.isLeft()).toBeTruthy();
        expect(d.value).toBeInstanceOf(EmptyDescriptionTemplateError);
    });

    it('should handle template with no placeholders correctly', () => {
        const d = Description.create({
            template: 'This is a static message with no placeholders',
            values: {}
        });

        expect(d.isRight()).toBeTruthy();
        expect(d.value).toBeInstanceOf(Description);
    });
});
