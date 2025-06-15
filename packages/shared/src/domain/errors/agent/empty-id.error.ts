import { DomainError } from '..';

export class EmptyAgentIdError implements DomainError {
    public readonly name: string = 'EMPTY_AGENT_ID_ERROR';
    public readonly reason: string = 'Empty agent id provided';
}
