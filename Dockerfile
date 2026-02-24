FROM node:20-slim

# Instalar dependências para o Puppeteer (WhatsApp) e processamento de vídeo
RUN apt-get update && apt-get install -y \
    chromium \
    python3 \
    python3-pip \
    ffmpeg \
    fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
    --no-install-recommends \
    && pip3 install --no-cache-dir yt-dlp \
    && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Compilar TypeScript
RUN npx tsc

CMD ["npm", "start"]
