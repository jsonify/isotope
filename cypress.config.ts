import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4173', // Always use preview server port since we're testing the built version
  },
});
