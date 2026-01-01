
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  const apiKey = env.API_KEY || (process as any).env.API_KEY || '';
  
  return {
    server: {
      port: 3000,
      host: true,
      strictPort: true
    },
    build: {
      target: 'esnext',
      modulePreload: true,
      outDir: 'dist'
    },
    define: {
      'process.env.API_KEY': JSON.stringify(apiKey),
      'process.env': {
        API_KEY: JSON.stringify(apiKey)
      }
    }
  };
});
