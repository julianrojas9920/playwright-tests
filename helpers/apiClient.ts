import { APIRequestContext } from '@playwright/test';

export class ApiClient {
  private request: APIRequestContext;
  private baseURL: string;

  constructor(request: APIRequestContext) {
    this.request = request;
    this.baseURL = process.env.BASE_URL!;
  }

  async get(endpoint: string) {
    const response = await this.request.get(`${this.baseURL}${endpoint}`);
    return response.json();
  }

  async post(endpoint: string, body: object) {
    const response = await this.request.post(`${this.baseURL}${endpoint}`, {
      data: body,
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  }

  async createUser(payload: { email: string; role: string }) {
    return this.post('/api/users', payload);
  }

  async deleteUser(userId: string) {
    await this.request.delete(`${this.baseURL}/api/users/${userId}`);
  }
}