import Fastify from 'fastify';
import bot from './bot';

const server = Fastify({ logger: true });

const start = async () => {
    try {
        await server.listen({ port: 3000 });
        bot.start();
    } catch (error) {
        server.log.error(error);
        process.exit(1);
    }
};

start();