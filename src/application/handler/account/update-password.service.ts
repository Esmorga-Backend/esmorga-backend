import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { plainToInstance } from 'class-transformer';
import {
  AccountRepository,
  SessionRepository,
} from '../../../infrastructure/db/repositories';
import {
  encodeValue,
  SessionGenerator,
  verifyHashedValue,
} from '../../../domain/services';
import { UpdatePasswordDto } from '../../../infrastructure/http/dtos';
import { NewPairOfTokensDto } from '../../../infrastructure/dtos';
import {
  InvalidCredentialsRefreshApiError,
  InvalidCurrentPasswordError,
  InvalidSamePasswordApiError,
} from '../../../domain/errors';
import {
  DataBaseUnauthorizedError,
  DataBaseUnprocesableContentError,
} from '../../../infrastructure/db/errors';

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

      const session = await this.sessionRepository.getBySessionId(
        sessionId,
        requestId,
      );

      if (!session?.uuid) throw new InvalidCredentialsRefreshApiError();

      const profilePasswordHashed =
        await this.accountRepository.getCurrentPasswordByUuid(
          session.uuid,
          requestId,
        );

      const doPasswordsMatch = await verifyHashedValue(
        profilePasswordHashed,
        currentPassword,
      );

      if (!doPasswordsMatch) throw new DataBaseUnprocesableContentError();

      const hashedPassword = await encodeValue(newPassword);

      await this.accountRepository.updateAccountPassword(
        session.uuid,
        hashedPassword,
        requestId,
      );

      await this.sessionRepository.removeAllSessionsByUuid(
        session.uuid,
        sessionId,
        requestId,
      );

      const {
        accessToken,
        refreshToken,
        refreshTokenId: newRefreshTokenId,
      } = await this.sessionGenerator.generateTokens(session.uuid, sessionId);

      await this.sessionRepository.updateRefreshTokenId(
        sessionId,
        newRefreshTokenId,
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

      if (error instanceof DataBaseUnauthorizedError) {
        throw new InvalidCredentialsRefreshApiError();
      }

      throw error;
    }
  }
}
