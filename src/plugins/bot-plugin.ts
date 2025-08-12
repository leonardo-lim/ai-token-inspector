import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { BotService } from '../services/bot-service';

declare module 'fastify' {
    interface FastifyInstance {
        botService: BotService;
    }
}

const botPlugin = fp(async (fastify: FastifyInstance) => {
    const botService = new BotService(
        fastify.tokenQueryService,
        fastify.tokenAPIService,
        fastify.aiService
    );

    fastify.decorate('botService', botService);
});

export default botPlugin;