import { test, expect } from '../../fixtures';
import users from '../../fixtures/users.json';

test.describe('Login', () => {

  test('usuario estándar puede iniciar sesión exitosamente', async ({ loginPage }) => {
    await loginPage.login(
      users.standard.username,
      users.standard.password
    );

    await expect(loginPage.getPage()).toHaveURL(/inventory\.html/);
  });

  test('usuario bloqueado ve mensaje de error al intentar ingresar', async ({ loginPage }) => {
    await loginPage.login(
      users.locked.username,
      users.locked.password
    );

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('locked out');
  });

  test('credenciales inválidas muestran mensaje de error', async ({ loginPage }) => {
    await loginPage.login(
      users.invalid.username,
      users.invalid.password
    );

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Username and password do not match');
  });

  test('usuario no puede ingresar con password vacío', async ({ loginPage }) => {
    await loginPage.fillUsername(users.standard.username);
    await loginPage.clickSubmit();

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Password is required');
  });

  test('usuario no puede ingresar con username vacío', async ({ loginPage }) => {
    await loginPage.fillPassword(users.standard.password);
    await loginPage.clickSubmit();

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Username is required');
  });

});