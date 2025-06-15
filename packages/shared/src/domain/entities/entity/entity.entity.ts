import { EmptyEntityIdError } from '../../errors/entity/empty-id.error';
import { EmptyEntityTitleError } from '../../errors/entity/empty-title.error';
import { EmptyEntityUrlError } from '../../errors/entity/empty-url.error';
import { InvalidEntityKindError } from '../../errors/entity/invalid-kind.error';
import { Either, left, right } from '@audit/shared/either';
import { Kind } from '../kind/kind.entity';

type EntityProps = {
    id: string;
    title: string;
    url: string;
    kind: Kind;
};

export class Entity {
    private constructor(
        private readonly id: string,
        private readonly title: string,
        private readonly url: string,
        private readonly kind: Kind
    ) {}

    public static create(
        p: EntityProps
    ): Either<
        | EmptyEntityIdError
        | EmptyEntityTitleError
        | EmptyEntityUrlError
        | InvalidEntityKindError,
        Entity
    > {
        if (!p.id.length) {
            return left(new EmptyEntityIdError());
        }

        if (!p.title.length) {
            return left(new EmptyEntityTitleError());
        }

        if (!p.url.length) {
            return left(new EmptyEntityUrlError());
        }

        if (!(p.kind instanceof Kind)) {
            return left(new InvalidEntityKindError());
        }

        const e = new Entity(p.id, p.title, p.url, p.kind);
        return right(e);
    }

    public toData() {
        return {
            id: this.id,
            title: this.title,
            url: this.url,
            kind: this.kind.toData()
        };
    }
}
