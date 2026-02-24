import { config } from 'dotenv';

config({ override: true });

export const ENV = {
    PORT: process.env.PORT || '3000',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
    DISCORD_TOKEN: process.env.DISCORD_TOKEN || '',
    TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN || '',
};
