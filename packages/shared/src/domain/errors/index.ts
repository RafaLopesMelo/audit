export interface DomainError {
    name: string;
    reason: string;
}

export class UnknownError implements DomainError {
    public readonly name: string = 'UNKNOWN_ERROR';
    public readonly reason: string = 'An unknown error has occurred';
}
