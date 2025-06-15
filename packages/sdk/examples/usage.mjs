import { AuditRecordBuilder } from '../dist/index.esm.js';

async function fromSystem() {
    const r = await AuditRecordBuilder.fromSystem('api-key')
        .setKind('CREATE')
        .setDescription('User {{name}} created folder {{folder}}', {
            name: 'John Doe',
            folder: 'My Documents'
        })
        .setEntity({
            id: '123',
            title: 'My Documents',
            url: '/folders/123',
            kind: {
                id: 'FOLDER',
                label: 'Pasta'
            }
        })
        .addField({
            name: 'name',
            label: 'Nome',
            before: null,
            after: { value: 'My Documents', label: 'My Documents' }
        })
        .setMetadata({
            organizationId: '789'
        })
        .send();

    if (r.isLeft()) {
        console.error('Error sending audit record:', r.value.reason);
        return;
    }

    console.log('Audit record sent successfully');
}

async function fromUser() {
    const r = await AuditRecordBuilder.fromUser('api-key')
        .setAuthor({
            id: '456',
            name: 'John Doe',
            email: 'john@example.com',
            roles: ['PROFESSOR'],
            ip: '192.168.1.1',
            userAgent: 'Mozilla/5.0...'
        })
        .setKind('CREATE')
        .setDescription('User {{name}} created folder {{folder}}', {
            name: 'John Doe',
            folder: 'My Documents'
        })
        .setEntity({
            id: '123',
            title: 'My Documents',
            url: '/folders/123',
            kind: {
                id: 'FOLDER',
                label: 'Pasta'
            }
        })
        .addField({
            name: 'name',
            label: 'Nome',
            before: null,
            after: { value: 'My Documents', label: 'My Documents' }
        })
        .setMetadata({
            organizationId: '789'
        })
        .send();

    if (r.isLeft()) {
        console.error('Error sending audit record:', r.value.reason);
        return;
    }

    console.log('Audit record sent successfully');
}

async function fromAI() {
    const r = await AuditRecordBuilder.fromAI('api-key')
        .setAgent({
            id: '456',
            name: 'Agent'
        })
        .setKind('CREATE')
        .setDescription('User {{name}} created folder {{folder}}', {
            name: 'John Doe',
            folder: 'My Documents'
        })
        .setEntity({
            id: '123',
            title: 'My Documents',
            url: '/folders/123',
            kind: {
                id: 'FOLDER',
                label: 'Pasta'
            }
        })
        .addField({
            name: 'name',
            label: 'Nome',
            before: null,
            after: { value: 'My Documents', label: 'My Documents' }
        })
        .setMetadata({
            organizationId: '789'
        })
        .send();

    if (r.isLeft()) {
        console.error('Error sending audit record:', r.value.reason);
        return;
    }

    console.log('Audit record sent successfully');
}

(async () => {
    console.log('Running examples...');
    await fromSystem();
    await fromAI();
    await fromUser();
    console.log('Examples completed successfully');
})();
