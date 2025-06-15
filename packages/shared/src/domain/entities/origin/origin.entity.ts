import { Either, right } from '@audit/shared/either';

export type OriginKind = 'USER' | 'SYSTEM' | 'AI';

export class Origin {
    private constructor(private readonly type: OriginKind) {}

    public static create(type: OriginKind): Either<never, Origin> {
        const validTypes: OriginKind[] = ['USER', 'SYSTEM', 'AI'];
        const validType = validTypes.includes(type) ? type : 'USER';
        const o = new Origin(validType);
        return right(o);
    }

    public toData() {
        return this.type;
    }
}
