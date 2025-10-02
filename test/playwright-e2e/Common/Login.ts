import { APIRequestContext } from '@playwright/test';

export async function loginUser(
  request: APIRequestContext,
  user: string,
  password: string,
) {
  return await request.post('/v1/account/login', {
    data: {
      email: user,
      password: password,
    },
  });
}

export async function loginAdminUser(request: APIRequestContext) {
  return await request.post('/v1/account/login', {
    data: {
      email: process.env.ADMIN_USER_EMAIL,
      password: process.env.ADMIN_USER_PASSWORD,
    },
  });
}

export async function logoutUser(request: APIRequestContext, token: string) {
  return await request.delete('/v1/account/session', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
