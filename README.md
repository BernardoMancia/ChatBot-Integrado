# ChatBot Integrado com IA

Este é um chatbot omnicanal que integra **Discord**, **Telegram** e **WhatsApp** em uma única aplicação Node.js, utilizando o poder da **OpenAI** para fornecer respostas inteligentes, geração de imagens, transcrição de áudio e muito mais.

## Funcionalidades

- **Inteligência Artificial**: Conversação natural, tradução, resumo de textos e pesquisa.
- **Transmissão Multicanal**: Receba e responda mensagens simultaneamente no Discord, Telegram e WhatsApp.
- **Multimídia**:
  - Geração de imagens via DALL-E 3 (`/imagem prompt`).
  - Transcrição automática de áudios recebidos via Whisper.
- **Docker Ready**: Fácil de rodar em qualquer ambiente via Docker.

## Pré-requisitos

- Node.js 20+ (para rodar localmente)
- Docker e Docker Compose (para rodar em container)
- Contas e Tokens:
  - OpenAI API Key
  - Discord Bot Token e Client ID
  - Telegram Bot Token

## Configuração

1. Clone o repositório.
2. Crie um arquivo `.env` na raiz baseado no `.env.example`.
3. Preencha as chaves de API necessárias.

## Como Executar

### Via Docker (Recomendado)

```bash
docker-compose up -d --build
```

### Via Node.js (Local)

```bash
npm install
npm start
```

## Comandos Disponíveis

- `/imagem <prompt>`: Gera uma imagem no Chat selecionado.
- Envie um áudio: O bot transcreve o conteúdo automaticamente.
- Marque o bot no Discord ou Telegram: Inicie uma conversa via IA.
- Envie mensagem direta no WhatsApp: O bot responde como assistente.
