import { test, expect } from '@playwright/test';

//MOB-122
test(
  'Test forgot-init password endpoint',
  {
    tag: '@happy-path',
  },
  async ({ request }) => {
    const forgotInitResponse = request.post('v1/account/password/forgot-init', {
      data: {
        email: process.env.USER_EMAIL_FORGOT,
      },
    });
    expect((await forgotInitResponse).status()).toBe(204);
  },
);
