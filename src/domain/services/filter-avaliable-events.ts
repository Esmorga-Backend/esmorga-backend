import { Event } from '../entities';

export function filterAvaliableEvents(eventList: Event[]): Event[] {
  const currentDate = new Date();

  const avaliableEvents: Event[] = [];

  eventList.map((event) => {
    if (event.eventDate >= currentDate) {
      avaliableEvents.push(event);
    }
  });

  return avaliableEvents;
}
