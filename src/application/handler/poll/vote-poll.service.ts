import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import {
  AccountRepository,
  PollRepository,
  SessionRepository,
} from '../../../infrastructure/db/repositories';
import {
  InvalidMultipleSelectionApiError,
  InvalidTokenApiError,
  NotFoundApiError,
  VoteClosedApiError,
} from '../../../domain/errors';
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

      const poll = await this.pollRepository.findOneByPollId(pollId, requestId);

      if (poll.voteDeadline < new Date()) {
        throw new VoteClosedApiError();
      }

      const { selectedOptions } = votePollDto;

      if (poll.isMultipleChoice === false && selectedOptions.length > 1) {
        throw new InvalidMultipleSelectionApiError();
      }

      const availableOptions = poll.options.map((option) => option.optionId);

      if (
        !selectedOptions.every((optionId) =>
          availableOptions.includes(optionId),
        )
      ) {
        throw new NotFoundApiError('optionId');
      }

      const updatedPoll = await this.pollRepository.votePoll(
        selectedOptions,
        uuid,
        pollId,
        requestId,
      );

      const userSelectedOptions: string[] = [];

      updatedPoll.options = (updatedPoll.options ?? []).map((option) => {
        const votesForOption = option.votes ?? [];

        if (votesForOption.includes(uuid)) {
          userSelectedOptions.push(option.optionId);
        }

        return {
          optionId: option.optionId,
          option: option.option,
          voteCount: votesForOption.length,
        };
      });

      return {
        ...updatedPoll,
        userSelectedOptions,
      };

      return updatedPoll;
    } catch (error) {
      this.logger.error(
        `[VotePollService] [vote] - x-request-id: ${requestId}, error: ${error}`,
      );

      if (error instanceof DataBaseUnathorizedError)
        throw new InvalidTokenApiError();

      if (error instanceof DataBaseNotFoundError)
        throw new NotFoundApiError('pollId');

      throw error;
    }
  }
}
