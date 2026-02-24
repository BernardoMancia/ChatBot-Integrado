import * as path from 'path';
import * as fs from 'fs';
import { execFile } from 'child_process';
import { promisify } from 'util';
import ytdl from '@distube/ytdl-core';

const execFileAsync = promisify(execFile);
const ffmpegBin: string = require('ffmpeg-static');

const VIDEO_DIR = path.join(process.cwd(), 'data', 'videos');
if (!fs.existsSync(VIDEO_DIR)) {
    fs.mkdirSync(VIDEO_DIR, { recursive: true });
}

// Foco em YouTube, pois ytdl-core é focado no YouTube
export const VIDEO_REGEX = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/[^\s]+/i;

export async function downloadVideo(url: string): Promise<{ videoPath: string; audioPath: string }> {
    const baseName = `video_${Date.now()}`;
    const videoPath = path.join(VIDEO_DIR, `${baseName}.mp4`);
    const audioPath = path.join(VIDEO_DIR, `${baseName}.mp3`);

    if (!ytdl.validateURL(url)) {
        throw new Error('URL de vídeo inválida.');
    }

    return new Promise((resolve, reject) => {
        const stream = ytdl(url, { quality: 'lowestvideo', filter: 'audioandvideo' });
        const writeStream = fs.createWriteStream(videoPath);

        stream.pipe(writeStream);

        stream.on('error', (err) => {
            reject(new Error(`Erro baixar stream: ${err.message}`));
        });

        writeStream.on('finish', async () => {
            try {
                await extractAudio(videoPath, audioPath);
                resolve({ videoPath, audioPath });
            } catch (err: any) {
                reject(new Error(`Erro ao extrair áudio: ${err.message}`));
            }
        });
    });
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
