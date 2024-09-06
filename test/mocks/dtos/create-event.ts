import { CreateEventDto } from '../../../src/infrastructure/http/dtos';
import { EVENT_TYPE } from '../../../src/domain/const';

export const CREATE_EVENT_MOCK: CreateEventDto = {
  eventName: 'MobgenFest',
  eventDate: '2025-03-08T10:05:30.915Z',
  description: 'Hello World',
  eventType: EVENT_TYPE.PARTY,
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
  eventType: EVENT_TYPE.PARTY,
  location: {
    name: 'A Coruña',
  },
};
