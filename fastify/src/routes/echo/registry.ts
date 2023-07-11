import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';

export default (async (app) => {
  /*
  curl --request GET \
    --url http://127.0.0.1:3000/api/hello-world
  */
  app.get(
    '',
    {
      // @ts-expect-error
      ws: true,
    },
    async (req, reply) => {
      // @ts-expect-error
      reply.connection.send('Hello from Fastify!');

      // @ts-expect-error
      reply.on('message', (message) => {
        console.log(`Client message: ${Buffer.from(message).toString('utf-8')}`);
      });
    },
  );
}) as FastifyPluginAsyncTypebox;
