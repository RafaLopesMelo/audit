import { EmptyDescriptionTemplateError } from '../../errors/description/empty-template.error';
import { InvalidDescriptionValueError } from '../../errors/description/invalid-description-value.error';
import { DescriptionValueWithNoPlaceholderError } from '../../errors/description/value-with-no-placeholder-provided.error';
import { Either, left, right } from '@audit/shared/either';

type DescriptionProps = {
    template: string;
    values: Record<string, string>;
};

export class Description {
    private constructor(
        private readonly template: string,
        private readonly values: Record<string, string>
    ) {}

    public static create(
        p: DescriptionProps
    ): Either<
        | InvalidDescriptionValueError
        | DescriptionValueWithNoPlaceholderError
        | EmptyDescriptionTemplateError,
        Description
    > {
        if (!p.template.length) {
            return left(new EmptyDescriptionTemplateError());
        }

        for (const [k, v] of Object.entries(p.values)) {
            if (typeof v !== 'string') {
                return left(new InvalidDescriptionValueError());
            }

            if (!p.template.includes(Description.toPlaceholder(k))) {
                return left(new DescriptionValueWithNoPlaceholderError());
            }
        }

        const d = new Description(p.template, p.values);
        return right(d);
    }

    private static toPlaceholder(k: string) {
        return `{{${k}}}`;
    }

    public toData() {
        return {
            template: this.template,
            values: this.values
        };
    }
}
