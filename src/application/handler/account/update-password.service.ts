import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { plainToInstance } from 'class-transformer';
import {
  AccountRepository,
  SessionRepository,
} from '../../../infrastructure/db/repositories';
import { UpdatePasswordDto } from '../../../infrastructure/http/dtos';
import { NewPairOfTokensDto } from '../../../infrastructure/dtos';
import { SessionGenerator } from '../../../domain/services';
import { DataBaseUnprocesableContentError } from '../../../infrastructure/db/errors';
import {
  InvalidCurrentPasswordError,
  InvalidSamePasswordApiError,
} from '../../../domain/errors';

@Injectable()
export class UpdatePasswordService {
  constructor(
    private readonly logger: PinoLogger,
    private configService: ConfigService,
    private readonly accountRepository: AccountRepository,
    private readonly sessionRepository: SessionRepository,
    private readonly sessionGenerator: SessionGenerator,
  ) {}

  /**
   * Update account password.
   *
   * @param sessionId - Client session id.
   * @param updatePasswordDto - DTO that contains the current password and new password.
   * @param requestId - Request identifier for API logger.
   * @throws InvalidSamePasswordApiError - Error for invalid password.
   */
  async updatePassword(
    sessionId: string,
    updatePasswordDto: UpdatePasswordDto,
    requestId?: string,
  ): Promise<NewPairOfTokensDto> {
    try {
      this.logger.info(
        `[UpdatePasswordService] [updatePassword] - x-request-id: ${requestId}`,
      );

      const { currentPassword, newPassword } = updatePasswordDto;

      if (currentPassword === newPassword)
        throw new InvalidSamePasswordApiError();

      const { uuid } = await this.sessionRepository.getBySessionId(
        sessionId,
        requestId,
      );

      await this.accountRepository.updateAccountPassword(
        uuid,
        currentPassword,
        newPassword,
        requestId,
      );

      await this.sessionRepository.removeAllSessionsByUuid(
        uuid,
        sessionId,
        requestId,
      );

      const {
        accessToken,
        refreshToken,
        sessionId: newSessionId,
        refreshTokenId,
      } = await this.sessionGenerator.generateSession(uuid);

      await this.sessionRepository.saveSession(
        uuid,
        newSessionId,
        refreshTokenId,
        requestId,
      );

      const ttl = this.configService.get('ACCESS_TOKEN_TTL');

      const newPairOfTokens = plainToInstance(
        NewPairOfTokensDto,
        {
          accessToken,
          refreshToken,
          ttl,
        },
        { excludeExtraneousValues: true },
      );

      return newPairOfTokens;
    } catch (error) {
      this.logger.error(
        `[UpdatePasswordService] [updatePassword] - x-request-id: ${requestId}, error: ${error}`,
      );

      if (error instanceof DataBaseUnprocesableContentError) {
        throw new InvalidCurrentPasswordError();
      }

      throw error;
    }
  }
}
