import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import { plainToClass } from 'class-transformer';
import {
  TokensRepository,
  AccountRepository,
  TemporalCodeRepository,
} from '../../../infrastructure/db/repositories';
import { TEMPORAL_CODE_TYPE } from '../../../domain/const';
import { DataBaseNotFoundError } from '../../../infrastructure/db/errors';
import { InvalidVerificationCodeApiError } from '../../../domain/errors';
import { AccountLoggedDto } from '../../../infrastructure/dtos';
import { GenerateTokenPair } from '../../../domain/services';

@Injectable()
export class ActivateAccountService {
  constructor(
    private readonly logger: PinoLogger,
    private configService: ConfigService,
    private readonly generateTokenPair: GenerateTokenPair,
    private readonly tokensRepository: TokensRepository,
    private readonly accountRepository: AccountRepository,
    private readonly temporalCodeRepository: TemporalCodeRepository,
  ) {}

  async activate(
    verificationCode: string,
    requestId?: string,
  ): Promise<AccountLoggedDto> {
    try {
      this.logger.info(
        `[ActivateAccountService] [activate] - x-request-id: ${requestId}`,
      );

      const { email } = await this.temporalCodeRepository.getCode(
        verificationCode,
        TEMPORAL_CODE_TYPE.VERIFICATION,
        requestId,
      );

      const userProfileUpdated =
        await this.accountRepository.activateAccountByEmail(email, requestId);

      const { uuid } = userProfileUpdated;

      const { accessToken, refreshToken } =
        await this.generateTokenPair.generateTokens(uuid);

      await this.tokensRepository.saveTokens(
        uuid,
        accessToken,
        refreshToken,
        requestId,
      );

      const ttl = this.configService.get('ACCESS_TOKEN_TTL');

      const accountLoggedDto: AccountLoggedDto = plainToClass(
        AccountLoggedDto,
        {
          profile: userProfileUpdated,
          accessToken,
          refreshToken,
          ttl,
        },
        { excludeExtraneousValues: true },
      );

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
