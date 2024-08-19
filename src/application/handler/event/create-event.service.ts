import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import {
  AccountRepository,
  EventRepository,
  TokensRepository,
} from '../../../infrastructure/db/repositories';
import {
  InvalidRoleApiError,
  InvalidTokenApiError,
} from '../../../domain/errors';
import { DataBaseUnathorizedError } from '../../../infrastructure/db/errors';
import { USER_ROLES } from '../../../domain/consts';

@Injectable()
export class CreateEventService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly accountRepository: AccountRepository,
    private readonly eventRepository: EventRepository,
    private readonly tokensRepository: TokensRepository,
  ) {}

  /**
   * Create an event.
   *
   * @param accesToken - The accesToken to authorise.
   * @param createEventDto - Data transfer object containing event details.
   * @param requestId - The request ID for loggers.
   */
  async create(
    accessToken: string,
    createEventDto: object,
    requestId?: string,
  ) {
    try {
      this.logger.info(
        `[CreateEventService] [create] - x-request-id: ${requestId}`,
      );

      const { uuid } = await this.tokensRepository.getPairOfTokensByAccessToken(
        accessToken,
        requestId,
      );

      const { email, role } = await this.accountRepository.getUserById(
        uuid,
        requestId,
      );

      if (role !== USER_ROLES.ADMIN) throw new InvalidRoleApiError();

      await this.eventRepository.createEvent(
        { ...createEventDto, createdBy: email },
        requestId,
      );
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
