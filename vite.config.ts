
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    host: true,
    strictPort: true
  },
  build: {
    target: 'esnext',
    modulePreload: true,
    outDir: 'dist'
  }
});
