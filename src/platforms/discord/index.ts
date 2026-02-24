import { Client, GatewayIntentBits, Message } from 'discord.js';
import { ENV } from '../../config/env';
import { processChat, generateImage, transcribeAudio } from '../../core/agent';
import { clearHistory } from '../../core/memory';
import { VIDEO_REGEX, downloadVideo, cleanupVideoFiles } from '../../core/video';

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

    if (text === '/limpar' || text === '/reset') {
        clearHistory(message.author.id);
        await message.reply('Histórico de conversa limpo!');
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

    if (message.mentions.has(discordClient.user!) || message.channel.isDMBased()) {
        const reply = await processChat(text, 'Discord', message.author.id);
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
