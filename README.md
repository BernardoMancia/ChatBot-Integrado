# ChatBot Integrado com IA / Multi-Platform AI Chatbot

[Português](#português) | [English](#english)

---

## Português

Este é um chatbot omnicanal que integra **Discord**, **Telegram** e **WhatsApp** em uma única aplicação Node.js, utilizando o poder da **OpenAI** para fornecer respostas inteligentes, geração de imagens, transcrição de áudio e muito mais.

### Funcionalidades

- **Inteligência Artificial**: Conversação natural, tradução, resumo de textos e pesquisa.
- **Transmissão Multicanal**: Receba e responda mensagens simultaneamente no Discord, Telegram e WhatsApp.
- **Multimídia**:
  - Geração de imagens via DALL-E 3 (`/imagem prompt`).
  - Transcrição automática de áudios recebidos via Whisper.
- **Docker Ready**: Fácil de rodar em qualquer ambiente via Docker.

### Pré-requisitos

- Node.js 20+ (para rodar localmente)
- Docker e Docker Compose (para rodar em container)
- Contas e Tokens:
  - OpenAI API Key
  - Discord Bot Token e Client ID
  - Telegram Bot Token

### Configuração

1. Clone o repositório.
2. Crie um arquivo `.env` na raiz baseado no `.env.example`.
3. Preencha as chaves de API necessárias.

### Como Executar

#### Via Docker (Recomendado)

```bash
docker-compose up -d --build
```

#### Via Node.js (Local)

```bash
npm install
npm start
```

### Comandos Disponíveis

- `/imagem <prompt>`: Gera uma imagem no Chat selecionado.
- Envie um áudio: O bot transcreve o conteúdo automaticamente.
- Marque o bot no Discord ou Telegram: Inicie uma conversa via IA.
- Envie mensagem direta no WhatsApp: O bot responde como assistente.

---

## English

This is an omnichannel chatbot that integrates **Discord**, **Telegram**, and **WhatsApp** into a single Node.js application, leveraging the power of **OpenAI** to provide intelligent responses, image generation, audio transcription, and more.

### Features

- **Artificial Intelligence**: Natural conversation, translation, text summarization, and search.
- **Multi-platform Streaming**: Receive and respond to messages simultaneously on Discord, Telegram, and WhatsApp.
- **Multimedia**:
  - Image generation via DALL-E 3 (`/imagem prompt`).
  - Automatic transcription of received audio via Whisper.
- **Docker Ready**: Easy to run in any environment via Docker.

### Prerequisites

- Node.js 20+ (to run locally)
- Docker and Docker Compose (to run in a container)
- Accounts and Tokens:
  - OpenAI API Key
  - Discord Bot Token and Client ID
  - Telegram Bot Token

### Configuration

1. Clone the repository.
2. Create a `.env` file in the root directory based on `.env.example`.
3. Fill in the necessary API keys.

### How to Run

#### Via Docker (Recommended)

```bash
docker-compose up -d --build
```

#### Via Node.js (Local)

```bash
npm install
npm start
```

### Available Commands

- `/imagem <prompt>`: Generates an image in the selected chat.
- Send an audio message: The bot transcribes the content automatically.
- Mention the bot on Discord or Telegram: Start an AI-powered conversation.
- Send a direct message on WhatsApp: The bot responds as an assistant.
