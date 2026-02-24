import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import * as fs from 'fs';
import * as path from 'path';
import { processChat, generateImage, transcribeAudio } from '../../core/agent';
import { clearHistory } from '../../core/memory';

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

        if (text === '/limpar' || text === '/reset') {
            clearHistory(msg.from);
            await msg.reply('Histórico de conversa limpo!');
            return;
        }

        if (text.startsWith('/imagem ')) {
            const prompt = text.replace('/imagem ', '');
            await msg.reply('Gerando imagem...');
            const url = await generateImage(prompt);
            await msg.reply(url);
            return;
        }

        if (msg.hasMedia) {
            const media = await msg.downloadMedia();
            if (media && media.mimetype.includes('audio')) {
                await msg.reply('Processando áudio...');
                const tempFile = path.join(__dirname, `temp_audio_${Date.now()}.ogg`);

                try {
                    fs.writeFileSync(tempFile, media.data, { encoding: 'base64' });
                    const transcription = await transcribeAudio(tempFile);

                    if (!transcription) {
                        await msg.reply('Não consegui entender o áudio.');
                        return;
                    }

                    const chatReply = await processChat(`Transcrevi o seguinte áudio do usuário: "${transcription}". Por favor, responda a ele de acordo.`, 'WhatsApp', msg.from);

                    await msg.reply(`*Transcrição:* ${transcription}\n\n*Resposta:* ${chatReply}`);
                } catch (err) {
                    console.error('[WhatsApp Audio Error]', err);
                    await msg.reply('Ocorreu um erro ao processar o áudio.');
                } finally {
                    if (fs.existsSync(tempFile)) {
                        fs.unlinkSync(tempFile);
                    }
                }
                return;
            }
        }

        if (text && !text.startsWith('/')) {
            const response = await processChat(text, 'WhatsApp', msg.from);
            await msg.reply(response);
        }
    });

    client.initialize().catch(err => console.error('[WhatsApp Init Error]', err));
};
