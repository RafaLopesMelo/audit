import { DomainError } from '..';

export class EmptyEntityTitleError implements DomainError {
    public readonly name: string = 'EMPTY_ENTITY_TITLE_ERROR';
    public readonly reason: string = 'Empty entity title provided';
}
