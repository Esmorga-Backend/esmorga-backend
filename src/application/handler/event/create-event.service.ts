import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import {
  AccountRepository,
  EventRepository,
  SessionRepository,
} from '../../../infrastructure/db/repositories';
import {
  NotAdminAccountApiError,
  InvalidTokenApiError,
} from '../../../domain/errors';
import { CreateEventDto } from '../../../infrastructure/http/dtos';
import { DataBaseUnathorizedError } from '../../../infrastructure/db/errors';
import { ACCOUNT_ROLES } from '../../../domain/const';

@Injectable()
export class CreateEventService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly accountRepository: AccountRepository,
    private readonly eventRepository: EventRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  /**
   * Create an event.
   *
   * @param sessionId - Client session id.
   * @param createEventDto - Data transfer object containing event details.
   * @param requestId - The request ID for loggers.
   * @throws NotAdminAccountApiError - User is not admin.
   * @throws InvalidTokenApiError - No user found for the current session.
   */
  async create(
    sessionId: string,
    createEventDto: CreateEventDto,
    requestId?: string,
  ) {
    try {
      this.logger.info(
        `[CreateEventService] [create] - x-request-id: ${requestId}`,
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

      await this.eventRepository.createEvent(createEventDto, email, requestId);
    } catch (error) {
      this.logger.error(
        `[CreateEventService] [create] - x-request-id: ${requestId}, error: ${error}`,
      );

      if (error instanceof DataBaseUnathorizedError)
        throw new InvalidTokenApiError();

      throw error;
    }
  }
}
