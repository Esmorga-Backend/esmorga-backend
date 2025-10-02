import { test, expect } from '@playwright/test';
import { loginAdminUser, loginUser, logoutUser } from '../Common/Login';

test.describe('Test get profile', () => {
  let accessToken: string;

  test.afterEach('Logout user', async ({ request }) => {
    await logoutUser(request, accessToken);
  });

  test(
    'Get Admin profile',
    {
      tag: '@happy-path',
    },
    async ({ request }) => {
      const responseLogin = await loginAdminUser(request);
      const responseLoginJson = await responseLogin.json();
      accessToken = responseLoginJson.accessToken;

      const responseProfile = await request.get('/v1/account/profile', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      expect(responseProfile.status()).toBe(200);
      const responseProfileJson = await responseProfile.json();
      expect(responseProfileJson).toHaveProperty('name');
      expect(responseProfileJson).toHaveProperty('lastName');
      expect(responseProfileJson).toHaveProperty('email');
      expect(responseProfileJson).toHaveProperty('role');
      expect(responseProfileJson.role).toBe('ADMIN');
    },
  );

  test(
    'Get user profile',
    {
      tag: '@happy-path',
    },
    async ({ request }) => {
      const responseLogin = await loginUser(
        request,
        'esmorgaqa1@yopmail.com',
        'Mobgen!1',
      );
      const responseLoginJson = await responseLogin.json();
      accessToken = responseLoginJson.accessToken;

      const responseProfile = await request.get('/v1/account/profile', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      expect(responseProfile.status()).toBe(200);
      const responseProfileJson = await responseProfile.json();
      expect(responseProfileJson).toHaveProperty('name');
      expect(responseProfileJson).toHaveProperty('lastName');
      expect(responseProfileJson).toHaveProperty('email');
      expect(responseProfileJson).toHaveProperty('role');
      expect(responseProfileJson.role).toBe('USER');
    },
  );
});
