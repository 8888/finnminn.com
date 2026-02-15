import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
