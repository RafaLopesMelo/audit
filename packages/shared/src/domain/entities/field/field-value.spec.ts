import { FieldValue } from './field-value.entity';
import { EmptyFieldValueError } from '../../errors/field/empty-value.error';
import { EmptyFieldLabelError } from '../../errors/field/empty-label.error';

describe('FieldValue', () => {
    it('should be able to create a field value successfully', () => {
        const fieldValue = FieldValue.create({
            value: 'some-value',
            label: 'Some Value'
        });

        expect(fieldValue.isRight()).toBeTruthy();
        expect(fieldValue.value).toBeInstanceOf(FieldValue);
    });

    it('should return an error when trying to create a field value with empty value', () => {
        const fieldValue = FieldValue.create({
            value: '',
            label: 'Some Value'
        });

        expect(fieldValue.isLeft()).toBeTruthy();
        expect(fieldValue.value).toBeInstanceOf(EmptyFieldValueError);
    });

    it('should return an error when trying to create a field value with empty label', () => {
        const fieldValue = FieldValue.create({
            value: 'some-value',
            label: ''
        });

        expect(fieldValue.isLeft()).toBeTruthy();
        expect(fieldValue.value).toBeInstanceOf(EmptyFieldLabelError);
    });
});
