import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import {
  DataBaseUnauthorizedError,
  DataBaseNotFoundError,
} from '../../../infrastructure/db/errors';
import {
  EventRepository,
  SessionRepository,
  EventParticipantsRepository,
} from '../../../infrastructure/db/repositories';
import {
  InvalidEventIdApiError,
  InvalidTokenApiError,
  NotAcceptableEventApiError,
  NotAcceptableFullEventApiError,
} from '../../../domain/errors';

@Injectable()
export class JoinEventService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly eventRepository: EventRepository,
    private readonly sessionRepository: SessionRepository,
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
   * @throws NotAcceptableFullEventApiError - Event has reached maximum capacity.
   */
  async joinEvent(sessionId: string, eventId: string, requestId?: string) {
    try {
      this.logger.info(
        `[JoinEventService] [joinEvent] - x-request-id: ${requestId}, eventId ${eventId}`,
      );

      const { uuid } = await this.sessionRepository.getBySessionId(
        sessionId,
        requestId,
      );

      const { currentAttendeeCount, eventDate, joinDeadline, maxCapacity } =
        await this.eventRepository.getEvent(eventId, requestId);

      if (eventDate < new Date()) throw new NotAcceptableEventApiError();

      if (joinDeadline < new Date()) throw new NotAcceptableFullEventApiError();

      if (currentAttendeeCount >= maxCapacity)
        throw new NotAcceptableFullEventApiError();

      const participantAdded =
        await this.eventParticipantsRepository.updateParticipantList(
          eventId,
          uuid,
          requestId,
        );

      if (participantAdded) {
        await this.eventRepository.incrementAttendeeCount(
          uuid,
          eventId,
          requestId,
        );
      }
    } catch (error) {
      this.logger.error(
        `[JoinEventService] [joinEvent] - x-request-id: ${requestId}, error ${error}`,
      );

      if (error instanceof DataBaseUnauthorizedError)
        throw new InvalidTokenApiError();

      if (error instanceof DataBaseNotFoundError)
        throw new InvalidEventIdApiError();

      throw error;
    }
  }
}
