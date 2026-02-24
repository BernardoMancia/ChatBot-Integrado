# ChatBot Integrado com IA / Multi-Platform AI Chatbot

[Português](#português) | [English](#english)

---

## Português

Este é um chatbot omnicanal e multimodal que integra **Discord**, **Telegram** e **WhatsApp** em uma única aplicação Node.js, utilizando o poder da **OpenAI** para fornecer respostas inteligentes, geração e análise de imagens, transcrição de áudios e vídeos.

### 🌟 Funcionalidades e Melhorias

- **Identificação de Grupo**: O bot reconhece de forma inteligente os nomes dos usuários em grupos e chats para manter o contexto adequado.
- **Multimídia Avançada (Vision & Whisper)**:
  - **Download de Vídeos (yt-dlp)**: Detecta links de vídeo, faz o download automático e transcreve o áudio de fundo (Independente de SO, via libs estáticas npm).
  - **Leitura de Mídia Direta**: Envie imagens, fotos de câmera, áudios ou vídeos curtos como arquivo no chat. O bot usa o GPT-4o Vision para descrever a imagem e o Whisper para transcrever áudios ou vídeos.
  - **Geração de Imagens**: `/imagem prompt`.
- **Memória Otimizada**: Mantém contexto por canal/grupo focado. Usa `/limpar` no grupo para zerar o cache do robô.
- **Health Check & Docker**: Mantém uma rota de status HTTP para painéis (porta 3000 por padrão).

### Pré-requisitos
- Node.js 20+
- Chaves via `.env` (OpenAI, Discord, Telegram)

### Como Executar

#### Via Docker (Recomendado)
```bash
docker-compose up -d --build
```

#### Via Node.js (Local)
O projeto agora é 100% autossuficiente (o ffmpeg e yt-dlp agora são instalados na raiz e não dependem do Windows):
```bash
npm install
npm start
```

### Comandos e Ações
- `/imagem <prompt>`: Gera imagens
- `/limpar` ou `/reset`: Limpa o histórico atual do canal/chat.
- **Enviar Imagem**: O bot automaticamente analisa a foto.
- **Enviar Áudio/Vídeo**: O bot ouve ou assiste o arquivo e gera transcrição.
- **Enviar Link Tktok/Ig/YT**: Ele baixa e retorna traduzido/transcrito.

---

## English

This is an omnichannel and multimodal chatbot that integrates **Discord**, **Telegram**, and **WhatsApp** into a single Node.js app, using the power of **OpenAI** to provide intelligent responses, generating and analyzing images, transcribing audio and video.

### 🌟 Features and Improvements
- **Group Identification**: Smart recognition of users in groups/channels.
- **Advanced Multimedia (Vision & Whisper)**: Read direct images using GPT-4o Vision, transcribe media files natively, download yt-dlp links locally through static NPM packages (no system install required).
- **Docker & Health Check**: Includes `PORT` environment handling.

### How to Run
```bash
npm install && npm start
```
*Or via Docker:* `docker-compose up -d --build`
