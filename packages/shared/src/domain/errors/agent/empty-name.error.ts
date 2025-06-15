import { DomainError } from '..';

export class EmptyAgentNameError implements DomainError {
    public readonly name: string = 'EMPTY_AGENT_NAME_ERROR';
    public readonly reason: string = 'Empty agent name provided';
}
