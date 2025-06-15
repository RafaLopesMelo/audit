import { DomainError } from '..';

export class DescriptionValueWithNoPlaceholderError implements DomainError {
    public readonly name: string = 'DESCRIPTION_VALUE_WITH_NO_PLACEHOLDER';
    public readonly reason: string =
        'Description value with no placeholder provided';
}
