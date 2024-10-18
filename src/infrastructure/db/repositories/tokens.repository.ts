import { HttpException, Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { DataBaseInternalError, DataBaseUnathorizedError } from '../errors';
import { SessionDto } from '../../dtos';
import { SessionDA } from '../modules/none/session-da';
import { PairOfTokensDto } from '../../dtos/pair-of-tokens.dto';
import { TokensDA } from '../modules/none/tokens-da';

@Injectable()
export class TokensRepository {
  constructor(
    private sessionDA: SessionDA,
    private tokensDA: TokensDA,
    private readonly logger: PinoLogger,
  ) {}

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
      await this.sessionDA.create(uuid, sessionId);
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
      return await this.sessionDA.findByUuid(uuid);
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
      const pairOfTokens =
        await this.tokensDA.findOneByRefreshToken(refreshToken);
      if (!pairOfTokens) throw new DataBaseUnathorizedError();
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
      const sessionData = await this.sessionDA.findOneBySessionId(sessionId);
      if (!sessionData) throw new DataBaseUnathorizedError();
      return sessionData;
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
      await this.sessionDA.removeById(id);
    } catch (error) {
      this.logger.error(
        `[TokensRepository] [removeTokensById] - x-request-id: ${requestId}, error: ${error}`,
      );
      throw new DataBaseInternalError();
    }
  }
}
