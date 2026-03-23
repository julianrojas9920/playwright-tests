import { APIRequestContext } from '@playwright/test';

export class ApiClient {
  private request: APIRequestContext;
  private baseURL: string;

  constructor(request: APIRequestContext) {
    this.request = request;
    this.baseURL = process.env.BASE_URL!;
  }

  // GET genérico
  async get(endpoint: string) {
    const response = await this.request.get(`${this.baseURL}${endpoint}`);
    return response.json();
  }

  // POST genérico
  async post(endpoint: string, body: object) {
    const response = await this.request.post(`${this.baseURL}${endpoint}`, {
      data: body,
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  }

  // Ejemplo concreto: crear un usuario vía API antes de un test UI
  async createUser(payload: { email: string; role: string }) {
    return this.post('/api/users', payload);
  }

  // Ejemplo concreto: limpiar datos después de un test
  async deleteUser(userId: string) {
    await this.request.delete(`${this.baseURL}/api/users/${userId}`);
  }
}