import { EventDTO } from '../../infraestructure/dtos';

/**
 * Filter the event list discarting celebrated ones.
 *
 * @param {Event[]} eventList - List of event to filter.
 * @returns {Event[]} - Event list without celebrated events.
 */
export function filterAvaliableEvents(eventList: EventDTO[]): EventDTO[] {
  const currentDate = new Date();

  return eventList.filter((event) => event.eventDate >= currentDate);
}
