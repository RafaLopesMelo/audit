import {
    GetObjectCommand,
    PutObjectCommand,
    S3Client
} from '@aws-sdk/client-s3';

export class Storage {
    private static s3 = new S3Client();
    private bucket: string;

    public constructor() {
        const bucket = process.env.AWS_S3_BUCKET;

        if (!bucket) {
            throw new Error('Missing AWS_S3_BUCKET environment variable');
        }

        this.bucket = bucket;
    }

    public async upload(
        key: string,
        content: Buffer,
        metadata: Record<string, string>
    ) {
        const cmd = new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: content,
            Metadata: metadata,
            ContentType: 'application/json',
            ContentEncoding: 'gzip'
        });

        await Storage.s3.send(cmd);
    }

    public async load(key: string): Promise<Buffer | null> {
        try {
            const cmd = new GetObjectCommand({
                Bucket: this.bucket,
                Key: key
            });

            const r = await Storage.s3.send(cmd);

            if (!r.Body) {
                return null;
            }

            return Buffer.from(await r.Body.transformToByteArray());
        } catch {
            return null;
        }
    }
}
