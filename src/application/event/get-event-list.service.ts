import { Injectable } from '@nestjs/common';
import { EventReposiory } from '../../infraestructure/db/repositories';

@Injectable()
export class GetEventListService {
  constructor(private readonly eventRepository: EventReposiory) {}

  async find() {
    try {
      const events = await this.eventRepository.getEventList();

      //TODO call service to delete events ocurred before

      return events;
    } catch (error) {
      throw error;
    }
  }
}
