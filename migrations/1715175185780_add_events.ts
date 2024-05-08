import { Db } from 'mongodb'
import { MigrationInterface } from 'mongo-migrate-ts';

const collection = 'events';
const eventNames = ['MobgenFest','Paintball'];

export class add_events1715175185780 implements MigrationInterface {
  public async up(db: Db): Promise<any> {
    const newEvents = [
      {
        eventName: eventNames[0],
        eventDate: new Date(),
        description: 'Hello World',
        eventType: "Party",
        imageUrl: "img.url",
        location: {
          lat: 43.35525182148881,
          long: -8.41937931298951,
          name: "A Coruña",
        },
        tags: ["Meal", "Music"]
    },
    {
      eventName: eventNames[1],
      eventDate: new Date(),
      description: 'Hello World',
      eventType: "Sport",
      imageUrl: "img.url",
      location: {
        lat: 43.35525182148881,
        long: -8.41937931298951,
        name: "Vigo",
      },
      tags: ["Shoots", "Sports"]
  }
    ];

    await db.collection(collection).insertMany(newEvents);
  }

  public async down(db: Db): Promise<any> {
    await db.collection(collection).deleteMany({
      eventName: { $in: eventNames }
    });
  }
}
