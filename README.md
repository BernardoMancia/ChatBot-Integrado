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
- **Health Check**: Servidor HTTP integrado para monitoramento de status da plataforma.

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
4. **Porta**: Por padrão a aplicação usa a porta `3000`. Você pode alterar definindo `PORT=sua_porta` no seu arquivo `.env`.

### Como Executar

#### Via Docker (Recomendado)

```bash
docker-compose up -d --build
```

No Docker, a aplicação mapeia a porta interna definida no `.env`. Lembre-se de ajustar o campo `ports` no `docker-compose.yml` se mudar a porta padrão.

#### Via Node.js (Local)

```bash
npm install
npm start
```

### Ambiente de Produção

Para rodar em produção de forma estável, recomenda-se o uso do **Docker Compose**, pois ele gerencia automaticamente a reinicialização e as dependências do sistema:

```bash
# Iniciar em modo background
docker-compose up -d --build

# Ver logs em tempo real
docker-compose logs -f
```

Caso prefira rodar via Node.js sem Docker, utilize o **PM2** para manter o processo vivo:

```bash
npm install -g pm2
pm2 start dist/index.js --name "chatbot-integrado"
```

### Comandos Disponíveis

- `/imagem <prompt>`: Gera uma imagem no Chat selecionado.
- Envie um áudio: O bot transcreve o conteúdo automaticamente.
- Marque o bot no Discord ou Telegram: Inicie uma conversa via IA.
- Envie mensagem direta no WhatsApp: O bot responde como assistente.
- `/limpar` ou `/reset`: Limpa o histórico de memória do chat do usuário.

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
- **Health Check**: Integrated HTTP server for platform status monitoring.

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
4. **Port**: By default, the application uses port `3000`. You can change it by setting `PORT=your_port` in your `.env` file.

### How to Run

#### Via Docker (Recommended)

```bash
docker-compose up -d --build
```

In Docker, the application maps the internal port defined in `.env`. Remember to adjust the `ports` field in `docker-compose.yml` if you change the default port.

#### Via Node.js (Local)

```bash
npm install
npm start
```

### Production Environment

For a stable production deployment, it is recommended to use **Docker Compose**, as it automatically manages restarts and system dependencies:

```bash
# Start in background mode
docker-compose up -d --build

# View real-time logs
docker-compose logs -f
```

If you prefer to run via Node.js without Docker, use **PM2** to keep the process alive:

```bash
npm install -g pm2
pm2 start dist/index.js --name "chatbot-integrado"
```

### Available Commands

- `/imagem <prompt>`: Generates an image in the selected chat.
- Send an audio message: The bot transcribes the content automatically.
- Mention the bot on Discord or Telegram: Start an AI-powered conversation.
- Send a direct message on WhatsApp: The bot responds as an assistant.
- `/limpar` or `/reset`: Clears the user's chat memory history.
