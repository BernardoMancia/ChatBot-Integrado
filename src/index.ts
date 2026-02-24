import { startDiscord } from './platforms/discord';
import { startTelegram } from './platforms/telegram';
import { startWhatsApp } from './platforms/whatsapp';

console.log('Iniciando o Chatbot Integrado com IA...');

try {
    startDiscord();
    startTelegram();
    startWhatsApp();
} catch (error) {
    console.error('Erro ao iniciar plataformas:', error);
}
