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
  InvalidEventIdApiError,
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

  /**
   * Remove the user authenthicated from the event participant list.
   *
   * @param accessToken - Token allows user a method to authenticate.
   * @param eventId - Event identifier.
   * @param requestId - Request identifier.
   * @throws NotAccepteableDisjoinEventApiError - User can not disjoin from a celebrated event.
   * @throws InvalidTokenApiError - No user found for the current session.
   * @throws InvalidEventIdApiError - EventId is not valid follwing DB schema ot not found.
   */
  async disJoinEvent(accessToken: string, eventId: string, requestId?: string) {
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
        throw new InvalidEventIdApiError();

      throw error;
    }
  }
}
