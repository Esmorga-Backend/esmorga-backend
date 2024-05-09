import { Injectable } from '@nestjs/common';
import { EventReposiory } from '../../../infraestructure/db/repositories';
import { filterAvaliableEvents } from '../../../domain/services';

@Injectable()
export class GetEventListService {
  constructor(private readonly eventRepository: EventReposiory) {}

  async find() {
    try {
      const events = await this.eventRepository.getEventList();

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
