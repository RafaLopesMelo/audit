import { DomainError } from '..';

export class EmptyOriginRequestError implements DomainError {
    public readonly name: string = 'EMPTY_ORIGIN_REQUEST_ERROR';
    public readonly reason: string = 'Empty origin request provided';
}
