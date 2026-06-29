import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['robots.txt', 'sitemap.xml', 'icon.svg'],
      manifest: {
        name: 'Lexora',
        short_name: 'Lexora',
        description: 'The Beautiful Daily Word Challenge',
        theme_color: '#0B1020',
        background_color: '#0B1020',
        display: 'standalone',
        start_url: '.',
        icons: [{ src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }],
        shortcuts: [
          { name: 'Daily Challenge', url: './?mode=daily' },
          { name: 'Practice', url: './?mode=practice' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,svg,json,txt,xml}'],
        navigateFallback: 'index.html',
      },
    }),
  ],
});
