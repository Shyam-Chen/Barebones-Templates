#!/usr/bin/env node
import { fileURLToPath } from 'node:url';
import fastify from 'fastify';
import FastifyVite from '@fastify/vite';
import ky from 'ky-universal';

import renderer from './renderer.js';

export async function main(dev) {
  const server = fastify({
    ignoreTrailingSlash: true,
    logger: {
      transport: {
        target: '@fastify/one-line-logger',
      },
    },
  });

  server.decorate(
    'ky',
    ky.create({
      prefixUrl: 'http://127.0.0.1:3000/',
    }),
  );

  server.setErrorHandler((err, req, reply) => {
    console.error(err);
    reply.code(500);
    reply.send(err);
  });

  await server.register(FastifyVite, {
    dev: dev || process.argv.includes('--dev'),
    root: import.meta.url,
    renderer,
  });

  await server.vite.ready();

  return server;
}

if (process.argv[1] === fileURLToPath(new URL(import.meta.url))) {
  const server = await main();
  await server.listen({ host: '127.0.0.1', port: 3000 });
}
