import { resolve } from 'node:path';
import vue from '@vitejs/plugin-vue';
import { internalIPv4 } from 'private-ip-address';
import { defineConfig } from 'vite';
import vueRoutes from 'vite-plugin-vue-routes';
import tailwindColors from 'tailwindcss/colors';
import { presetIcons, presetUno, presetWebFonts, transformerDirectives } from 'unocss';
import unocss from 'unocss/vite';
import envify from 'process-envify';

const mobile = !!/android|ios/.exec(process.env.TAURI_ENV_PLATFORM!);
const host = process.env.TAURI_DEV_HOST;

export default defineConfig({
  define: envify({
    API_URL: process.env.API_URL || mobile ? `http://${internalIPv4()}:3000` : '',
  }),
  plugins: [
    vue(),
    vueRoutes(),
    unocss({
      presets: [
        presetUno(),
        presetIcons(),
        presetWebFonts({
          fonts: {
            sans: ['Roboto:400,500,600,700,800'],
            mono: ['Roboto Mono:400,500,600,700,800'],
          },
        }),
      ],
      transformers: [transformerDirectives({ enforce: 'pre' })],
      theme: {
        colors: {
          primary: tailwindColors.indigo,
          secondary: tailwindColors.neutral,
          success: tailwindColors.emerald,
          danger: tailwindColors.rose,
          warning: tailwindColors.amber,
          info: tailwindColors.sky,
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '~': resolve(import.meta.dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern',
      },
    },
  },
  clearScreen: false,
  server: {
    proxy: {
      '/api': {
        target: 'http://0.0.0.0:3000',
        ws: true,
      },
    },
    port: 1420,
    strictPort: true,
    host: mobile ? host : false,
    hmr: mobile ? { protocol: 'ws', host, port: 1430 } : undefined,
    watch: {
      ignored: ['**/src-tauri/**'],
    },
  },
});
