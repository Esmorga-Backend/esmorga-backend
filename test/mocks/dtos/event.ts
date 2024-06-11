import { EventDto } from '../../../src/infrastructure/dtos';

const futureDate: Date = new Date();
futureDate.setFullYear(2025);

const oldDate: Date = new Date();
oldDate.setFullYear(2023);

export const eventMock: EventDto = {
  eventId: '6656e23640e1fdb4ceb23cc9',
  eventName: 'MobgenFest',
  eventDate: futureDate,
  description: 'Hello World',
  eventType: 'Party',
  imageUrl: 'img.url',
  location: {
    lat: 43.35525182148881,
    long: -8.41937931298951,
    name: 'A Coruña',
  },
  tags: ['Meal', 'Music'],
};

export const oldEventMock: EventDto = {
  eventId: '6656e23640e1fdb4ceb23cc8',
  eventName: 'Paintball',
  eventDate: oldDate,
  description: 'Hello World',
  eventType: 'Sport',
  imageUrl: 'img.url',
  location: {
    lat: 43.35525182148881,
    long: -8.41937931298951,
    name: 'Vigo',
  },
  tags: ['Shoots', 'Sports'],
};
