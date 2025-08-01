import Fastify from 'fastify';

const server = Fastify({ logger: true });

const start = async () => {
    try {
        await server.listen({ port: 3000 });
    } catch (error) {
        server.log.error(error);
        process.exit(1);
    }
};

start();