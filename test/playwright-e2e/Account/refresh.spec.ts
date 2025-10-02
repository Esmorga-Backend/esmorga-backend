import { test, expect } from '@playwright/test';
import { loginUser, logoutUser } from '../Common/Login';

test(
  'Test Refresh token endpoint',
  {
    tag: '@happy-path',
  },
  async ({ request }) => {
    const responseLogin = await loginUser(
      request,
      'esmorgaqa1@yopmail.com',
      'Mobgen!1',
    );

    const responseRefresh = await request.post('v1/account/refresh', {
      data: {
        refreshToken: (await responseLogin.json()).refreshToken,
      },
    });
    expect(responseRefresh.status()).toBe(200);
    const responseRefreshJson = await responseRefresh.json();
    expect(responseRefreshJson).toHaveProperty('accessToken');
    expect(responseRefreshJson).toHaveProperty('refreshToken');
    expect(responseRefreshJson).toHaveProperty('ttl');

    await logoutUser(request, responseRefreshJson.accessToken);
  },
);
