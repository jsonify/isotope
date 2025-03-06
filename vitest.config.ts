import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
    pool: 'forks', // Changed from 'threads' to 'forks' for better process management
    poolOptions: {
      forks: {
        isolate: true,
      },
    },
    teardownTimeout: 5000, // Reduced from 10000
    testTimeout: 10000, // Reduced from 15000
    hookTimeout: 10000, // Added explicit hook timeout
    exclude: ['**/node_modules/**', '**/dist/**'],
    clearMocks: true,
    // forceExit: true, // Force exit after tests complete
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
