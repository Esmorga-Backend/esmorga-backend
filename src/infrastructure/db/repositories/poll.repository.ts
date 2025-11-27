import { HttpException, Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import {
  DataBaseBadRequestError,
  DataBaseInternalError,
  DataBaseNotFoundError,
} from '../errors';
import { CreatePollDto } from '../../http/dtos';
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
   * Find a poll by ID, validate the data stores and return it following business schema.
   *
   * @param pollId - Poll identifier.
   * @param requestId - Request identifier.
   * @returns PollDto - Poll object following business schema after validate DB document.
   * @throws DataBaseBadRequestError - ID malformed or not found.
   */
  async findOneByPollId(pollId: string, requestId?: string): Promise<PollDto> {
    try {
      this.logger.info(
        `[PollRepository] [findOneByPollId] - x-request-id: ${requestId}, pollId: ${pollId} `,
      );
      const poll = await this.pollDA.findOneById(pollId);

      if (!poll) throw new DataBaseNotFoundError();

      validateObjectDto(poll, REQUIRED_DTO_FIELDS.POLLS);
      return poll;
    } catch (error) {
      this.logger.error(
        `[PollRepository] [findOneByPollId] - x-request-id: ${requestId}, error: ${error}`,
      );

      if (error.path === '_id') throw new DataBaseBadRequestError();

      if (error instanceof HttpException) throw error;

      throw new DataBaseInternalError();
    }
  }

  /**
   * Remove user from all polls.
   *
   * @param uuid - User identifier.
   * @param requestId - Request identifier for API logger.
   */
  async removeUserFromAllPolls(uuid: string, requestId?: string) {
    try {
      this.logger.info(
        `[PollRepository] [removeUserFromAllPolls] - x-request-id: ${requestId}, uuid: ${uuid} `,
      );
      await this.pollDA.removeUserFromAllPolls(uuid);
    } catch (error) {
      this.logger.error(
        `[PollRepository] [removeUserFromAllPolls] - x-request-id: ${requestId}, error: ${error}`,
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
    selectedOptions: string[],
    uuid: string,
    pollId: string,
    requestId?: string,
  ): Promise<PollDto> {
    try {
      this.logger.info(
        `[PollRepository] [votePoll] - x-request-id: ${requestId}`,
      );

      const poll = await this.pollDA.vote(selectedOptions, uuid, pollId);

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
