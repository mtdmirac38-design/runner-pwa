import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        VitePWA({
          registerType: 'autoUpdate',
          workbox: {
            globPatterns: ['**,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'image-cache',
                  expiration: {
                    maxEntries: 10,
                    maxAgeSeconds: 60 * 60 * 24 * 30, 
                  },
                },
              },
            ],
          },
          includeAssets: ['icon.svg'],
          manifest: {
            name: 'SkyRunner PWA',
            short_name: 'SkyRunner',
            description: 'A high-performance PWA Platformer Game',
            theme_color: '#1e293b',
            background_color: '#0b1020',
            display: 'standalone',
            orientation: 'landscape',
            icons: [
              {
                src: 'https:
                sizes: '192x192',
                type: 'image/png',
              },
              {
                src: 'https:
                sizes: '512x512',
                type: 'image/png',
              },
            ],
          },
        }),
      ],
      define: {
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
