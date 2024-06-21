import {
  CreateEventDto,
  EventType,
} from '../../../src/infrastructure/http/dtos';

export const CREATE_EVENT_MOCK: CreateEventDto = {
  eventName: 'MobgenFest',
  eventDate: '2025-03-08T10:05:30.915Z',
  description: 'Hello World',
  eventType: EventType.PARTY,
  imageUrl: 'img.url',
  location: {
    lat: 43.35525182148881,
    long: -8.41937931298951,
    name: 'A Coruña',
  },
  tags: ['Meal', 'Music'],
};

export const CREATE_EVENT_WITHOUT_OPTIONAL_FIELDS_MOCK: CreateEventDto = {
  eventName: 'MobgenFest',
  eventDate: '2025-03-08T10:05:30.915Z',
  description: 'Hello World',
  eventType: EventType.PARTY,
  location: {
    name: 'A Coruña',
  },
};
