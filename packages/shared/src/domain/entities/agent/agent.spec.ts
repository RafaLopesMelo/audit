import { Agent } from './agent.entity';

describe('Agent', () => {
    it('should be able to create an agent successfully', () => {
        const agent = Agent.create({
            id: 'agent-123',
            name: 'Claude'
        });

        expect(agent.isRight()).toBeTruthy();
        expect(agent.value).toBeInstanceOf(Agent);

        if (agent.isRight()) {
            expect(agent.value.toData()).toEqual({
                id: 'agent-123',
                name: 'Claude'
            });
        }
    });

    it('should not be able to create an agent with empty id', () => {
        const agent = Agent.create({
            id: '',
            name: 'Claude'
        });

        expect(agent.isLeft()).toBeTruthy();
        if (agent.isLeft()) {
            expect(agent.value.name).toBe('EMPTY_AGENT_ID_ERROR');
        }
    });

    it('should not be able to create an agent with empty name', () => {
        const agent = Agent.create({
            id: 'agent-123',
            name: ''
        });

        expect(agent.isLeft()).toBeTruthy();
        if (agent.isLeft()) {
            expect(agent.value.name).toBe('EMPTY_AGENT_NAME_ERROR');
        }
    });
});
