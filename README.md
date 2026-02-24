# ChatBot Integrado com IA / Multi-Platform AI Chatbot

[Português](#português) | [English](#english)

---

## Português

Este é um chatbot omnicanal e multimodal que integra **Discord**, **Telegram** e **WhatsApp** em uma única aplicação Node.js, utilizando o poder da **OpenAI** para fornecer respostas inteligentes, geração e análise de imagens, transcrição de áudios e vídeos.

### 🌟 Funcionalidades e Melhorias

- **Identificação de Grupo**: O bot reconhece de forma inteligente os nomes dos usuários em grupos e chats para manter o contexto adequado.
- **Multimídia Avançada (Vision & Whisper)**:
  - **Download de Vídeos (yt-dlp)**: Detecta links de vídeo, faz o download automático e transcreve o áudio de fundo de forma nativa e independente do sistema operacional.
  - **Leitura de Mídia Direta**: Envie imagens, áudios ou vídeos curtos diretamente no chat. O bot usa o GPT-4o Vision para descrever imagens e o Whisper para transcrever mídias.
  - **Geração de Imagens**: Comando `/imagem prompt`.
- **Memória Otimizada**: Mantém contexto por canal/grupo. Use `/limpar` para zerar a memória daquele chat específico.
- **Health Check**: Mantém uma rota de status HTTP para painéis de monitoramento (porta 3000 por padrão).

### Pré-requisitos
Para rodar localmente, você precisa do Node.js (versão 20+).
Copie o arquivo `.env.example` para `.env` e preencha suas chaves (OpenAI, Discord, Telegram, etc).

### 🚀 Guia de Deploy e Execução no Linux (VPS)

Se você está rodando o projeto em um servidor Linux (VPS) puro e não tem o Docker instalado, siga os passos abaixo:

#### 1. Instalar o Docker e Docker Compose (Ubuntu/Debian)
Execute os comandos abaixo no seu terminal Linux para instalar as ferramentas necessárias:
```bash
# Atualiza os repositórios e instala dependências base
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg lsb-release

# Adiciona a chave oficial do Docker
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Configura o repositório do Docker
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Instala o Docker e o plugin do Docker Compose
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

> **Nota:** Nas versões mais recentes (Plugin), o comando mudou de `docker-compose` (com hífen) para `docker compose` (com espaço).

#### 2. Comandos de Gerenciamento do Bot (Docker)

Navegue até a pasta do seu projeto (`cd ~/prod/docker/ChatBot-Integrado`) e utilize os comandos abaixo:

- **Iniciar o Bot (em segundo plano):**
  ```bash
  sudo docker compose up -d --build
  ```

- **Ver os Logs do Bot (verificar QR Code do WhatsApp, erros, etc):**
  ```bash
  sudo docker compose logs -f
  ```
  *(Pressione `Ctrl + C` para sair dos logs).*

- **Reiniciar o Bot:**
  ```bash
  sudo docker compose restart
  ```

- **Se o Docker inteiro travar (Serviço do SO):**
  ```bash
  sudo systemctl restart docker
  ```

- **Parar o Bot:**
  ```bash
  sudo docker compose down
  ```

---

### Execução Local (Windows/Mac sem Docker)
O projeto é autossuficiente (o ffmpeg e yt-dlp agora são instalados via NPM e não dependem do sistema operacional).
```bash
npm install
npm start
```

---

## English

This is an omnichannel and multimodal chatbot that integrates **Discord**, **Telegram**, and **WhatsApp** into a single Node.js app, using the power of **OpenAI** to provide intelligent responses, generating and analyzing images, transcribing audio and video.

### 🌟 Features and Improvements
- **Group Identification**: Smart recognition of users in groups/channels.
- **Advanced Multimedia (Vision & Whisper)**: Read direct images using GPT-4o Vision, transcribe media files natively, download yt-dlp links locally through static NPM packages (no system install required).
- **Docker & Health Check**: Includes `PORT` environment handling.

### 🚀 Deployment Guide (Linux VPS)
Newer Docker installations use the compose plugin.
- **Install Docker (Ubuntu):** Use official Docker repos to install `docker-ce` and `docker-compose-plugin`.
- **Start the bot:** `sudo docker compose up -d --build`
- **View logs:** `sudo docker compose logs -f`
- **Stop the bot:** `sudo docker compose down`
- **Restart the bot:** `sudo docker compose restart`

### How to Run Locally
```bash
npm install && npm start
```
