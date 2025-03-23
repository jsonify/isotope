import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
    // Keep the original pool configuration that was working
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true, // Set to true to avoid threading issues
      },
    },
    // Reduce timeouts to help with test hanging
    teardownTimeout: 5000,
    testTimeout: 10000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
