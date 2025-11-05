import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import {
  AccountRepository,
  PollRepository,
  SessionRepository,
} from '../../../infrastructure/db/repositories';
import { InvalidTokenApiError } from '../../../domain/errors';
import {
  DataBaseNotFoundError,
  DataBaseUnathorizedError,
} from '../../../infrastructure/db/errors';
import { VotePollDto } from '../../../infrastructure/http/dtos';
import { PollDto } from '../../../infrastructure/dtos';

@Injectable()
export class VotePollService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly accountRepository: AccountRepository,
    private readonly pollRepository: PollRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  /**
   * Vote on a poll.
   *
   * @param sessionId - Client session id.
   * @param votePollDto - Data transfer object containing poll vote details.
   * @param requestId - The request ID for loggers.
   * @throws InvalidTokenApiError - No user found for the current session.
   */
  async vote(
    sessionId: string,
    votePollDto: VotePollDto,
    pollId: string,
    requestId?: string,
  ): Promise<PollDto> {
    try {
      this.logger.info(`[VotePollService] [vote] - x-request-id: ${requestId}`);

      const { uuid } = await this.sessionRepository.getBySessionId(
        sessionId,
        requestId,
      );

      const poll = await this.pollRepository.votePoll(
        votePollDto,
        uuid,
        pollId,
        requestId,
      );

      return poll;
    } catch (error) {
      this.logger.error(
        `[VotePollService] [vote] - x-request-id: ${requestId}, error: ${error}`,
      );

      if (error instanceof DataBaseUnathorizedError)
        throw new InvalidTokenApiError();

      if (error instanceof DataBaseNotFoundError)
        // ! Ver que error poner
        // throw new InvalidPollIdApiError();

        throw error;
    }
  }
}
