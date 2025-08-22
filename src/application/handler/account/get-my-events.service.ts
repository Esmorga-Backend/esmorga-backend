import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { EventDto, EventListDto } from '../../../infrastructure/dtos';
import {
  SessionRepository,
  EventRepository,
  EventParticipantsRepository,
} from '../../../infrastructure/db/repositories';
import { filterAvaliableEvents } from '../../../domain/services';
import { DataBaseUnathorizedError } from '../../../infrastructure/db/errors';
import { InvalidTokenApiError } from '../../../domain/errors';

@Injectable()
export class GetMyEventsService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly sessionRepository: SessionRepository,
    private readonly eventRepository: EventRepository,
    private readonly eventParticipantsRepository: EventParticipantsRepository,
  ) {}

  /**
   * Provide a list of not celebrated events user authenticated joined as participant.
   *
   * @param sessionId - Client session id.
   * @param requestId - Request identifier.
   * @returns EventListDto - Object containing the total number of available events and the list of available events.
   */
  async getEvents(
    sessionId: string,
    requestId?: string,
  ): Promise<EventListDto> {
    try {
      this.logger.info(
        `[GetMyEventsService] [getEvents] - x-request-id: ${requestId}`,
      );

      const { uuid } = await this.sessionRepository.getBySessionId(
        sessionId,
        requestId,
      );

      const eventIds: string[] =
        await this.eventParticipantsRepository.getEventsJoined(uuid, requestId);

      const events: EventDto[] =
        await this.eventRepository.getEventListByEventsIds(eventIds, requestId);

      const avaliableEvents = filterAvaliableEvents(events);

      const eventList: EventListDto = {
        totalEvents: avaliableEvents.length,
        events: avaliableEvents,
      };

      return eventList;
    } catch (error) {
      this.logger.error(
        `[GetMyEventsService] [getEvents] - x-request-id: ${requestId}, error ${error}`,
      );

      if (error instanceof DataBaseUnathorizedError)
        throw new InvalidTokenApiError();

      throw error;
    }
  }
}
