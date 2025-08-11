import Fastify from 'fastify';
import { Bot } from 'grammy';
import dotenv from 'dotenv';
import { TokenQueryService } from './services/token-query-service';
import { TokenAPIService } from './services/token-api-service';
import { AIService } from './services/ai-service';
import { BotService } from './services/bot-service';
import { createMessageHandler } from './handlers/message-handler';

dotenv.config();

const server = Fastify({ logger: true });
const bot = new Bot(process.env.BOT_TOKEN!);

const tokenQueryService = new TokenQueryService();
const tokenAPIService = new TokenAPIService();
const aiService = new AIService();
const botService = new BotService(tokenQueryService, tokenAPIService, aiService);

const messageHandler = createMessageHandler(botService);

const start = async () => {
    try {
        await server.listen({ port: 3000 });
        bot.command('start', (ctx) => ctx.reply('Welcome to AI Token Inspector!'));
        bot.on('message:text', messageHandler);
        bot.start();
    } catch (error) {
        server.log.error(error);
        process.exit(1);
    }
};

start();