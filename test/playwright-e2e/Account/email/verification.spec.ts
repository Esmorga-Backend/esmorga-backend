import { test, expect } from '@playwright/test';

test(
  'Test Email verification endpoint',
  {
    tag: '@happy-path',
  },
  async ({ request }) => {
    const verificationResponse = request.post('v1/account/email/verification', {
      data: {
        email: 'esmorgaqa1@yopmail.com',
      },
    });
    expect((await verificationResponse).status()).toBe(204);
  },
);
