import { DomainError } from '..';

export class EmptyOriginUserAgentError implements DomainError {
    public readonly name: string = 'EMPTY_ORIGIN_USER_AGENT_ERROR';
    public readonly reason: string = 'Empty origin user agent provided';
}
