import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { EventDto } from '../../../infrastructure/dtos';
import { UpdateEventDto } from '../../../infrastructure/http/dtos';
import { ACCOUNT_ROLES } from '../../../domain/const';
import {
  DataBaseBadRequestError,
  DataBaseUnauthorizedError,
} from '../../../infrastructure/db/errors';
import {
  AccountRepository,
  EventRepository,
  SessionRepository,
} from '../../../infrastructure/db/repositories';
import {
  InvalidEventIdApiError,
  NotAdminAccountApiError,
  InvalidTokenApiError,
  InvalidJoinDeadlineApiError,
} from '../../../domain/errors';

@Injectable()
export class UpdateEventService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly accountRepository: AccountRepository,
    private readonly eventRepository: EventRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  /**
   * Update an event.
   *
   * @param sessionId - Client session id.
   * @param updateEventDto - Data transfer object containing event details.
   * @param requestId - The request ID for loggers.
   * @throws NotAdminAccountApiError - User is not admin.
   * @throws InvalidEventIdApiError - EventId is not valid following DB schema ot not found.
   * @throws InvalidTokenApiError - No user found for the current session.
   */
  async update(
    sessionId: string,
    updateEventDto: UpdateEventDto,
    requestId?: string,
  ): Promise<EventDto> {
    try {
      this.logger.info(
        `[UpdateEventService] [update] - x-request-id:${requestId}`,
      );

      const { uuid } = await this.sessionRepository.getBySessionId(
        sessionId,
        requestId,
      );

      const { role } = await this.accountRepository.getUserById(
        uuid,
        requestId,
      );

      if (role !== ACCOUNT_ROLES.ADMIN) throw new NotAdminAccountApiError();

      const { eventId } = updateEventDto;

      const existingEvent = await this.eventRepository.findOneByEventId(
        eventId,
        requestId,
      );

      if (updateEventDto.joinDeadline !== undefined) {
        const currentEventDate =
          updateEventDto.eventDate ?? existingEvent.eventDate;
        if (
          new Date(updateEventDto.joinDeadline) > new Date(currentEventDate)
        ) {
          throw new InvalidJoinDeadlineApiError();
        }
      }

      if (
        updateEventDto.eventDate &&
        updateEventDto.joinDeadline === undefined &&
        existingEvent.joinDeadline != null &&
        new Date(existingEvent.joinDeadline) >
          new Date(updateEventDto.eventDate)
      ) {
        updateEventDto.joinDeadline = null;
      }

      if (updateEventDto.location) {
        updateEventDto.location = {
          ...existingEvent.location,
          ...updateEventDto.location,
        };
      }

      const updatedEvent = await this.eventRepository.updateEvent(
        uuid,
        eventId,
        updateEventDto,
        requestId,
      );

      return updatedEvent;
    } catch (error) {
      this.logger.error(
        `[UpdateEventService] [update] - x-request-id:${requestId}, error ${error}`,
      );

      if (error instanceof DataBaseBadRequestError)
        throw new InvalidEventIdApiError();

      if (error instanceof DataBaseUnauthorizedError)
        throw new InvalidTokenApiError();

      throw error;
    }
  }
}
