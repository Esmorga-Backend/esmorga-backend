import { test, expect } from '@playwright/test';

test(
  'Test forgot-init password endpoint',
  {
    tag: '@happy-path',
  },
  async ({ request }) => {
    const forgotInitResponse = request.post('v1/account/password/forgot-init', {
      data: {
        email: 'esmorgaqa1@yopmail.com',
      },
    });
    expect((await forgotInitResponse).status()).toBe(204);
  },
);
