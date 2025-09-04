import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import {
  AccountRepository,
  EventRepository,
  SessionRepository,
} from '../../../infrastructure/db/repositories';
import { EventWithCreatorFlagDto, EventListWithCreatorFlagDto } from '../../../infrastructure/dtos';
import { DataBaseUnathorizedError } from '../../../infrastructure/db/errors';
import { InvalidTokenApiError, NotAdminAccountApiError } from '../../../domain/errors';
import { ACCOUNT_ROLES } from '../../../domain/const';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class GetUserCreatedEventsService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly sessionRepository: SessionRepository,
    private readonly accountRepository: AccountRepository,
    private readonly eventRepository: EventRepository,
  ) {}

  /**
   * Provide a list of events created by user.
   *
   * @param sessionId - Client session id.
   * @param requestId - Request identifier.
   * @returns EventListWithCreatorFlagDto - Object containing the total number of events created by the current user.
   */
  async getEvents(
    sessionId: string,
    requestId?: string,
  ): Promise<EventListWithCreatorFlagDto> {
    try {
      this.logger.info(
        `[GetUserCreatedEventsService] [getEvents] - x-request-id: ${requestId}`,
      );

      const { uuid } = await this.sessionRepository.getBySessionId(
        sessionId,
        requestId,
      );

      const { email, role } = await this.accountRepository.getUserById(
        uuid,
        requestId,
      );

      if (role !== ACCOUNT_ROLES.ADMIN) throw new NotAdminAccountApiError();

      const events: EventWithCreatorFlagDto[] =
              await this.eventRepository.getEventsCreatedByEmail(email, requestId);

      const eventList: EventListWithCreatorFlagDto = {
              totalEvents: events.length,
              events: events,
            };

      return eventList;
    } catch (error) {
      this.logger.error(
        `[GetUserCreatedEventsService] [getEvents] - x-request-id: ${requestId}, error ${error}`,
      );

      if (error instanceof DataBaseUnathorizedError)
        throw new InvalidTokenApiError();

      throw error;
    }
  }
}
