import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import {
  AccountRepository,
  PollRepository,
  SessionRepository,
} from '../../../infrastructure/db/repositories';
import {
  NotAdminAccountApiError,
  InvalidTokenApiError,
} from '../../../domain/errors';
import { CreatePollDto } from '../../../infrastructure/http/dtos';
import { DataBaseUnathorizedError } from '../../../infrastructure/db/errors';
import { ACCOUNT_ROLES } from '../../../domain/const';

@Injectable()
export class CreatePollService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly accountRepository: AccountRepository,
    private readonly pollRepository: PollRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  /**
   * Create a poll.
   *
   * @param sessionId - Client session id.
   * @param createPollDto - Data transfer object containing poll details.
   * @param requestId - The request ID for loggers.
   * @throws NotAdminAccountApiError - User is not admin.
   * @throws InvalidTokenApiError - No user found for the current session.
   */
  async create(
    sessionId: string,
    createPollDto: CreatePollDto,
    requestId?: string,
  ) {
    try {
      this.logger.info(
        `[CreatePollService] [create] - x-request-id: ${requestId}`,
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

      await this.pollRepository.createPoll(createPollDto, uuid, requestId);
    } catch (error) {
      this.logger.error(
        `[CreatePollService] [create] - x-request-id: ${requestId}, error: ${error}`,
      );

      if (error instanceof DataBaseUnathorizedError)
        throw new InvalidTokenApiError();

      throw error;
    }
  }
}
