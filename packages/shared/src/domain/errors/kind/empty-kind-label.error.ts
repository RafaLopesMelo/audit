import { DomainError } from '..';

export class EmptyKindLabelError implements DomainError {
    public readonly name: string = 'EMPTY_KIND_LABEL_ERROR';
    public readonly reason: string = 'Empty kind label provided';
}
