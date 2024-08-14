import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { EventDto, EventListDto } from '../../../infrastructure/dtos';
import {
  TokensRepository,
  EventRepository,
  EventParticipantsRepository,
} from '../../../infrastructure/db/repositories';
import { filterAvaliableEvents } from '../../../domain/services';

@Injectable()
export class GetMyEventsService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly tokensRepository: TokensRepository,
    private readonly eventRepository: EventRepository,
    private readonly eventParticipantsRepository: EventParticipantsRepository,
  ) {}

  async getEvents(
    accessToken: string,
    requestId?: string,
  ): Promise<EventListDto> {
    try {
      this.logger.info(
        `[GetMyEventsService] [getEvents] - x-request-id: ${requestId}`,
      );

      const { uuid } = await this.tokensRepository.getPairOfTokensByAccessToken(
        accessToken,
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

      throw error;
    }
  }
}