import {
  UpdateEventDto,
  UpdateEventType,
} from '../../../src/infrastructure/http/dtos';

export const UPDATE_EVENT_MOCK: UpdateEventDto = {
  eventId: '6656e23640e1fdb4ceb23cc9',
  eventName: 'MobgenFest',
  eventDate: '2025-03-08T10:05:30.915Z',
  description: 'Hello World',
  eventType: UpdateEventType.PARTY,
  imageUrl: 'img.url',
  location: {
    lat: 43.35525182148881,
    long: -8.41937931298951,
    name: 'A Coruña',
  },
  tags: ['Meal', 'Music'],
};

export const UPDATE_EVENT_WITHOUT_OPTIONAL_FIELDS_MOCK: Partial<UpdateEventDto> =
  {
    eventId: '6656e23640e1fdb4ceb23cc9',
  };