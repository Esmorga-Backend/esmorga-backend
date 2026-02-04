import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import {
  PollRepository,
  SessionRepository,
} from '../../../infrastructure/db/repositories';
import { filterAvailablePolls } from '../../../domain/services';
import { PollDto } from '../../../infrastructure/dtos';
import { PollListDto } from '../../../infrastructure/dtos/poll-list.dto';
import { DataBaseUnauthorizedError } from '../../../infrastructure/db/errors';
import { InvalidTokenApiError } from '../../../domain/errors';

@Injectable()
export class GetPollListService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly pollRepository: PollRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  /**
   * Provide a list of available polls and the counter of them.
   *
   * @returns - Object containing the total number of available polls and the list of available polls.
   */
  async find(sessionId: string, requestId?: string): Promise<PollListDto> {
    try {
      this.logger.info(
        `[GetPollListService] [find] - x-request-id: ${requestId}`,
      );

      let userUuid: string;

      if (sessionId) {
        const { uuid } = await this.sessionRepository.getBySessionId(
          sessionId,
          requestId,
        );
        userUuid = uuid;
      }

      const polls: PollDto[] =
        (await this.pollRepository.getPollList(requestId)) ?? [];

      const availablePolls = filterAvailablePolls(polls);

      const updatedPolls = availablePolls.map((poll) => {
        const userSelectedOptions: string[] = [];

        const options = (poll.options ?? []).map((option) => {
          const votesForOption = option.votes ?? [];

          if (votesForOption.includes(userUuid)) {
            userSelectedOptions.push(option.optionId);
          }

          return {
            optionId: option.optionId,
            option: option.option,
            voteCount: votesForOption.length,
          };
        });

        return {
          ...poll,
          options,
          userSelectedOptions,
        };
      });

      return {
        totalPolls: updatedPolls.length,
        polls: updatedPolls,
      };
    } catch (error) {
      this.logger.error(
        `[GetPollListService] [find] - x-request-id: ${requestId}, error: ${error}`,
      );

      if (error instanceof DataBaseUnauthorizedError)
        throw new InvalidTokenApiError();

      throw error;
    }
  }
}
