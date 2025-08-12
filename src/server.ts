import Fastify from 'fastify';
import { Bot } from 'grammy';
import dotenv from 'dotenv';
import tokenQueryPlugin from './plugins/token-query-plugin';
import tokenAPIServicePlugin from './plugins/token-api-plugin';
import aiPlugin from './plugins/ai-plugin';
import botPlugin from './plugins/bot-plugin';
import { createMessageHandler } from './handlers/message-handler';

dotenv.config();

const server = Fastify({ logger: true });
const bot = new Bot(process.env.BOT_TOKEN!);

const registerPlugins = async () => {
    await server.register(tokenQueryPlugin);
    await server.register(tokenAPIServicePlugin);
    await server.register(aiPlugin);
    await server.register(botPlugin);
};

const start = async () => {
    try {
        await registerPlugins();
        await server.listen({ port: 3000 });

        bot.command('start', (ctx) => ctx.reply('Welcome to AI Token Inspector!'));
        bot.on('message:text', createMessageHandler(server.botService));
        bot.start();
    } catch (error) {
        server.log.error(error);
        process.exit(1);
    }
};

start();