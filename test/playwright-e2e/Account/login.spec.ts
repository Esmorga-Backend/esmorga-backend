import { test, expect } from '@playwright/test';
import { loginUser, logoutUser } from '../Common/Login';

test(
  'Login with valid credentials',
  {
    tag: '@happy-path',
  },
  async ({ request }) => {
    const responseLogin = await loginUser(
      request,
      'esmorgaqa1@yopmail.com',
      'password',
    );
    expect(responseLogin.status()).toBe(200);
    const responseLoginJson = await responseLogin.json();
    expect(responseLoginJson).toHaveProperty('accessToken');
    expect(responseLoginJson).toHaveProperty('refreshToken');
    expect(responseLoginJson).toHaveProperty('ttl');
    expect(responseLoginJson).toHaveProperty('profile');
    expect(responseLoginJson.profile.email).toBe('esmorgaqa1@yopmail.com');

    await logoutUser(request, responseLoginJson.accessToken);
  },
);
