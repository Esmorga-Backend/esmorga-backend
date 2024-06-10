import { Injectable } from '@nestjs/common';
import { CreateEventDto } from '../../../infraestructure/http/dtos';
import { EventRepository } from '../../../infraestructure/db/repositories';

@Injectable()
export class CreateEventService {
  constructor(private readonly eventRepository: EventRepository) {}

  /**
   * Create an event.
   *
   * @param createEventDto - Data transfer object containing event details.
   */
  async create(createEventDto: CreateEventDto) {
    try {
      await this.eventRepository.createEvent(createEventDto);
    } catch (error) {
      throw error;
    }
  }
}