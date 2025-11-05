import { HttpException, Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { DataBaseInternalError, DataBaseNotFoundError } from '../errors';
import { CreatePollDto, VotePollDto } from '../../http/dtos';
import { PollDA } from '../modules/none/poll-da';
import { validateObjectDto } from '../utils';
import { PollDto } from '../../dtos';
import { REQUIRED_DTO_FIELDS } from '../consts';

@Injectable()
export class PollRepository {
  constructor(
    private readonly pollDA: PollDA,
    private readonly logger: PinoLogger,
  ) {}

  /**
   * Store a new poll document.
   *
   * @param createPollDto - Poll data provided.
   * @param requestId - Request identifier for API logger.
   */
  async createPoll(
    createPollDto: CreatePollDto,
    uuid: string,
    requestId?: string,
  ) {
    try {
      this.logger.info(
        `[PollRepository] [createPoll] - x-request-id: ${requestId}`,
      );

      await this.pollDA.create(createPollDto, uuid);
    } catch (error) {
      this.logger.error(
        `[PollRepository] [createPoll] - x-request-id: ${requestId}, error: ${error}`,
      );

      throw new DataBaseInternalError();
    }
  }

  /**
   * Return all polls stored in the DB.
   *
   * @param requestId - Request identifier for API logger.
   * @returns Promise of PollDto array.
   */
  async getPollList(requestId?: string): Promise<PollDto[]> {
    try {
      this.logger.info(
        `[PollRepository] [getPollList] - x-request-id: ${requestId}`,
      );
      const polls = await this.pollDA.find();

      polls.forEach((poll) => {
        validateObjectDto(poll, REQUIRED_DTO_FIELDS.POLLS);
      });
      return polls;
    } catch (error) {
      this.logger.error(
        `[PollRepository] [getPollList] - x-request-id: ${requestId}, error: ${error}`,
      );

      throw new DataBaseInternalError();
    }
  }

  /**
   * Vote on a poll.
   *
   * @param votePollDto - Data transfer object containing poll vote details.
   * @param requestId - Request identifier for API logger.
   * @returns Promise of PollDto array.
   */
  async votePoll(
    votePollDto: VotePollDto,
    uuid: string,
    pollId: string,
    requestId?: string,
  ): Promise<PollDto> {
    try {
      this.logger.info(
        `[PollRepository] [votePoll] - x-request-id: ${requestId}`,
      );
      const poll = await this.pollDA.vote(votePollDto, uuid, pollId);

      if (!poll) {
        throw new DataBaseNotFoundError();
      }

      validateObjectDto(poll, REQUIRED_DTO_FIELDS.POLLS);
      return poll;
    } catch (error) {
      this.logger.error(
        `[PollRepository] [votePoll] - x-request-id: ${requestId}, error: ${error}`,
      );

      if (error.path === '_id') throw new DataBaseNotFoundError();

      if (error instanceof HttpException) throw error;

      throw new DataBaseInternalError();
    }
  }
}
