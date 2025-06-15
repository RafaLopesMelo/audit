import { EmptyKindError } from '../../errors/kind/empty-kind.error';
import { EmptyKindLabelError } from '../../errors/kind/empty-kind-label.error';
import { Either, left, right } from '@audit/shared/either';

type KindProps = {
    kind: string;
    label: string;
};

export class Kind {
    private constructor(
        private readonly kind: string,
        private readonly label: string
    ) {}

    public static create(
        p: KindProps
    ): Either<EmptyKindError | EmptyKindLabelError, Kind> {
        if (!p.kind.length) {
            return left(new EmptyKindError());
        }

        if (!p.label.length) {
            return left(new EmptyKindLabelError());
        }

        const k = new Kind(p.kind, p.label);
        return right(k);
    }

    public toData() {
        return {
            kind: this.kind,
            label: this.label
        };
    }
}
