import { Event } from 'src/domain/entities';

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
