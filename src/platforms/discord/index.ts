import { Client, GatewayIntentBits, Message } from 'discord.js';
import { ENV } from '../../config/env';
import { processChat, generateImage } from '../../core/agent';
import { clearHistory } from '../../core/memory';

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
