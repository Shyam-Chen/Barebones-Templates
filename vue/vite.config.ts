import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
import envify from 'process-envify';
import { presetIcons, presetUno, transformerDirectives } from 'unocss';
import unocss from 'unocss/vite';
import { defineConfig } from 'vite';
import vueRoutes from 'vite-plugin-vue-routes';

export default defineConfig({
  define: envify({
    API_URL: process.env.API_URL || '',
  }),
  plugins: [
    vue(),
    vueRoutes(),
    unocss({
      presets: [presetUno(), presetIcons()],
      transformers: [transformerDirectives({ enforce: 'pre' })],
    }),
  ],
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000',
        ws: true,
      },
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
  },
});
