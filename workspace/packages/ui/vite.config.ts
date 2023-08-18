import { resolve } from 'path';
import { defineConfig } from 'vite';
import envify from 'process-envify';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import unocss from 'unocss/vite';
import { presetUno, presetIcons, transformerDirectives } from 'unocss';

export default defineConfig({
  define: envify({}),
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
    },
    rollupOptions: {
      external: ['vue'],
    },
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.includes('-'),
        },
      },
    }),
    dts(),
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
  test: {
    globals: true,
    environment: 'happy-dom',
  },
});
