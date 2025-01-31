"use server"

import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

export async function encryptKey(text: string): Promise<string> {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
        'aes-256-gcm',
        Buffer.from(ENCRYPTION_KEY!, 'hex'),
        iv
    );

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();

    return iv.toString('hex') + authTag.toString('hex') + encrypted;
}

export async function decryptKey(encryptedText: string): Promise<string> {
    const iv = Buffer.from(encryptedText.slice(0, 32), 'hex');
    const authTag = Buffer.from(encryptedText.slice(32, 64), 'hex');
    const encrypted = encryptedText.slice(64);

    const decipher = crypto.createDecipheriv(
        'aes-256-gcm',
        Buffer.from(ENCRYPTION_KEY!, 'hex'),
        iv
    );

    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}