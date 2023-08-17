import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const path = fileURLToPath(new URL(import.meta.url));

export default {
  root: resolve(dirname(path), 'client'),
  plugins: [vue()],
};
