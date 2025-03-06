import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
    // Use singleThread instead of threads for Vitest 3.x
    singleThread: true,
    // Configure pool to run with minimal threads
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
    teardownTimeout: 5000,
    testTimeout: 10000,
    hookTimeout: 10000,
    // Use proper exclude configuration instead of watchExclude
    fileParallelism: {
      exclude: ['**/node_modules/**', '**/dist/**'],
    },
    clearMocks: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
