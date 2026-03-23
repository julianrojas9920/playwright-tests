import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Carga el .env desde la raíz del proyecto
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  // ─── Dónde viven los tests ───────────────────────────────────────────────
  testDir: './tests',

  // Patrón de archivos reconocidos como specs
  testMatch: '**/*.spec.ts',

  // ─── Ejecución ───────────────────────────────────────────────────────────
  // Corre los archivos en paralelo, pero los tests dentro de cada archivo
  // corren en secuencia (más seguro para flujos E2E con estado)
  fullyParallel: false,
  workers: 2,

  // Reintentos: 0 en local para detectar flakiness rápido
  retries: 0,

  // ─── Timeouts ────────────────────────────────────────────────────────────
  timeout: 30_000,          // Timeout por test completo
  expect: {
    timeout: 5_000,         // Timeout por cada assertion
  },

  // ─── Reporters ───────────────────────────────────────────────────────────
  reporter: [
    ['list'],               // Salida limpia en consola mientras corre
    ['html', {
      outputFolder: 'reports/html',
      open: 'on-failure',   // Abre el reporte solo si hay fallos
    }],
    ['allure-playwright', {
      resultsDir: 'reports/allure-results',
    }],
  ],

  // ─── Configuración base para todos los proyectos ─────────────────────────
  use: {
    // URL base leída desde .env → process.env.BASE_URL
    baseURL: process.env.BASE_URL,

    // Captura evidencia automáticamente solo en fallos
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',

    // Headless en CI, con cabeza en local (controlado por .env)
    headless: process.env.HEADLESS !== 'false',

    // Viewport estándar desktop
    viewport: { width: 1280, height: 720 },

    // Tiempo máximo esperando que una acción (click, fill…) termine
    actionTimeout: 10_000,

    // Tiempo máximo esperando que la navegación complete
    navigationTimeout: 15_000,

    // Locale y zona horaria (útil para apps fintech con fechas)
    locale: 'es-CO',
    timezoneId: 'America/Bogota',
  },

  // ─── Proyectos / Browsers ─────────────────────────────────────────────────
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // ─── Carpeta de artefactos ───────────────────────────────────────────────
  outputDir: 'test-results',
});