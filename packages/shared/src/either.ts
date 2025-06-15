export type Either<L, A> = Left<L, A> | Right<L, A>;

export class Left<L, A> {
    public constructor(public readonly value: L) {}

    public isLeft(): this is Left<L, A> {
        return true;
    }

    public isRight(): this is Right<L, A> {
        return false;
    }
}

export class Right<L, A> {
    public constructor(public readonly value: A) {}

    public isLeft(): this is Left<L, A> {
        return false;
    }

    public isRight(): this is Right<L, A> {
        return true;
    }
}

export const left = <L, A>(l: L): Either<L, A> => {
    return new Left(l);
};

export const right = <L, A>(a: A): Either<L, A> => {
    return new Right(a);
};
