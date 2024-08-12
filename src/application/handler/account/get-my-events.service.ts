import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { EventDto } from '../../../infrastructure/dtos';
import {
  TokensRepository,
  EventRepository,
  EventParticipantsRepository,
} from '../../../infrastructure/db/repositories';

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
  ): Promise<EventDto[]> {
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

      return events;
    } catch (error) {
      this.logger.error(
        `[GetMyEventsService] [getEvents] - x-request-id: ${requestId}, error ${error}`,
      );

      throw error;
    }
  }
}
