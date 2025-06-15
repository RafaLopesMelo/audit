import { EmptyAgentIdError } from '../../errors/agent/empty-id.error';
import { EmptyAgentNameError } from '../../errors/agent/empty-name.error';
import { Either, left, right } from '@audit/shared/either';

type AgentProps = {
    id: string;
    name: string;
};

export class Agent {
    private constructor(
        private readonly id: string,
        private readonly name: string
    ) {}

    public static create(
        p: AgentProps
    ): Either<EmptyAgentIdError | EmptyAgentNameError, Agent> {
        if (!p.id.length) {
            return left(new EmptyAgentIdError());
        }

        if (!p.name.length) {
            return left(new EmptyAgentNameError());
        }

        const a = new Agent(p.id, p.name);
        return right(a);
    }

    public toData() {
        return {
            id: this.id,
            name: this.name
        };
    }
}
