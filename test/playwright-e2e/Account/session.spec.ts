import { test, expect } from '@playwright/test';
import { loginUser, logoutUser } from '../Common/Login';

//MOB-173
test(
  'Test Logout endpoint',
  {
    tag: '@happy-path',
  },
  async ({ request }) => {
    const responseLogin = await loginUser(
      request,
      process.env.USER_1_EMAIL,
      process.env.USER_1_PASSWORD,
    );

    const responseLogout = await logoutUser(
      request,
      (await responseLogin.json()).accessToken,
    );
    expect(responseLogout.status()).toBe(204);
  },
);
