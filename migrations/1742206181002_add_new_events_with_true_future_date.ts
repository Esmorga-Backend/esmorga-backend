import { Db } from 'mongodb';
import { MigrationInterface } from 'mongo-migrate-ts';

const collection = 'events';
const eventNames = [
  'MobgenFest',
  'Paintball',
  'MobgenFest 2',
  'MobgenFest 3',
  'MobgenFest 4',
];

const currentDate: Date = new Date();

const futureDate: Date = new Date();
futureDate.setFullYear(new Date().getFullYear() + 1);

const fixed_futureDate: Date = new Date();
futureDate.setFullYear(2135);

const oldDate: Date = new Date();
oldDate.setFullYear(new Date().getFullYear() - 1);

export class add_new_events_with_true_future_date1742206181002
  implements MigrationInterface
{
  public async up(db: Db): Promise<any> {
    const newEvents = [
      {
        eventName: eventNames[0],
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
      },
      {
        eventName: eventNames[1],
        eventDate: futureDate,
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
      },
      {
        eventName: eventNames[2],
        eventDate: futureDate,
        description: 'Event with only location.name',
        eventType: 'Party',
        imageUrl: 'img.url',
        location: {
          name: 'A Coruña',
        },
        tags: ['Meal', 'Music'],
        createdAt: currentDate,
      },
      {
        eventName: eventNames[3],
        eventDate: oldDate,
        description: 'Event with eventDate some time ago',
        eventType: 'Party',
        imageUrl: 'img.url',
        location: {
          lat: 43.35525182148881,
          long: -8.41937931298951,
          name: 'A Coruña',
        },
        tags: ['Meal', 'Music'],
        createdAt: currentDate,
      },
      {
        eventName: eventNames[4],
        eventDate: fixed_futureDate,
        description: 'Event withfixed future date',
        eventType: 'Party',
        imageUrl: 'img.url',
        location: {
          lat: 43.35525182148881,
          long: -8.41937931298951,
          name: 'A Coruña',
        },
        tags: ['Meal', 'Music'],
        createdAt: currentDate,
      },
    ];

    await db.collection(collection).insertMany(newEvents);
  }

  public async down(db: Db): Promise<any> {
    await db.collection(collection).deleteMany({
      eventName: { $in: eventNames },
    });
  }
}
