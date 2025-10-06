import { test, expect } from '@playwright/test';

//MOB-130
test(
  'Test Email verification endpoint',
  {
    tag: '@happy-path',
  },
  async ({ request }) => {
    const verificationResponse = request.post('v1/account/email/verification', {
      data: {
        email: process.env.USER_1_EMAIL,
      },
    });
    expect((await verificationResponse).status()).toBe(204);
  },
);
