import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'mascot/*.png'],
      manifest: {
        name: 'Pip - Quick Capture',
        short_name: 'Pip',
        description: 'Frictionless thought capture and habit tracking',
        theme_color: '#120B18',
        background_color: '#120B18',
        display: 'standalone',
        icons: [
          {
            src: 'favicon.ico',
            sizes: '64x64 32x32 24x24 16x16',
            type: 'image/x-icon'
          }
        ]
      }
    })
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:7071',
        changeOrigin: true,
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, _req, _res) => {
            // Mock Azure SWA Principal: {"userId": "local-dev-agent", "userDetails": "agent@finnminn.local", "userRoles": ["authenticated"]}
            const mockPrincipal = "eyJ1c2VySWQiOiAibG9jYWwtZGV2LWFnZW50IiwgInVzZXJEZXRhaWxzIjogImFnZW50QGZpbm5taW5uLmxvY2FsIiwgInVzZXJSb2xlcyI6IFsiYXV0aGVudGljYXRlZCJdfQ==";
            proxyReq.setHeader('x-ms-client-principal', mockPrincipal);
          });
        },
      },
    },
  },
})