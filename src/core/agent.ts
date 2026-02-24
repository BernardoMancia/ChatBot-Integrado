import OpenAI from 'openai';
import { ENV } from '../config/env';
import * as fs from 'fs';

export const openai = new OpenAI({
    apiKey: ENV.OPENAI_API_KEY,
});

import { loadHistory, saveHistory, Message as MemoryMessage } from './memory';

export async function processChat(prompt: string, platformContext: string, userId: string, userName?: string, base64Image?: string): Promise<string> {
    if (!ENV.OPENAI_API_KEY) {
        return 'Chave de API da OpenAI não configurada.';
    }

    const history = loadHistory(userId);
    const contextPrompt = userName ? `[Mensagem de: ${userName}] ${prompt}` : prompt;

    let userContent: any = contextPrompt;

    if (base64Image) {
        userContent = [
            { type: 'text', text: contextPrompt },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
        ];
    }

    const messages: MemoryMessage[] = [
        {
            role: 'system',
            content: `Você é um assistente virtual inteligente atendendo pelo ${platformContext}. Seu desenvolvedor é o dev com o codinome Luke. O link do repositório deste projeto no GitHub é: https://github.com/BernardoMancia/ChatBot-Integrado.git. 
            Diretriz importante de comportamento: Em alguns momentos as mensagens dos usuários chegarão com o prefixo "[Mensagem de: Nome]". Use isso apenas para *saber* internamente quem está falando com você na conversa (especialmente útil em grupos). Responda naturalmente. Não inicie todas as frases cumprimentando a pessoa pelo nome, apenas use o nome caso o contexto da conversa exija. Capacidade de Visão: Se o usuário enviar uma imagem, você a receberá acoplada à mensagem e deve analisá-la conforme solicitado.`
        },
        ...history,
        { role: 'user', content: userContent }
    ];

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: messages as any
        });

        const reply = response.choices[0]?.message?.content || 'Sem resposta do assistente.';

        history.push({ role: 'user', content: prompt });
        history.push({ role: 'assistant', content: reply });
        saveHistory(userId, history);

        return reply;
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
