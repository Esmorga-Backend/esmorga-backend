import { test, expect } from '@playwright/test';
import { loginAdminUser, loginUser, logoutUser } from '../Common/Login';
import {
  createEvent,
  deleteEvent,
  getEventId,
  joinEvent,
} from '../Common/Event';

let adminAccessToken, eventId: string;

test.beforeEach(async ({ request }) => {
  const responseLogin = await loginAdminUser(request);
  const responseLoginJson = await responseLogin.json();
  adminAccessToken = responseLoginJson.accessToken;
  await createEvent(request, adminAccessToken);
  eventId = await getEventId(request, 'PW Automation Test');
});

test.afterEach(async ({ request }) => {
  await deleteEvent(request, adminAccessToken, eventId);

  await logoutUser(request, adminAccessToken);
});

test('Join an event', { tag: '@happy-path' }, async ({ request }) => {
  const responseLogin = await loginUser(
    request,
    'esmorgaqa1@yopmail.com',
    'Mobgen!1',
  );
  const responseLoginJson = await responseLogin.json();
  const accessToken = responseLoginJson.accessToken;

  const responseJoinEvent = await joinEvent(request, accessToken, eventId);
  expect(responseJoinEvent.status()).toBe(204);
  await logoutUser(request, accessToken);
});
