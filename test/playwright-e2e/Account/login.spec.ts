import { test, expect } from '@playwright/test';
import { loginUser, logoutUser } from '../Common/Login';

//MOB-32 MOB-132 MOB-193
test(
  'Login with valid credentials',
  {
    tag: '@happy-path',
  },
  async ({ request }) => {
    const responseLogin = await loginUser(
      request,
      process.env.USER_1_EMAIL,
      process.env.USER_1_PASSWORD,
    );
    expect(responseLogin.status()).toBe(200);
    const responseLoginJson = await responseLogin.json();
    expect(responseLoginJson).toHaveProperty('accessToken');
    expect(responseLoginJson).toHaveProperty('refreshToken');
    expect(responseLoginJson).toHaveProperty('ttl');
    expect(responseLoginJson).toHaveProperty('profile');
    expect(responseLoginJson.profile).toHaveProperty('name');
    expect(responseLoginJson.profile).toHaveProperty('lastName');
    expect(responseLoginJson.profile.email).toBe('esmorgaqa1@yopmail.com');
    expect(responseLoginJson.profile).toHaveProperty('role');

    await logoutUser(request, responseLoginJson.accessToken);
  },
);
