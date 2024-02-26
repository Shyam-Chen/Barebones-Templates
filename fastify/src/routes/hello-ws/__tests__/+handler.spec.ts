import { once } from 'events';
import websocket from '@fastify/websocket';
import fastify from 'fastify';
import WebSocket from 'ws';

import helloWs from '../+handler';

test('WS /hello-http', async () => {
  const app = fastify();

  app.register(websocket);

  app.register(helloWs, { prefix: '/hello-ws' });

  await app.listen({ host: process.env.HOST, port: process.env.PORT });

  const ws = new WebSocket(`ws://${process.env.HOST}:${process.env.PORT}/hello-ws`);
  const client = WebSocket.createWebSocketStream(ws, { encoding: 'utf8' });

  client.setEncoding('utf8');
  client.write('Hello, World!');

  const [chunk] = await once(client, 'data');
  expect(chunk).toEqual('Hello from Fastify!');
});
