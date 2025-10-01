import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import { plainToInstance } from 'class-transformer';
import {
  AccountRepository,
  TemporalCodeRepository,
} from '../../../infrastructure/db/repositories';
import { TEMPORAL_CODE_TYPE } from '../../../domain/const';
import { DataBaseNotFoundError } from '../../../infrastructure/db/errors';
import { InvalidVerificationCodeApiError } from '../../../domain/errors';
import { AccountLoggedDto } from '../../../infrastructure/dtos';
import { SessionManager } from '../../../domain/services';

@Injectable()
export class ActivateAccountService {
  constructor(
    private readonly logger: PinoLogger,
    private configService: ConfigService,
    private readonly sessionManager: SessionManager,
    private readonly accountRepository: AccountRepository,
    private readonly temporalCodeRepository: TemporalCodeRepository,
  ) {}

  /**
   * Update account status to ACTIVE for the account the verificationCode is related.
   *
   * @param verificationCode - Temporal code related to the user
   * @param requestId - Request identifier for API logger.
   * @returns AccountLoggedDto - Account profile data updated.
   * @throws InvalidVerificationCodeApiError - Error for invalid/expired code.
   */
  async activate(
    verificationCode: string,
    requestId?: string,
  ): Promise<AccountLoggedDto> {
    try {
      this.logger.info(
        `[ActivateAccountService] [activate] - x-request-id: ${requestId}`,
      );

      const { id, email } = await this.temporalCodeRepository.getCode(
        verificationCode,
        TEMPORAL_CODE_TYPE.VERIFICATION,
        requestId,
      );

      const userProfileUpdated =
        await this.accountRepository.activateAccountByEmail(email, requestId);

      const { uuid } = userProfileUpdated;

      const { accessToken, refreshToken } =
        await this.sessionManager.createSession(uuid, requestId);

      const ttl = this.configService.get('ACCESS_TOKEN_TTL');

      const accountLoggedDto: AccountLoggedDto = plainToInstance(
        AccountLoggedDto,
        {
          profile: userProfileUpdated,
          accessToken,
          refreshToken,
          ttl,
        },
        { excludeExtraneousValues: true },
      );

      await this.temporalCodeRepository.removeCodeById(id, requestId);

      return accountLoggedDto;
    } catch (error) {
      this.logger.error(
        `[ActivateAccountService] [activate] - x-request-id: ${requestId}, error ${error}`,
      );

      if (error instanceof DataBaseNotFoundError) {
        throw new InvalidVerificationCodeApiError();
      }

      throw error;
    }
  }
}
