import * as path from 'path';
import * as fs from 'fs';
import { execFile } from 'child_process';
import { promisify } from 'util';
import youtubedl from 'youtube-dl-exec';

const execFileAsync = promisify(execFile);
const ffmpegBin: string = require('ffmpeg-static');

const VIDEO_DIR = path.join(process.cwd(), 'data', 'videos');
if (!fs.existsSync(VIDEO_DIR)) {
    fs.mkdirSync(VIDEO_DIR, { recursive: true });
}

export const VIDEO_REGEX = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be|tiktok\.com|instagram\.com)\/[^\s]+/i;

function findDownloadedFile(baseName: string): string | null {
    const files = fs.readdirSync(VIDEO_DIR);
    const match = files.find(f => f.startsWith(baseName) && !f.endsWith('.mp3'));
    return match ? path.join(VIDEO_DIR, match) : null;
}

export async function downloadVideo(url: string): Promise<{ videoPath: string; audioPath: string }> {
    const baseName = `video_${Date.now()}`;
    const outputTemplate = path.join(VIDEO_DIR, `${baseName}.%(ext)s`);
    const audioPath = path.join(VIDEO_DIR, `${baseName}.mp3`);

    await youtubedl(url, {
        output: outputTemplate,
        format: 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
        mergeOutputFormat: 'mp4',
    });

    const videoPath = findDownloadedFile(baseName);
    if (!videoPath || !fs.existsSync(videoPath)) {
        throw new Error('Arquivo de vídeo não encontrado após download.');
    }

    await execFileAsync(ffmpegBin, ['-y', '-i', videoPath, '-vn', '-acodec', 'libmp3lame', '-q:a', '4', audioPath]);

    return { videoPath, audioPath };
}

export async function extractAudio(inputPath: string, outputMp3Path: string): Promise<void> {
    await execFileAsync(ffmpegBin, ['-y', '-i', inputPath, '-vn', '-acodec', 'libmp3lame', '-q:a', '4', outputMp3Path]);
}

export function cleanupVideoFiles(...files: string[]) {
    files.forEach(file => {
        if (file && fs.existsSync(file)) {
            fs.unlinkSync(file);
        }
    });
}
