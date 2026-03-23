import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import users from './users.json';

// ─── Tipos ────────────────────────────────────────────────────────────────
// Define qué fixtures estarán disponibles en los tests
type MyFixtures = {
  loginPage: LoginPage;         // Página de login lista para usar
  authenticatedPage: Page;      // Browser ya logueado como standard_user
};

// ─── Extensión del test base ──────────────────────────────────────────────
export const test = base.extend<MyFixtures>({

  // Fixture 1: entrega un LoginPage sin autenticar
  // Útil para tests que validan el propio flujo de login
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
    // teardown: Playwright cierra la página automáticamente
  },

  // Fixture 2: entrega la page ya autenticada como standard_user
  // Útil para tests que prueban funcionalidad post-login
  // Cada test arranca desde login porque saucedemo no mantiene sesión
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAndWaitForDashboard(
      users.standard.username,
      users.standard.password
    );
    await use(page);
    // teardown: limpia cookies y storage al terminar el test
    await page.context().clearCookies();
  },
});

// Re-exporta expect para importar todo desde un solo lugar
export { expect } from '@playwright/test';