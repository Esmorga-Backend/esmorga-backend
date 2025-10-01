import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';

import { SessionRepository } from '../../infrastructure/db/repositories';
import { SessionDto } from '../../infrastructure/dtos';

import { getOldestSession } from './get-oldest-session';
import { SessionGenerator } from './session-generator';

@Injectable()
export class SessionManager {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: PinoLogger,
    private readonly sessionGenerator: SessionGenerator,
    private readonly sessionRepository: SessionRepository,
  ) {}

  async createSession(
    uuid: string,
    requestId?: string,
    limitTokens: boolean = false,
  ) {
    try {
      this.logger.info(
        `[SessionManager] [createSession] - x-request-id:${requestId}, uuid ${uuid}`,
      );

      const session = await this.sessionGenerator.generateSession(uuid);

      if (limitTokens) {
        await this.removeExtraTokens(uuid, requestId);
      }

      await this.sessionRepository.saveSession(
        uuid,
        session.sessionId,
        session.refreshTokenId,
        requestId,
      );

      return session;
    } catch (error) {
      this.logger.error(
        `[SessionManager] [createSession] - x-request-id:${requestId}, error ${error}`,
      );

      throw error;
    }
  }

  async removeExtraTokens(uuid: string, requestId?: string) {
    try {
      this.logger.info(
        `[SessionManager] [removeExtraTokens] - x-request-id:${requestId}, uuid ${uuid}`,
      );

      const pairOfTokens: SessionDto[] =
        await this.sessionRepository.getAllTokensByUuid(uuid, requestId);

      const maxTokens = this.configService.get('MAX_PAIR_OF_TOKEN');

      if (pairOfTokens.length < maxTokens) {
        return;
      }

      const oldestPairOfTokenId = getOldestSession(pairOfTokens);

      await this.sessionRepository.removeTokensById(
        oldestPairOfTokenId,
        requestId,
      );
    } catch (error) {
      this.logger.error(
        `[SessionManager] [removeExtraTokens] - x-request-id:${requestId}, error ${error}`,
      );

      throw error;
    }
  }
}
