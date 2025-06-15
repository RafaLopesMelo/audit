import { DomainError } from '..';

export class EmptyKindError implements DomainError {
    public readonly name: string = 'EMPTY_KIND_ERROR';
    public readonly reason: string = 'Empty kind provided';
}
