import { Page } from '@playwright/test';
import { ApiClient } from './apiClient';

export class AuthHelper {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async loginViaUI(email: string, password: string) {
    await this.page.goto('/login');
    await this.page.fill('[data-testid="email"]', email);
    await this.page.fill('[data-testid="password"]', password);
    await this.page.click('[data-testid="submit"]');
    await this.page.waitForURL('**/dashboard');
  }

  async loginViaAPI(request: ApiClient, email: string, password: string) {
    const { token } = await request.post('/api/auth/login', { email, password });

    // Inyecta el token en el contexto del browser
    await this.page.context().addCookies([{
      name: 'auth_token',
      value: token,
      domain: new URL(process.env.BASE_URL!).hostname,
      path: '/',
    }]);

    await this.page.goto('/dashboard');
  }

  async logout() {
    await this.page.click('[data-testid="logout"]');
    await this.page.waitForURL('**/login');
  }
}