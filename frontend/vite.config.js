import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // During `npm run dev`, forward /api calls to Spring Boot
    proxy: { '/api': 'http://localhost:8080' },
  },
  build: {
    // `npm run build` writes straight into Spring Boot's static folder
    outDir: '../src/main/resources/static',
    emptyOutDir: true,
  },
});
