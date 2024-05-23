import vue from '@vitejs/plugin-vue';
import { internalIPv4 } from 'private-ip-address';
import { defineConfig } from 'vite';
import vueRoutes from 'vite-plugin-vue-routes';

// @ts-expect-error process is a nodejs global
const mobile = !!/android|ios/.exec(process.env.TAURI_ENV_PLATFORM);

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [vue(), vueRoutes()],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: mobile ? internalIPv4() : false,
    hmr: mobile
      ? {
          protocol: 'ws',
          host: internalIPv4(),
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ['**/src-tauri/**'],
    },
  },
}));
