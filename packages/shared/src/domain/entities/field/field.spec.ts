import { Field } from './field.entity';
import { FieldValue } from './field-value.entity';
import { EmptyFieldNameError } from '../../errors/field/empty-name.error';
import { EmptyFieldLabelError } from '../../errors/field/empty-label.error';
import { InvalidFieldValueError } from '../../errors/field/invalid-field-value.error';

describe('Field', () => {
    it('should be able to create a field successfully with before and after values', () => {
        const beforeValue = FieldValue.create({
            value: 'old-value',
            label: 'Old Value'
        });

        const afterValue = FieldValue.create({
            value: 'new-value',
            label: 'New Value'
        });

        const field = Field.create({
            name: 'description',
            label: 'Description',
            before: beforeValue.value as FieldValue,
            after: afterValue.value as FieldValue
        });

        expect(field.isRight()).toBeTruthy();
        expect(field.value).toBeInstanceOf(Field);
    });

    it('should be able to create a field with null before value (CREATE operation)', () => {
        const afterValue = FieldValue.create({
            value: 'new-value',
            label: 'New Value'
        });

        const field = Field.create({
            name: 'description',
            label: 'Description',
            before: null,
            after: afterValue.value as FieldValue
        });

        expect(field.isRight()).toBeTruthy();
        expect(field.value).toBeInstanceOf(Field);
    });

    it('should be able to create a field with null after value (DELETE operation)', () => {
        const beforeValue = FieldValue.create({
            value: 'old-value',
            label: 'Old Value'
        });

        const field = Field.create({
            name: 'description',
            label: 'Description',
            before: beforeValue.value as FieldValue,
            after: null
        });

        expect(field.isRight()).toBeTruthy();
        expect(field.value).toBeInstanceOf(Field);
    });

    it('should return an error when trying to create a field with empty name', () => {
        const field = Field.create({
            name: '',
            label: 'Description',
            before: null,
            after: null
        });

        expect(field.isLeft()).toBeTruthy();
        expect(field.value).toBeInstanceOf(EmptyFieldNameError);
    });

    it('should return an error when trying to create a field with empty label', () => {
        const field = Field.create({
            name: 'description',
            label: '',
            before: null,
            after: null
        });

        expect(field.isLeft()).toBeTruthy();
        expect(field.value).toBeInstanceOf(EmptyFieldLabelError);
    });

    it('should return an error when trying to create a field with invalid before value', () => {
        const field = Field.create({
            name: 'description',
            label: 'Description',
            before: {} as unknown as null,
            after: null
        });

        expect(field.isLeft()).toBeTruthy();
        expect(field.value).toBeInstanceOf(InvalidFieldValueError);
    });

    it('should return an error when trying to create a field with invalid after value', () => {
        const field = Field.create({
            name: 'description',
            label: 'Description',
            before: null,
            after: {} as unknown as null
        });

        expect(field.isLeft()).toBeTruthy();
        expect(field.value).toBeInstanceOf(InvalidFieldValueError);
    });
});
