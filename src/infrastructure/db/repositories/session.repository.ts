import { HttpException, Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { DataBaseInternalError, DataBaseUnathorizedError } from '../errors';
import { SessionDto } from '../../dtos';
import { SessionDA } from '../modules/none/session-da';

@Injectable()
export class SessionRepository {
  constructor(
    private sessionDA: SessionDA,
    private readonly logger: PinoLogger,
  ) {}

  /**
   * Store a new pair of tokens for the user requested them.
   *
   * @param uuid - User id.
   * @param sessionId - Client session id to be saved.
   * @param refreshTokenId - Refresh token id.
   * @param requestId - Request id for API logger
   */
  async saveSession(
    uuid: string,
    sessionId: string,
    refreshTokenId: string,
    requestId?: string,
  ) {
    try {
      this.logger.info(
        `[SessionRepository] [saveSession] - x-request-id: ${requestId}, uuid: ${uuid}`,
      );
      await this.sessionDA.create(uuid, sessionId, refreshTokenId);
    } catch (error) {
      this.logger.error(
        `[SessionRepository] [saveSession] - x-request-id: ${requestId}, error: ${error}`,
      );

      throw new DataBaseInternalError();
    }
  }

  /**
   * Get all tokens generated for the user with that uuid/id.
   *
   * @param uuid - User id.
   * @param requestId - Request id for API logger.
   * @returns PairOfTokensDto[] - Array with tokens pairs.
   */
  async getAllTokensByUuid(
    uuid: string,
    requestId?: string,
  ): Promise<SessionDto[]> {
    try {
      this.logger.info(
        `[SessionRepository] [getAllTokensByUuid] - x-request-id: ${requestId}, uuid: ${uuid}`,
      );
      return await this.sessionDA.findByUuid(uuid);
    } catch (error) {
      this.logger.error(
        `[SessionRepository] [getAllTokensByUuid] - x-request-id: ${requestId}, error: ${error}`,
      );

      throw new DataBaseInternalError();
    }
  }

  /**
   * Get sessions with user id related to the client session id provided.
   *
   * @param sessionId - Client session id stored.
   * @param requestId - Request id for API logger.
   * @returns PairOfTokensDto - Pair of tokens and user id.
   */
  async getBySessionId(
    sessionId: string,
    requestId?: string,
  ): Promise<SessionDto> {
    try {
      this.logger.info(
        `[SessionRepository] [getBySessionId] - x-request-id:${requestId}, sessionId ${sessionId}`,
      );
      const sessionData = await this.sessionDA.findOneBySessionId(sessionId);
      if (!sessionData) throw new DataBaseUnathorizedError();
      return sessionData;
    } catch (error) {
      this.logger.error(
        `[SessionRepository] [getBySessionId] - x-request-id: ${requestId}, error: ${error}`,
      );

      if (error instanceof HttpException) throw error;

      throw new DataBaseInternalError();
    }
  }

  /**
   * Remove pair of tokens document by document's ID.
   * @param id - Document id.
   * @param requestId - Request id for API logger.
   */
  async removeTokensById(id: string, requestId?: string) {
    try {
      this.logger.info(
        `[SessionRepository] [removeTokensById] - x-request-id: ${requestId}, tokensId: ${id}`,
      );
      await this.sessionDA.removeById(id);
    } catch (error) {
      this.logger.error(
        `[SessionRepository] [removeTokensById] - x-request-id: ${requestId}, error: ${error}`,
      );
      throw new DataBaseInternalError();
    }
  }

  /**
   * Remove all pair of token documents related to uuid provided except the current session.
   * @param uuid - User id.
   * @param sessionId - Session id.
   * @param requestId - Request id for API logger.
   */
  async removeAllSessionsByUuid(
    uuid: string,
    sessionId: string,
    requestId?: string,
  ) {
    try {
      this.logger.info(
        `[SessionRepository] [removeAllSessionsByUuid] - x-request-id: ${requestId}, uuid: ${uuid}`,
      );
      await this.sessionDA.removeAllByUuid(uuid, sessionId);
    } catch (error) {
      this.logger.error(
        `[SessionRepository] [removeAllSessionsByUuid] - x-request-id: ${requestId}, error: ${error}`,
      );
      throw new DataBaseInternalError();
    }
  }

  /**
   * Remove session document by session ID.
   * @param sessionId - Session id.
   * @param requestId - Request id for API logger.
   */
  async removeTokensBySessionId(sessionId: string, requestId?: string) {
    try {
      this.logger.info(
        `[SessionRepository] [removeTokensBySessionId] - x-request-id: ${requestId}, sessionId: ${sessionId}`,
      );
      await this.sessionDA.removeBySessionId(sessionId);
    } catch (error) {
      this.logger.error(
        `[SessionRepository] [removeTokensBySessionId] - x-request-id: ${requestId}, error: ${error}`,
      );
      throw new DataBaseInternalError();
    }
  }

  /**
   * Update refresh token ID session document by session ID.
   * @param sessionId - Session id.
   * @param refreshTokenId - Refresh token id.
   * @param requestId - Request id for API logger.
   */
  async updateRefreshTokenId(
    sessionId: string,
    refreshTokenId: string,
    requestId?: string,
  ) {
    try {
      this.logger.info(
        `[SessionRepository] [updateRefreshTokenId] - x-request-id: ${requestId}, sessionId: ${sessionId}, refreshTokenId: ${refreshTokenId}`,
      );

      await this.sessionDA.updateById(sessionId, { refreshTokenId });
    } catch (error) {
      this.logger.error(
        `[SessionRepository] [updateRefreshTokenId] - x-request-id: ${requestId}, error: ${error}`,
      );
      throw new DataBaseInternalError();
    }
  }
}
