import { Client, GatewayIntentBits, Message } from 'discord.js';
import { ENV } from '../../config/env';
import { processChat, generateImage, transcribeAudio } from '../../core/agent';
import { clearHistory } from '../../core/memory';
import { VIDEO_REGEX, downloadVideo, cleanupVideoFiles, extractAudio } from '../../core/video';
import * as fs from 'fs';
import * as path from 'path';

export const discordClient = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

discordClient.on('ready', () => {
    console.log(`[Discord] Conectado como ${discordClient.user?.tag}`);
});

discordClient.on('messageCreate', async (message: Message) => {
    if (message.author.bot) return;

    const text = message.content.trim();
    if (!text) return;

    const chatId = message.channel.isDMBased() ? message.author.id : message.channel.id;
    const userName = message.author.displayName || message.author.username;

    if (text === '/limpar' || text === '/reset') {
        clearHistory(chatId);
        await message.reply('Histórico de conversa limpo para este canal!');
        return;
    }

    if (text.startsWith('/imagem ')) {
        const prompt = text.replace('/imagem ', '');
        const msg = await message.reply('Gerando imagem, aguarde...');
        const imageUrl = await generateImage(prompt);
        await msg.edit(imageUrl);
        return;
    }

    if (VIDEO_REGEX.test(text)) {
        const link = text.match(VIDEO_REGEX)![0];
        const statusMsg = await message.reply('Link de vídeo detectado! Baixando e processando...');

        try {
            const { videoPath, audioPath } = await downloadVideo(link);
            const transcription = await transcribeAudio(audioPath);

            await message.reply({
                content: transcription ? `*Transcrição do vídeo:* ${transcription}` : 'Não consegui transcrever o áudio do vídeo.',
                files: [videoPath]
            });

            cleanupVideoFiles(videoPath, audioPath);
            await statusMsg.delete();
        } catch (error) {
            await statusMsg.edit('Erro ao processar o vídeo.');
        }
        return;
    }

    if (message.attachments.size > 0 && (message.mentions.has(discordClient.user!) || message.channel.isDMBased())) {
        const attachment = message.attachments.first();
        if (!attachment) return;

        if (attachment.contentType?.startsWith('image/')) {
            const statusMsg = await message.reply('Imagem recebida! Puxando para análise...');
            try {
                const response = await fetch(attachment.url);
                const arrayBuffer = await response.arrayBuffer();
                const base64Image = Buffer.from(arrayBuffer).toString('base64');
                const textContent = text || 'Analise esta imagem.';

                const aiReply = await processChat(textContent, 'Discord', chatId, userName, base64Image);
                await message.reply(aiReply);
                await statusMsg.delete();
            } catch (err) {
                console.error('[Discord Image Error]', err);
                await statusMsg.edit('Ocorreu um erro ao processar a imagem.');
            }
            return;
        }

        if (attachment.contentType?.startsWith('audio/') || attachment.contentType?.startsWith('video/')) {
            const statusMsg = await message.reply('Processando áudio/vídeo enviado...');
            const ext = attachment.contentType.startsWith('video/') ? 'mp4' : 'ogg';
            const dataDir = path.join(process.cwd(), 'data', 'media');
            if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
            const tempFile = path.join(dataDir, `discord_media_${Date.now()}.${ext}`);
            let audioToTranscribe = tempFile;

            try {
                const response = await fetch(attachment.url);
                const arrayBuffer = await response.arrayBuffer();
                fs.writeFileSync(tempFile, Buffer.from(arrayBuffer));

                if (ext === 'mp4') {
                    audioToTranscribe = tempFile.replace('.mp4', '.mp3');
                    await extractAudio(tempFile, audioToTranscribe);
                }

                const transcription = await transcribeAudio(audioToTranscribe);

                if (!transcription) {
                    await statusMsg.edit('Não consegui entender este áudio/vídeo.');
                    return;
                }

                const chatReply = await processChat(`Transcrevi o seguinte áudio do usuário: "${transcription}". Por favor, responda a ele de acordo.`, 'Discord', chatId, userName);

                await message.reply(`*Transcrição:* ${transcription}\n\n*Resposta:* ${chatReply}`);
                await statusMsg.delete();
            } catch (err) {
                console.error('[Discord Media Error]', err);
                await statusMsg.edit('Ocorreu um erro ao processar a mídia.');
            } finally {
                cleanupVideoFiles(tempFile, ext === 'mp4' ? audioToTranscribe : '');
            }
            return;
        }
    }

    if (message.mentions.has(discordClient.user!) || message.channel.isDMBased()) {
        const reply = await processChat(text, 'Discord', chatId, userName);
        await message.reply(reply);
    }
});

export const startDiscord = () => {
    if (!ENV.DISCORD_TOKEN) {
        console.warn('[Discord] Token não configurado. Pulando...');
        return;
    }
    discordClient.login(ENV.DISCORD_TOKEN);
};
