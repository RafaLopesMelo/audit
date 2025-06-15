import { DomainError } from '..';

export class EmptyOriginIpError implements DomainError {
    public readonly name: string = 'EMPTY_ORIGIN_IP_ERROR';
    public readonly reason: string = 'Empty origin IP provided';
}
