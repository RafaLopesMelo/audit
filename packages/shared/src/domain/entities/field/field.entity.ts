export * from './field-value.entity';

import { EmptyFieldNameError } from '../../errors/field/empty-name.error';
import { EmptyFieldLabelError } from '../../errors/field/empty-label.error';
import { InvalidFieldValueError } from '../../errors/field/invalid-field-value.error';
import { Either, left, right } from '@audit/shared/either';
import { FieldValue } from './field-value.entity';

type FieldProps = {
    name: string;
    label: string;
    before: FieldValue | null;
    after: FieldValue | null;
};

export class Field {
    private constructor(
        private readonly name: string,
        private readonly label: string,
        private readonly before: FieldValue | null,
        private readonly after: FieldValue | null
    ) {}

    public static create(
        p: FieldProps
    ): Either<
        EmptyFieldNameError | EmptyFieldLabelError | InvalidFieldValueError,
        Field
    > {
        if (!p.name.length) {
            return left(new EmptyFieldNameError());
        }

        if (!p.label.length) {
            return left(new EmptyFieldLabelError());
        }

        if (p.before !== null && !(p.before instanceof FieldValue)) {
            return left(new InvalidFieldValueError('before'));
        }

        if (p.after !== null && !(p.after instanceof FieldValue)) {
            return left(new InvalidFieldValueError('after'));
        }

        const f = new Field(p.name, p.label, p.before, p.after);
        return right(f);
    }

    public toData() {
        return {
            name: this.name,
            label: this.label,
            before: this.before ? this.before.toData() : null,
            after: this.after ? this.after.toData() : null
        };
    }
}
