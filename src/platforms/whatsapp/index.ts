import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import * as fs from 'fs';
import * as path from 'path';
import { processChat, generateImage, transcribeAudio } from '../../core/agent';
import { clearHistory } from '../../core/memory';
import { VIDEO_REGEX, downloadVideo, cleanupVideoFiles, extractAudio } from '../../core/video';
import { MessageMedia } from 'whatsapp-web.js';

export const startWhatsApp = () => {
    const client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: {
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        }
    });

    client.on('qr', (qr) => {
        console.log('[WhatsApp] Escaneie o QR Code abaixo para conectar.');
        qrcode.generate(qr, { small: true });
    });

    client.on('ready', () => {
        console.log('[WhatsApp] Conectado e pronto!');
    });

    client.on('message', async (msg) => {
        const text = msg.body || '';
        const contact = await msg.getContact();
        const userName = contact.pushname || contact.name || 'Usuário';

        if (text === '/limpar' || text === '/reset') {
            clearHistory(msg.from);
            await msg.reply('Histórico de conversa limpo neste chat!');
            return;
        }

        if (text.startsWith('/imagem ')) {
            const prompt = text.replace('/imagem ', '');
            await msg.reply('Gerando imagem...');
            const url = await generateImage(prompt);
            await msg.reply(url);
            return;
        }

        if (VIDEO_REGEX.test(text)) {
            const link = text.match(VIDEO_REGEX)![0];
            await msg.reply('Vídeo detectado! Processando download e transcrição...');
            try {
                const { videoPath, audioPath } = await downloadVideo(link);
                const transcription = await transcribeAudio(audioPath);
                const media = MessageMedia.fromFilePath(videoPath);
                await client.sendMessage(msg.from, media, {
                    caption: transcription ? `*Transcrição:* ${transcription}` : undefined
                });
                cleanupVideoFiles(videoPath, audioPath);
            } catch (error) {
                console.error('[WhatsApp Video Error]', error);
                await msg.reply('Erro ao processar o vídeo.');
            }
            return;
        }

        if (msg.hasMedia) {
            const media = await msg.downloadMedia();
            if (!media) return;

            if (media.mimetype.includes('image')) {
                await msg.reply('Imagem recebida! Deixa eu analisar...');
                try {
                    const textContent = text || 'Descreva esta imagem para mim.';
                    const response = await processChat(textContent, 'WhatsApp', msg.from, userName, media.data);
                    await msg.reply(response);
                } catch (err) {
                    console.error('[WhatsApp Image Error]', err);
                    await msg.reply('Ocorreu um erro ao processar a imagem.');
                }
                return;
            }

            if (media.mimetype.includes('audio') || media.mimetype.includes('video')) {
                await msg.reply('Processando áudio/vídeo...');
                const dataDir = path.join(process.cwd(), 'data', 'media');
                if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
                const ext = media.mimetype.includes('video') ? 'mp4' : 'ogg';
                const tempFile = path.join(dataDir, `wa_media_${Date.now()}.${ext}`);
                let audioToTranscribe = tempFile;

                try {
                    fs.writeFileSync(tempFile, media.data, { encoding: 'base64' });

                    if (ext === 'mp4') {
                        audioToTranscribe = tempFile.replace('.mp4', '.mp3');
                        await extractAudio(tempFile, audioToTranscribe);
                    }

                    const transcription = await transcribeAudio(audioToTranscribe);

                    if (!transcription) {
                        await msg.reply('Não consegui entender o áudio.');
                        return;
                    }

                    const chatReply = await processChat(
                        `Ouvi/Vi o seguinte do usuário: "${transcription}". Por favor, responda a ele de acordo.`,
                        'WhatsApp', msg.from, userName
                    );

                    await msg.reply(`*Transcrição:* ${transcription}\n\n*Resposta:* ${chatReply}`);
                } catch (err) {
                    console.error('[WhatsApp Media Error]', err);
                    await msg.reply('Ocorreu um erro ao processar a mídia.');
                } finally {
                    cleanupVideoFiles(tempFile, ext === 'mp4' ? audioToTranscribe : '');
                }
                return;
            }
        }

        if (text && !text.startsWith('/')) {
            const response = await processChat(text, 'WhatsApp', msg.from, userName);
            await msg.reply(response);
        }
    });

    client.initialize().catch(err => console.error('[WhatsApp Init Error]', err));
};
