import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',

  fullyParallel: false,
  workers: 2,
  retries: 0,

  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },

  reporter: [
    ['list'],
    ['html', {
      outputFolder: 'reports/html',
      open: 'on-failure',
    }],
    ['allure-playwright', {
      resultsDir: 'reports/allure-results',
    }],
  ],

  use: {
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    headless: process.env.HEADLESS !== 'false',
    locale: 'es-CO',
    timezoneId: 'America/Bogota',
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
  },

  projects: [
    {
      name: 'ui',
      testDir: './tests/ui',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.BASE_URL,
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: process.env.API_BASE_URL,
        extraHTTPHeaders: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      },
    },
  ],

  outputDir: 'test-results',
});