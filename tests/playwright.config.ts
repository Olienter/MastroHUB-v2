import { defineConfig } from '@playwright/test';

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

export default defineConfig({
  testDir: '../tests',
  timeout: 60_000,
  retries: 0,
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: `pnpm build && pnpm exec next start -p ${PORT}`,
    url: `${BASE_URL}/api/health`,
    timeout: 120_000,
    reuseExistingServer: false,
  },
});
