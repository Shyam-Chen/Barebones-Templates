import underPressure from '@fastify/under-pressure';
import websocket from '@fastify/websocket';
import fastify from 'fastify';

import router from '~/plugins/router';

export default () => {
  const app = fastify({
    logger: {
      transport: {
        target: '@fastify/one-line-logger',
      },
    },
  });

  app.register(import('./error'));

  app.register(underPressure, { exposeStatusRoute: '/api/healthz' });
  app.register(websocket);

  app.register(router);

  return app;
};
