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
  NotAcceptableEventApiError,
} from '../../../domain/errors';

@Injectable()
export class JoinEventService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly eventRepository: EventRepository,
    private readonly tokensRepository: TokensRepository,
    private readonly eventParticipantsRepository: EventParticipantsRepository,
  ) {}

  /**
   * Insert user uuid as particpant for the event that matches with the ID provided.
   *
   * @param sessionId - Client session id.
   * @param eventId - Event identifier.
   * @param requestId - Request identifier.
   * @throws NotAcceptableEventApiError - User can not join past events.
   * @throws InvalidTokenApiError - No user found for the current session.
   * @throws InvalidEventIdApiError - EventId is not valid follwing DB schema ot not found.
   */
  async joinEvent(sessionId: string, eventId: string, requestId?: string) {
    try {
      this.logger.info(
        `[JoinEventService] [joinEvent] - x-request-id: ${requestId}, eventId ${eventId}`,
      );

      const { uuid } = await this.tokensRepository.getBySessionId(
        sessionId,
        requestId,
      );

      const { eventDate } = await this.eventRepository.getEvent(
        eventId,
        requestId,
      );

      if (eventDate < new Date()) throw new NotAcceptableEventApiError();

      await this.eventParticipantsRepository.updateParticipantList(
        eventId,
        uuid,
        requestId,
      );
    } catch (error) {
      this.logger.error(
        `[JoinEventService] [joinEvent] - x-request-id: ${requestId}, error ${error}`,
      );

      if (error instanceof DataBaseUnathorizedError)
        throw new InvalidTokenApiError();

      if (error instanceof DataBaseNotFoundError)
        throw new InvalidEventIdApiError();

      throw error;
    }
  }
}
