import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { CreateEventDto } from '../../../infrastructure/http/dtos';
import { EventRepository } from '../../../infrastructure/db/repositories';

@Injectable()
export class CreateEventService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly eventRepository: EventRepository,
  ) {}

  /**
   * Create an event.
   *
   * @param createEventDto - Data transfer object containing event details.
   */
  async create(createEventDto: CreateEventDto, requestId?: string) {
    try {
      this.logger.info(
        `[CreateEventService] [create] - x-request-id:${requestId}`,
      );

      await this.eventRepository.createEvent(createEventDto, requestId);
    } catch (error) {
      this.logger.error(
        `[CreateEventService] [create] - x-request-id:${requestId}, error ${error}`,
      );

      throw error;
    }
  }
}
