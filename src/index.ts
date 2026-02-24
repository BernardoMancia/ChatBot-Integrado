import { startDiscord } from './platforms/discord';
import { startTelegram } from './platforms/telegram';
import { startWhatsApp } from './platforms/whatsapp';
import { ENV } from './config/env';
import http from 'http';

console.log('Iniciando o Chatbot Integrado com IA...');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Chatbot Online\n');
});

server.listen(ENV.PORT, () => {
    console.log(`[Server] Health-check rodando na porta ${ENV.PORT}`);
});

try {
    startDiscord();
    startTelegram();
    startWhatsApp();
} catch (error) {
    console.error('Erro ao iniciar plataformas:', error);
}
