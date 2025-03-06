import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
    pool: 'threads',
    poolOptions: {
      threads: { singleThread: false },
    },
    teardownTimeout: 10000,
    testTimeout: 15000
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
