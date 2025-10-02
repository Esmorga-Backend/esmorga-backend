import { APIRequestContext } from '@playwright/test';

interface eventDataType {
  eventName: string;
  eventDate: string;
  description: string;
  eventType: string;
  imageUrl: string;
  location: {
    name: string;
    lat: number;
    long: number;
  };
  tags: string[];
}

const event: eventDataType = {
  eventName: 'PW Automation Test',
  eventDate: '2026-09-28T10:05:30.915Z',
  description: 'PW Automation Test description',
  eventType: 'Party',
  imageUrl: 'image.url',
  location: {
    name: 'A Coruña',
    lat: 43.35525182148881,
    long: -8.41937931298951,
  },
  tags: ['Dance', 'Music'],
};

export async function createEvent(
  request: APIRequestContext,
  accessToken: string,
  eventData: eventDataType = event,
) {
  return await request.post('/v1/events', {
    data: eventData,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export async function modifyEvent(
  request: APIRequestContext,
  accessToken: string,
  eventId: string,
  eventData: eventDataType,
) {
  return await request.patch('/v1/events', {
    data: { eventId: eventId, ...eventData },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export async function deleteEvent(
  request: APIRequestContext,
  accessToken: string,
  eventId: string,
) {
  return await request.delete(`/v1/events`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    data: {
      eventId: eventId,
    },
  });
}

export async function getEventId(
  request: APIRequestContext,
  eventName: string,
) {
  const response = await request.get('/v1/events');
  const events = await response.json();
  const event = await events.find(
    (event: { eventName: string }) => event.eventName === eventName,
  );
  return event.eventId;
}

export async function joinEvent(
  request: APIRequestContext,
  accessToken: string,
  eventId: string,
) {
  return await request.post(`/v1/account/events`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    data: {
      eventId: eventId,
    },
  });
}
