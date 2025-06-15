import { DomainError } from '..';

export class EmptyDescriptionTemplateError implements DomainError {
    public readonly name: string = 'EMPTY_DESCRIPTION_TEMPLATE_ERROR';
    public readonly reason: string = 'Empty description template provided';
}
