import type { FastifyInstance } from 'fastify';

export default async (app: FastifyInstance) => {
  app.get('', { websocket: true }, (con, req) => {
    req.log.info('Client connected');

    con.socket.send('Hello from Fastify!');

    con.socket.on('message', (message: MessageEvent) => {
      req.log.info(`Client message: ${message}`);
    });

    con.socket.on('close', () => {
      req.log.info('Client disconnected');
    });
  });
};
