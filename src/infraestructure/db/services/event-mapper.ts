import { Event } from 'src/domain/entities';

/**
 * Addapt a list of events provided by the database into a list of events that 
 * follow the domain entity that is expected to be returned
 * 
 * @param eventsFromDataBase - Event array provided by the db
 * @returns - Event array following the domain schema
 */
export function mapToEventsEntity(eventsFromDataBase): Event[] {
  return eventsFromDataBase.map((event) => {
    const {
      location: { lat, long, name },
    } = event;

    return {
      eventId: event._id,
      eventName: event.eventName,
      eventDate: event.eventDate,
      description: event.description,
      eventType: event.eventType,
      imageUrl: event.imageUrl,
      location: {
        lat,
        long,
        name,
      },
      tags: event.tags,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    };
  });
}
