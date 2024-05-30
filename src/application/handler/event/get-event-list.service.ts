import { Injectable } from '@nestjs/common';
import { EventRepository } from '../../../infraestructure/db/repositories';
import { filterAvaliableEvents } from '../../../domain/services';
import { EventDTO, EventListDTO } from '../../../infraestructure/dtos';

@Injectable()
export class GetEventListService {
  constructor(private readonly eventRepository: EventRepository) {}

  /**
   * Provide a list of available events and the counter of them.
   *
   * @returns - Object containing the total number of available events and the list of available events.
   */
  async find(): Promise<EventListDTO> {
    try {
      const events: EventDTO[] = await this.eventRepository.getEventList();

      const avaliableEvents = filterAvaliableEvents(events);

      return {
        totalEvents: avaliableEvents.length,
        events: avaliableEvents,
      };
    } catch (error) {
      throw error;
    }
  }
}
