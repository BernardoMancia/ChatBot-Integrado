import * as fs from 'fs';
import * as path from 'path';

const MEMORY_DIR = path.join(process.cwd(), 'data', 'memory');

if (!fs.existsSync(MEMORY_DIR)) {
    fs.mkdirSync(MEMORY_DIR, { recursive: true });
}

export type Message = {
    role: 'user' | 'assistant' | 'system';
    content: string;
};

export function getMemoryPath(userId: string): string {
    return path.join(MEMORY_DIR, `${userId.replace(/[^a-z0-9]/gi, '_')}.json`);
}

export function loadHistory(userId: string): Message[] {
    const filePath = getMemoryPath(userId);
    if (fs.existsSync(filePath)) {
        try {
            return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        } catch (e) {
            return [];
        }
    }
    return [];
}

export function saveHistory(userId: string, history: Message[]): void {
    const filePath = getMemoryPath(userId);
    const limitedHistory = history.slice(-20);
    fs.writeFileSync(filePath, JSON.stringify(limitedHistory, null, 2));
}

export function clearHistory(userId: string): void {
    const filePath = getMemoryPath(userId);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
}
