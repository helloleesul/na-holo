import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { dependencies } = require('./package.json');

const renderChunks = (deps: Record<string, string>) => {
  const chunks: { [key: string]: string[] } = {};

  Object.keys(deps).forEach((key) => {
    if (['react', 'react-router-dom', 'react-dom', 'pretendard', 'firebase'].includes(key)) {
      return;
    }
    chunks[key] = [key];
  });

  return chunks;
};

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 8060,
    watch: {
      usePolling: true,
    },
    cors: true,
    proxy: {
      '/api': {
        target: 'http://34.22.76.244/',
        changeOrigin: true,
      },
    },
  },
  define: {
    'import.meta.env.DEV': mode === 'development',
    'import.meta.env.PROD': mode === 'production',
  },
  build: {
    outDir: 'build',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-router-dom', 'react-dom'],
          ...renderChunks(dependencies),
        },
      },
    },
  },
  assetsInclude: ['**/*.node'],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
}));
