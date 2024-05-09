import { Event } from 'src/infraestructure/db/schema';

const currentDate: Date = new Date();

const futureDate: Date = new Date();
futureDate.setFullYear(2025);

const oldDate: Date = new Date();
oldDate.setFullYear(2023);

export const futureEventDB: Event = {
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
  createdAt: currentDate,
  updatedAt: currentDate,
};

// Event celebrated
export const oldEventDB: Event = {
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
  createdAt: currentDate,
  updatedAt: currentDate,
};
