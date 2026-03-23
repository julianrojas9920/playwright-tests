import { test, expect, request as playwrightRequest } from '@playwright/test';
import { ApiClient } from '../../helpers/apiClient';
import bookings from '../../fixtures/bookings.json';

test.describe('Booking API', () => {

  let client: ApiClient;
  let bookingId: number;

  test.beforeAll(async ({ request }) => {
    const context = await playwrightRequest.newContext();
    client = new ApiClient(context);
    await client.authenticate();
  });

  test.afterAll(async () => {
    await client.dispose();
  });

  test('GET /booking retorna lista de reservas', async () => {
    const response = await client.getAllBookings();

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);
  });

  test('POST /booking crea una reserva correctamente', async () => {
    const response = await client.createBooking(bookings.valid);

    await test.step('verificar status code 200', async () => {
    expect(response.status()).toBe(200);
  });

  const body = await response.json();

  await test.step('verificar bookingid existe en la respuesta', async () => {
    expect(body.bookingid).toBeDefined();
  });

  await test.step('verificar firstname del payload', async () => {
    expect(body.booking.firstname).toBe(bookings.valid.firstname);
  });

  await test.step('verificar lastname del payload', async () => {
    expect(body.booking.lastname).toBe(bookings.valid.lastname);
  });

  await test.step('verificar totalprice del payload', async () => {
    expect(body.booking.totalprice).toBe(bookings.valid.totalprice);
  });

  await test.step('verificar depositpaid del payload', async () => {
    expect(body.booking.depositpaid).toBe(bookings.valid.depositpaid);
  });

    bookingId = body.bookingid;
  });

  test('GET /booking/:id retorna la reserva creada', async () => {
    const response = await client.getBookingById(bookingId);

     await test.step('verificar status code 200', async () => {
    expect(response.status()).toBe(200);
  });

    const body = await response.json();
    expect(body.firstname).toBe(bookings.valid.firstname);
    expect(body.lastname).toBe(bookings.valid.lastname);
    expect(body.bookingdates.checkin).toBe(bookings.valid.bookingdates.checkin);
    expect(body.bookingdates.checkout).toBe(bookings.valid.bookingdates.checkout);
  });

  test('PUT /booking/:id actualiza la reserva correctamente', async () => {
    const response = await client.updateBooking(bookingId, bookings.updated);

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.totalprice).toBe(bookings.updated.totalprice);
    expect(body.depositpaid).toBe(bookings.updated.depositpaid);
    expect(body.additionalneeds).toBe(bookings.updated.additionalneeds);
  });

  test('DELETE /booking/:id elimina la reserva correctamente', async () => {
    const response = await client.deleteBooking(bookingId);

    expect(response.status()).toBe(201);
  });

  test('GET /booking/:id retorna 404 después de eliminar', async () => {
    const response = await client.getBookingById(bookingId);

    expect(response.status()).toBe(404);
  });

});