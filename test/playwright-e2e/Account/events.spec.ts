import { test, expect } from '@playwright/test';
import { loginAdminUser, loginUser, logoutUser } from '../Common/Login';
import {
  createEvent,
  deleteEvent,
  getEventId,
  joinEvent,
  leaveEvent,
} from '../Common/Event';

let adminAccessToken, eventId: string;
let executeBeforeAfter: boolean = true;

test.beforeEach(async ({ request }) => {
  const responseLogin = await loginAdminUser(request);
  const responseLoginJson = await responseLogin.json();
  adminAccessToken = responseLoginJson.accessToken;

  if (executeBeforeAfter) {
    await createEvent(request, adminAccessToken);
    eventId = await getEventId(request, 'PW Automation Test');
  }
});

test.afterEach(async ({ request }) => {
  if (executeBeforeAfter) {
    await deleteEvent(request, adminAccessToken, eventId);
  }

  await logoutUser(request, adminAccessToken);
});

//MOB-44
test('Join an event', { tag: '@happy-path' }, async ({ request }) => {
  const responseLogin = await loginUser(
    request,
    process.env.USER_1_EMAIL,
    process.env.USER_1_PASSWORD,
  );
  const responseLoginJson = await responseLogin.json();
  const accessToken = responseLoginJson.accessToken;

  const responseJoinEvent = await joinEvent(request, accessToken, eventId);
  expect(responseJoinEvent.status()).toBe(204);
  await logoutUser(request, accessToken);
});

//MOB-46
test('Leave an event', { tag: '@happy-path' }, async ({ request }) => {
  const responseLogin = await loginUser(
    request,
    process.env.USER_1_EMAIL,
    process.env.USER_1_PASSWORD,
  );
  const responseLoginJson = await responseLogin.json();
  const accessToken = responseLoginJson.accessToken;
  const responseJoinEvent = await leaveEvent(request, accessToken, eventId);
  expect(responseJoinEvent.status()).toBe(204);
  await logoutUser(request, accessToken);
});

//MOB-304
test(
  'Get created events by user',
  { tag: '@happy-path' },
  async ({ request }) => {
    executeBeforeAfter = false;

    const responseCreatedEvents = await request.get(
      'v1/account/events/created',
      {
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
        },
      },
    );

    expect(responseCreatedEvents.status()).toBe(200);
    const responseCreatedEventsJson = await responseCreatedEvents.json();
    expect(responseCreatedEventsJson).toHaveProperty('totalEvents');
    expect(responseCreatedEventsJson).toHaveProperty('events');
  },
);

//MOB-47
test(
  'Get joined events by user',
  { tag: '@happy-path' },
  async ({ request }) => {
    executeBeforeAfter = false;

    const responseLogin = await loginUser(
      request,
      process.env.USER_1_EMAIL,
      process.env.USER_1_PASSWORD,
    );
    const responseLoginJson = await responseLogin.json();

    const responseJoinedEvents = await request.get('v1/account/events', {
      headers: {
        Authorization: `Bearer ${responseLoginJson.accessToken}`,
      },
    });

    expect(responseJoinedEvents.status()).toBe(200);
    const responseJoinedEventsJson = await responseJoinedEvents.json();
    expect(responseJoinedEventsJson).toHaveProperty('totalEvents');
    expect(responseJoinedEventsJson).toHaveProperty('events');
  },
);
