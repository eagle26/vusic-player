import { fileURLToPath, URL } from 'url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { vueI18n } from '@intlify/vite-plugin-vue-i18n';
import { VitePWA } from 'vite-plugin-pwa';
import eslint from 'vite-plugin-eslint';

const path = require('path');

// https://vitejs.dev/config/
export default defineConfig({
  // server: { https: true }, // It enables HTTPS on devel mode
  // base: process.env.BASE_URL
  build: {
    target: 'esnext',
    sourcemap: process.env.SOURCE_MAP === 'true',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    vue(),
    vueI18n({
      include: path.resolve(__dirname, './src/locales/**'),
    }),
    VitePWA({
      workbox: {
        sourcemap: true,
      },
      mode: 'development',
      base: '/',
      includeAssets: [
        'favicon.svg',
        'favicon.ico',
        'robots.txt',
        'apple-touch-icon.png',
      ],
      srcDir: 'src/service-worker',
      filename: 'claims-sw.ts',
      strategies: 'injectManifest',
      registerType: 'autoUpdate',
      manifest: {
        name: 'Music App',
        short_name: 'Music App',
        description: 'Music App',
        theme_color: '#52688F',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: 'module',
        navigateFallback: 'index.html',
      },
      injectManifest: {
        swSrc: './src/service-worker/claims-sw.ts',
        swDest: './dist/claims-sw.js',
      },
      injectRegister: 'auto',
    }),
    eslint({ cache: false }),
  ],
});
