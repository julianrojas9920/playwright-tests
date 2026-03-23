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
    baseURL: process.env.BASE_URL,

    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',

    headless: process.env.HEADLESS !== 'false',

    viewport: { width: 1280, height: 720 },

    actionTimeout: 10_000,

    navigationTimeout: 15_000,

    locale: 'es-CO',
    timezoneId: 'America/Bogota',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  
  outputDir: 'test-results',
});