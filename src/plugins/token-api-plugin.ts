import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { TokenAPIService } from '../services/token-api-service';

declare module 'fastify' {
    interface FastifyInstance {
        tokenAPIService: TokenAPIService;
    }
}

const tokenAPIServicePlugin = fp(async (fastify: FastifyInstance) => {
    const tokenAPIService = new TokenAPIService();
    fastify.decorate('tokenAPIService', tokenAPIService);
});

export default tokenAPIServicePlugin;