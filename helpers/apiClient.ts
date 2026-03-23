import { APIRequestContext, APIResponse } from '@playwright/test';

export class ApiClient {
  private request: APIRequestContext;
  private baseURL: string;
  private token: string | null = null;

  constructor(request: APIRequestContext) {
    this.request = request;
    this.baseURL = process.env.API_BASE_URL!;
  }

  async authenticate(): Promise<string> {
    const response = await this.request.post(`${this.baseURL}/auth`, {
      data: {
        username: process.env.API_USER,
        password: process.env.API_PASSWORD,
      },
    });
    const body = await response.json();
    this.token = body.token;
    if (!this.token) {
      throw new Error('Autenticación fallida: no se recibió token');
    }
    return this.token;
  }

  private authHeaders() {
    return { Cookie: `token=${this.token}` };
  }

  async getAllBookings(): Promise<APIResponse> {
    return this.request.get(`${this.baseURL}/booking`);
  }

  async getBookingById(id: number): Promise<APIResponse> {
    return this.request.get(`${this.baseURL}/booking/${id}`);
  }

  async createBooking(payload: BookingPayload): Promise<APIResponse> {
    return this.request.post(`${this.baseURL}/booking`, {
      data: payload,
    });
  }

  async updateBooking(id: number, payload: BookingPayload): Promise<APIResponse> {
    return this.request.put(`${this.baseURL}/booking/${id}`, {
      data: payload,
      headers: this.authHeaders(),
    });
  }

  async deleteBooking(id: number): Promise<APIResponse> {
    return this.request.delete(`${this.baseURL}/booking/${id}`, {
      headers: this.authHeaders(),
    });
  }

  async dispose(): Promise<void> {
    await this.request.dispose();
  }
}

export type BookingPayload = {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: {
    checkin: string;
    checkout: string;
  };
  additionalneeds?: string;
};