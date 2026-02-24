import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { ENV } from '../../config/env';
import { processChat, generateImage, transcribeAudio } from '../../core/agent';
import { clearHistory } from '../../core/memory';
import { VIDEO_REGEX, downloadVideo, cleanupVideoFiles } from '../../core/video';

export const startTelegram = () => {
    if (!ENV.TELEGRAM_TOKEN) {
        console.warn('[Telegram] Token não configurado. Pulando...');
        return;
    }

    const bot = new Telegraf(ENV.TELEGRAM_TOKEN);

    bot.command(['limpar', 'reset'], (ctx) => {
        clearHistory(ctx.from.id.toString());
        ctx.reply('Histórico de conversa limpo!');
    });

    bot.command('imagem', async (ctx) => {
        const prompt = ctx.message.text.split(' ').slice(1).join(' ');
        if (!prompt) {
            return ctx.reply('Por favor, informe o que deseja desenhar logo após o /imagem');
        }
        const msg = await ctx.reply('Gerando imagem...');
        const url = await generateImage(prompt);
        await ctx.reply(url);
    });

    bot.on(message('text'), async (ctx) => {
        const text = ctx.message.text;
        if (text.startsWith('/')) return;

        if (VIDEO_REGEX.test(text)) {
            const link = text.match(VIDEO_REGEX)![0];
            const statusMsg = await ctx.reply('Vídeo detectado! Processando...');

            try {
                const { videoPath, audioPath } = await downloadVideo(link);
                const transcription = await transcribeAudio(audioPath);

                await ctx.replyWithVideo({ source: videoPath }, {
                    caption: transcription ? `*Transcrição:* ${transcription}` : undefined,
                    parse_mode: 'Markdown'
                });

                cleanupVideoFiles(videoPath, audioPath);
            } catch (error) {
                await ctx.reply('Erro ao baixar vídeo.');
            }
            return;
        }

        const response = await processChat(text, 'Telegram', ctx.from.id.toString());
        await ctx.reply(response);
    });

    bot.launch()
        .then(() => console.log('[Telegram] Conectado com sucesso'))
        .catch((err) => console.error('[Telegram] Erro:', err));

    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
};
