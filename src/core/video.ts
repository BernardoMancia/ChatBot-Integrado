import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs';

const execAsync = promisify(exec);

const VIDEO_DIR = path.join(process.cwd(), 'data', 'videos');
if (!fs.existsSync(VIDEO_DIR)) {
    fs.mkdirSync(VIDEO_DIR, { recursive: true });
}

export const VIDEO_REGEX = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be|tiktok\.com|instagram\.com)\/[^\s]+/i;

export async function downloadVideo(url: string): Promise<{ videoPath: string; audioPath: string }> {
    const filename = `video_${Date.now()}`;
    const videoPath = path.join(VIDEO_DIR, `${filename}.mp4`);
    const audioPath = path.join(VIDEO_DIR, `${filename}.mp3`);

    try {
        await execAsync(`yt-dlp -o "${videoPath}" -f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best" "${url}"`);

        await execAsync(`ffmpeg -i "${videoPath}" -vn -acodec libmp3lame "${audioPath}"`);

        return { videoPath, audioPath };
    } catch (error) {
        console.error('[Video Download Error]', error);
        throw new Error('Falha ao baixar vídeo.');
    }
}

export function cleanupVideoFiles(...files: string[]) {
    files.forEach(file => {
        if (file && fs.existsSync(file)) {
            fs.unlinkSync(file);
        }
    });
}
