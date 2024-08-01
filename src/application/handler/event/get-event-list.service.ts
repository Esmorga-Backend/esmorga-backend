import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { EventRepository } from '../../../infrastructure/db/repositories';
import { filterAvaliableEvents } from '../../../domain/services';
import { EventDto, EventListDto } from '../../../infrastructure/dtos';

@Injectable()
export class GetEventListService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly eventRepository: EventRepository,
  ) {}

  /**
   * Provide a list of available events and the counter of them.
   *
   * @returns - Object containing the total number of available events and the list of available events.
   */
  async find(requestId?: string): Promise<EventListDto> {
    try {
      this.logger.info(
        `[GetEventListService] [find] - x-request-id: ${requestId}`,
      );

      const events: EventDto[] = await this.eventRepository.getEventList();

      const avaliableEvents = filterAvaliableEvents(events);

      return {
        totalEvents: avaliableEvents.length,
        events: avaliableEvents,
      };
    } catch (error) {
      this.logger.error(
        `[GetEventListService] [find] - x-request-id: ${requestId}, error: ${error}`,
      );

      throw error;
    }
  }
}
