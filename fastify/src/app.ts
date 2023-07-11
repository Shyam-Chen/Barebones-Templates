import fastify from 'fastify';
import { serverFactory, fastifyUws } from '@geut/fastify-uws';

import router from '~/plugins/router';

export default () => {
  const app = fastify({
    logger: {
      transport: {
        target: '@fastify/one-line-logger',
      },
    },
    serverFactory,
  });

  app.register(import('./error'));

  app.register(fastifyUws);

  app.register(router);

  return app;
};
