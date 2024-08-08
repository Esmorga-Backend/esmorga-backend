import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import {
  DataBaseUnathorizedError,
  DataBaseNotFoundError,
} from '../../../infrastructure/db/errors';
import {
  EventRepository,
  TokensRepository,
  EventParticipantsRepository,
} from '../../../infrastructure/db/repositories';
import {
  BadEventIdApiError,
  InvalidTokenApiError,
  NotAccepteableDisjoinEventApiError,
} from '../../../domain/errors';

@Injectable()
export class DisjoinEventService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly eventRepository: EventRepository,
    private readonly tokensRepository: TokensRepository,
    private readonly eventParticipantsRepository: EventParticipantsRepository,
  ) {}

  async disJoinEvent(accessToken: string, eventId: string, requestId: string) {
    try {
      this.logger.info(
        `[DisjoinEventService] [disJoinEvent] - x-request-id: ${requestId}, eventId ${eventId}`,
      );

      const { uuid } = await this.tokensRepository.getPairOfTokensByAccessToken(
        accessToken,
        requestId,
      );

      const { eventDate } = await this.eventRepository.getEvent(
        eventId,
        requestId,
      );

      if (eventDate < new Date()) {
        throw new NotAccepteableDisjoinEventApiError();
      }

      await this.eventParticipantsRepository.disjoinParticipantList(
        eventId,
        uuid,
        requestId,
      );
    } catch (error) {
      this.logger.error(
        `[DisjoinEventService] [disJoinEvent] - x-request-id: ${requestId}, error ${error}`,
      );

      if (error instanceof DataBaseUnathorizedError)
        throw new InvalidTokenApiError();

      if (error instanceof DataBaseNotFoundError)
        throw new BadEventIdApiError();

      throw error;
    }
  }
}
