import {
  CreateEventDto,
  EventType,
} from '../../../src/infraestructure/http/dtos';

export const createEventMock: CreateEventDto = {
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
