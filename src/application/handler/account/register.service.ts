import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import { PinoLogger } from 'nestjs-pino';
import { AccountRegisterDto } from '../../../infrastructure/http/dtos';
import { GenerateTokenPair, encodeValue } from '../../../domain/services';
import {
  AccountRepository,
  TokensRepository,
} from '../../../infrastructure/db/repositories';
import { DataBaseConflictError } from '../../../infrastructure/db/errors';
import { EmailConflictApiError } from '../../../domain/errors';
import { AccountLoggedDto } from '../../../infrastructure/dtos';

@Injectable()
export class RegisterService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly generateTokenPair: GenerateTokenPair,
    private readonly accountRepository: AccountRepository,
    private readonly tokensRepository: TokensRepository,
    private configService: ConfigService,
  ) {}

  async register(
    accountRegisterDto: AccountRegisterDto,
    requestId?: string,
  ): Promise<AccountLoggedDto> {
    try {
      this.logger.info(
        `[RegisterService] [register] - x-request-id:${requestId}, email ${accountRegisterDto.email}`,
      );
      const hashPassword = encodeValue(accountRegisterDto.password);

      accountRegisterDto.password = hashPassword;

      await this.accountRepository.saveUser(accountRegisterDto, requestId);

      const { userProfile } = await this.accountRepository.getUserByEmail(
        accountRegisterDto.email,
        requestId,
      );

      const { uuid } = userProfile;

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
          profile: userProfile,
          accessToken,
          refreshToken,
          ttl,
        },
        { excludeExtraneousValues: true },
      );

      return accountLoggedDto;
    } catch (error) {
      this.logger.error(
        `[RegisterService] [register] - x-request-id:${requestId}, error ${error}`,
      );

      if (error instanceof DataBaseConflictError)
        throw new EmailConflictApiError();

      throw error;
    }
  }
}
