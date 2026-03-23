import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {

  // ─── Locators ─────────────────────────────────────────────────────────────
  // Definidos como readonly: se inicializan una vez y no cambian
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton:  Locator;
  readonly errorMessage:  Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('#user-name'); // # ID
    this.passwordInput = page.locator('#password'); // . class name
    this.submitButton  = page.locator('#login-button');
    this.errorMessage  = page.locator('[data-test="error"]');
  }

  // ─── Navegación ───────────────────────────────────────────────────────────

  async goto() {
    await super.goto('/');
    await this.waitForPageLoad();
  }

  // ─── Acciones ─────────────────────────────────────────────────────────────

  async fillUsername(username: string) {
    await this.fill(this.usernameInput, username);
  }

  async fillPassword(password: string) {
    await this.fill(this.passwordInput, password);
  }

  async clickSubmit() {
    await this.click(this.submitButton);
  }

  // ─── Flujo completo ───────────────────────────────────────────────────────
  // Combina los pasos anteriores en un solo método reutilizable
  async login(username: string, password: string) {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickSubmit();
  }

  async loginAndWaitForDashboard(username: string, password: string) {
    await this.login(username, password);
    await this.waitForUrl('**/inventory.html');
  }

  // ─── Validaciones de estado ───────────────────────────────────────────────

  async getErrorMessage(): Promise<string> {
    return this.getText(this.errorMessage);
  }

  async isErrorVisible(): Promise<boolean> {
    return this.isVisible(this.errorMessage);
  }

  getPage(): Page {
  return this.page;
  }
}