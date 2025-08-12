import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { AIService } from '../services/ai-service';

declare module 'fastify' {
    interface FastifyInstance {
        aiService: AIService;
    }
}

const aiPlugin = fp(async (fastify: FastifyInstance) => {
    const aiService = new AIService();
    fastify.decorate('aiService', aiService);
});

export default aiPlugin;