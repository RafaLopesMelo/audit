export function Logger(context: string) {
    return new ConsoleLogger(context);
}

const buildMessage = (context: string, message: string) => {
    return `[${context}] ${message}`;
};

class ConsoleLogger {
    public constructor(public readonly ctx: string) {}

    public log(message: string) {
        console.log(buildMessage(this.ctx, message));
    }

    public error(message: string) {
        console.error(buildMessage(this.ctx, message));
    }
}
