import { test, expect } from '@playwright/test';
import { loginUser, logoutUser } from '../Common/Login';

test(
  'Test Logout endpoint',
  {
    tag: '@happy-path',
  },
  async ({ request }) => {
    const responseLogin = await loginUser(
      request,
      'esmorgaqa1@yopmail.com',
      'password',
    );
    const responseLogout = await logoutUser(
      request,
      (await responseLogin.json()).accessToken,
    );
    expect(responseLogout.status()).toBe(204);
  },
);
