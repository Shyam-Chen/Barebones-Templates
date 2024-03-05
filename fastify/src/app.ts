import underPressure from '@fastify/under-pressure';
import fastify from 'fastify';

import error from '~/plugins/error';
import router from '~/plugins/router';

export default () => {
  const app = fastify({
    logger: {
      transport: {
        target: '@fastify/one-line-logger',
      },
    },
  });

  app.register(underPressure, { exposeStatusRoute: '/api/healthz' });

  app.register(error);
  app.register(router);

  return app;
};
