import { test, expect } from '@playwright/test';
import { loginAdminUser, loginUser, logoutUser } from '../Common/Login';
import {
  createEvent,
  deleteEvent,
  getEventId,
  joinEvent,
  modifyEvent,
} from '../Common/Event';

let adminAccessToken: string;
let eventId: string;
let triggerBeforeEachCreateEvent = true;
let triggerAfterEachDeleteEvent = true;

test.beforeEach(async ({ request }) => {
  const responseLogin = await loginAdminUser(request);
  const responseLoginJson = await responseLogin.json();
  adminAccessToken = responseLoginJson.accessToken;

  if (triggerBeforeEachCreateEvent) {
    // Create an event
    await createEvent(request, adminAccessToken);
    // Get the eventId from the created event
    eventId = await getEventId(request, 'PW Automation Test');
  }
});

test.afterEach(async ({ request }) => {
  if (triggerAfterEachDeleteEvent) {
    await deleteEvent(request, adminAccessToken, eventId);
  }

  await logoutUser(request, adminAccessToken);
});

//MOB-19
test(
  'Get available events',
  {
    tag: '@happy-path',
  },
  async ({ request }) => {
    const responseBody = await request.get('/v1/events');

    expect(responseBody.status()).toBe(200);
    const responseEventsJson = await responseBody.json();
    expect(responseEventsJson).toHaveProperty('totalEvents');
    expect(responseEventsJson).toHaveProperty('events');
  },
);

//MOB-43
test(
  'Remove an event',
  {
    tag: '@happy-path',
  },
  async ({ request }) => {
    triggerAfterEachDeleteEvent = false;
    const responseEvents = await deleteEvent(
      request,
      adminAccessToken,
      eventId,
    );
    expect(responseEvents.status()).toBe(204);
  },
);

//MOB-197
test.describe('Tests for get joined users to events', () => {
  let userAccessToken: string;

  test.beforeEach(async ({ request }) => {
    const users = [
      {
        email: process.env.USER_1_EMAIL,
        password: process.env.USER_1_PASSWORD,
      },
      {
        email: process.env.USER_2_EMAIL,
        password: process.env.USER_2_PASSWORD,
      },
      {
        email: process.env.USER_3_EMAIL,
        password: process.env.USER_3_PASSWORD,
      },
    ];
    for (const user of users) {
      const responseLogin = await loginUser(request, user.email, user.password);
      const responseLoginJson = await responseLogin.json();
      userAccessToken = responseLoginJson.accessToken;
      await joinEvent(request, userAccessToken, eventId);
      await logoutUser(request, userAccessToken);
    }
  });

  test(
    'Get users on event',
    {
      tag: '@happy-path',
    },
    async ({ request }) => {
      const responseUserEvent = await request.get(
        `v1/events/${eventId}/users`,
        {
          headers: {
            Authorization: `Bearer ${adminAccessToken}`,
          },
        },
      );
      expect(responseUserEvent.status()).toBe(200);
      const responseUserEventJson = await responseUserEvent.json();
      expect(responseUserEventJson).toHaveProperty('totalUsers');
      expect(responseUserEventJson).toHaveProperty('users');
      expect(responseUserEventJson.totalUsers).toBe(3);
    },
  );
});

//MOB-45
test(
  'Modify an event',
  {
    tag: '@happy-path',
  },
  async ({ request }) => {
    const updatedEvent = {
      eventName: 'PW Automation Test',
      eventDate: '2026-10-28T10:05:30.915Z',
      description: 'Updated Test description',
      eventType: 'Games',
      imageUrl: 'newimage.url',
      location: {
        name: 'Vigo',
        lat: 40.416775,
        long: -3.70379,
      },
      tags: ['Dance', 'Music'],
    };
    const responseUpdateEvent = await modifyEvent(
      request,
      adminAccessToken,
      eventId,
      updatedEvent,
    );
    const responseUpdateEventJson = await responseUpdateEvent.json();
    expect(responseUpdateEvent.status()).toBe(200);
    expect(responseUpdateEventJson).toHaveProperty('eventId', eventId);
    expect(responseUpdateEventJson.description).toBe(
      'Updated Test description',
    );
    expect(responseUpdateEventJson.eventType).toBe('Games');
    expect(responseUpdateEventJson.location.name).toBe('Vigo');
  },
);

//MOB-48
test(
  'Create an event',
  {
    tag: '@happy-path',
  },
  async ({ request }) => {
    triggerBeforeEachCreateEvent = false;

    const newEvent = {
      eventName: 'PW Automation Test',
      eventDate: '2026-10-28T10:05:30.915Z',
      description: 'Test description',
      eventType: 'Games',
      imageUrl: 'newimage.url',
      location: {
        name: 'A Coruña',
        lat: 40.416775,
        long: -3.70379,
      },
      tags: ['Dance', 'Music'],
    };
    const responseCreateEvent = await createEvent(
      request,
      adminAccessToken,
      newEvent,
    );
    expect(responseCreateEvent.status()).toBe(201);
  },
);
