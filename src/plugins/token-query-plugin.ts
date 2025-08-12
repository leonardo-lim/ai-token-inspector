import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { TokenQueryService } from '../services/token-query-service';

declare module 'fastify' {
    interface FastifyInstance {
        tokenQueryService: TokenQueryService;
    }
}

const tokenQueryPlugin = fp(async (fastify: FastifyInstance) => {
    const tokenQueryService = new TokenQueryService();
    fastify.decorate('tokenQueryService', tokenQueryService);
});

export default tokenQueryPlugin;