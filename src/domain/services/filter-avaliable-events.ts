import { Event } from '../entities';

export function filterAvaliableEvents(eventList: Event[]): Event[] {
  const currentDate = new Date();

  return eventList.filter((event) => event.eventDate >= currentDate);
}
