import { EventDto } from '../../../src/infrastructure/dtos';
import { EVENT_TYPE } from '../../../src/domain/const';

const futureDate: Date = new Date();
futureDate.setFullYear(2025);

const oldDate: Date = new Date();
oldDate.setFullYear(2023);

export const EVENT_MOCK: EventDto = {
  eventId: '6656e23640e1fdb4ceb23cc9',
  eventName: 'MobgenFest',
  eventDate: futureDate,
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

export const OLD_EVENT_MOCK: EventDto = {
  eventId: '6656e23640e1fdb4ceb23cc8',
  eventName: 'Paintball',
  eventDate: oldDate,
  description: 'Hello World',
  eventType: EVENT_TYPE.SPORT,
  imageUrl: 'img.url',
  location: {
    lat: 43.35525182148881,
    long: -8.41937931298951,
    name: 'Vigo',
  },
  tags: ['Shoots', 'Sports'],
};
