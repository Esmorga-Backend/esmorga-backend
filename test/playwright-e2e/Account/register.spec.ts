import { test, expect } from '@playwright/test';

//MOB-41 MOB=126
test(
  'Test Register endpoint',
  {
    tag: '@happy-path',
  },
  async ({ request }) => {
    const responseLogin = await request.post('v1/account/register', {
      data: {
        name: 'Esmorga QA',
        lastName: 'User',
        email: 'automateduser@yopmail.com',
        password: 'Mobgen!1',
      },
    });
    expect(responseLogin.status()).toBe(201);
  },
);
