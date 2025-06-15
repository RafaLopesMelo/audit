import { EmptyFieldValueError } from '../../errors/field/empty-value.error';
import { EmptyFieldLabelError } from '../../errors/field/empty-label.error';
import { Either, left, right } from '@audit/shared/either';

type FieldValueProps = {
    value: string;
    label: string;
};

export class FieldValue {
    private constructor(
        private readonly value: string,
        private readonly label: string
    ) {}

    public static create(
        p: FieldValueProps
    ): Either<EmptyFieldValueError | EmptyFieldLabelError, FieldValue> {
        if (!p.value.length) {
            return left(new EmptyFieldValueError());
        }

        if (!p.label.length) {
            return left(new EmptyFieldLabelError());
        }

        const fv = new FieldValue(p.value, p.label);
        return right(fv);
    }

    public toData() {
        return {
            value: this.value,
            label: this.label
        };
    }
}
