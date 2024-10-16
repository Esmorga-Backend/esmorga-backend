import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { plainToClass } from 'class-transformer';
import { PinoLogger } from 'nestjs-pino';
import { MongoRepository } from './mongo.repository';
import { Session as SessionSchema } from '../schema';
import { DataBaseInternalError, DataBaseUnathorizedError } from '../errors';
import { SessionDto } from '../../dtos';
import { PairOfTokensDto } from '../../dtos/pair-of-tokens.dto';

@Injectable()
export class TokensRepository extends MongoRepository<SessionSchema> {
  constructor(
    @InjectModel(SessionSchema.name)
    private sessionModel: Model<SessionSchema>,
    private readonly logger: PinoLogger,
  ) {
    super(sessionModel);
  }

  /**
   * Store a new pair of tokens for the user requested them.
   *
   * @param uuid - User identifier.
   * @param sessionId - Client session id to be saved.
   * @param requestId - Request identifier for API logger
   */
  async saveSession(uuid: string, sessionId: string, requestId?: string) {
    try {
      this.logger.info(
        `[TokensRepository] [saveSession] - x-request-id: ${requestId}, uuid: ${uuid}`,
      );

      const sessionDoc = new this.sessionModel({
        uuid,
        sessionId,
      });

      await this.save(sessionDoc);
    } catch (error) {
      this.logger.error(
        `[TokensRepository] [saveSession] - x-request-id: ${requestId}, error: ${error}`,
      );

      throw new DataBaseInternalError();
    }
  }

  /**
   * Get all tokens generated for the user with that uuid/id.
   *
   * @param uuid - User identifier.
   * @param requestId - Request identifier for API logger.
   * @returns PairOfTokensDto[] - Array with tokens pairs.
   */
  async getAllTokensByUuid(
    uuid: string,
    requestId?: string,
  ): Promise<SessionDto[]> {
    try {
      this.logger.info(
        `[TokensRepository] [getAllTokensByUuid] - x-request-id: ${requestId}, uuid: ${uuid}`,
      );

      const tokensData = await this.findByUuid(uuid);

      const pairOfTokens: SessionDto[] = tokensData.map((data) => {
        return plainToClass(SessionDto, data, {
          excludeExtraneousValues: true,
        });
      });

      return pairOfTokens;
    } catch (error) {
      this.logger.error(
        `[TokensRepository] [getAllTokensByUuid] - x-request-id: ${requestId}, error: ${error}`,
      );

      throw new DataBaseInternalError();
    }
  }

  /**
   * @deprecated Get pair of tokens with user id related to the refresh provided.
   *
   * @param refreshToken - Refresh token stored.
   * @param requestId - Request identifier for API logger.
   * @returns PairOfTokensDto - Pair of tokens and user id.
   */
  async getPairOfTokensByRefreshToken(
    refreshToken: string,
    requestId?: string,
  ): Promise<PairOfTokensDto> {
    try {
      this.logger.info(
        `[TokensRepository] [getPairOfTokensByRefreshToken] - x-request-id:${requestId}, refreshToken ${refreshToken}`,
      );

      const tokenData = await this.findOneByRefreshToken(refreshToken);

      if (!tokenData) throw new DataBaseUnathorizedError();

      const pairOfTokens = plainToClass(PairOfTokensDto, tokenData, {
        excludeExtraneousValues: true,
      });

      return pairOfTokens;
    } catch (error) {
      this.logger.error(
        `[TokensRepository] [getPairOfTokensByRefreshToken] - x-request-id: ${requestId}, error: ${error}`,
      );

      if (error instanceof HttpException) throw error;

      throw new DataBaseInternalError();
    }
  }

  /**
   * Get sessions with user id related to the client session id provided.
   *
   * @param sessionId - Client session id stored.
   * @param requestId - Request identifier for API logger.
   * @returns PairOfTokensDto - Pair of tokens and user id.
   */
  async getBySessionId(
    sessionId: string,
    requestId?: string,
  ): Promise<SessionDto> {
    try {
      this.logger.info(
        `[TokensRepository] [getBySessionId] - x-request-id:${requestId}, sessionId ${sessionId}`,
      );

      const sessionData = await this.findOneBySessionId(sessionId);

      if (!sessionData) throw new DataBaseUnathorizedError();

      const pairOfTokens = plainToClass(SessionDto, sessionData, {
        excludeExtraneousValues: true,
      });

      return pairOfTokens;
    } catch (error) {
      this.logger.error(
        `[TokensRepository] [getBySessionId] - x-request-id: ${requestId}, error: ${error}`,
      );

      if (error instanceof HttpException) throw error;

      throw new DataBaseInternalError();
    }
  }

  /**
   * Remove pair of tokens document by document's ID.
   * @param id - Document identifier.
   * @param requestId - Request identifier for API logger.
   */
  async removeTokensById(id: string, requestId?: string) {
    try {
      this.logger.info(
        `[TokensRepository] [removeTokensById] - x-request-id: ${requestId}, tokensId: ${id}`,
      );

      await this.removeById(id);
    } catch (error) {
      this.logger.error(
        `[TokensRepository] [removeTokensById] - x-request-id: ${requestId}, error: ${error}`,
      );

      throw new DataBaseInternalError();
    }
  }
}
