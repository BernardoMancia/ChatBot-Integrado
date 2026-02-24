import OpenAI from 'openai';
import { ENV } from '../config/env';
import * as fs from 'fs';

export const openai = new OpenAI({
    apiKey: ENV.OPENAI_API_KEY,
});

export async function processChat(prompt: string, platformContext: string): Promise<string> {
    if (!ENV.OPENAI_API_KEY) {
        return 'Chave de API da OpenAI não configurada.';
    }

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: `Você é um assistente virtual inteligente atendendo pelo ${platformContext}. Seja claro, direto e sem adicionar comentários além do solicitado.`
                },
                { role: 'user', content: prompt }
            ]
        });

        return response.choices[0]?.message?.content || 'Sem resposta do assistente.';
    } catch (err) {
        console.error(`[OpenAI Error] Chat:`, err);
        return 'Ocorreu um erro ao falar com a IA.';
    }
}

export async function generateImage(prompt: string): Promise<string> {
    if (!ENV.OPENAI_API_KEY) return 'Chave de API não configurada.';
    try {
        const response = await openai.images.generate({
            model: 'dall-e-3',
            prompt,
            n: 1,
            size: '1024x1024',
        });
        return response.data?.[0]?.url || 'Erro ao obter URL da imagem.';
    } catch (err) {
        console.error(`[OpenAI Error] Image:`, err);
        return 'Ocorreu um erro ao gerar a imagem.';
    }
}

export async function transcribeAudio(filePath: string): Promise<string> {
    if (!ENV.OPENAI_API_KEY) return 'Chave de API não configurada.';
    try {
        const response = await openai.audio.transcriptions.create({
            file: fs.createReadStream(filePath),
            model: 'whisper-1',
        });
        return response.text;
    } catch (err) {
        console.error(`[OpenAI Error] Audio Transcription:`, err);
        return 'Ocorreu um erro ao transcrever o áudio.';
    }
}
