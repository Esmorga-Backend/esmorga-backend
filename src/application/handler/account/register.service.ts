import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import { AccountRegisterDto } from '../../../infrastructure/http/dtos';
import { GenerateTokenPair } from '../../../domain/services';
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
    private readonly generateTokenPair: GenerateTokenPair,
    private readonly accountRepository: AccountRepository,
    private readonly tokensRepository: TokensRepository,
    private configService: ConfigService,
  ) {}

  async register(
    accountRegisterDto: AccountRegisterDto,
  ): Promise<AccountLoggedDto> {
    try {
      await this.accountRepository.saveUser(accountRegisterDto);

      const { userProfile } = await this.accountRepository.getUserByEmail(
        accountRegisterDto.email,
      );

      const { uuid } = userProfile;

      const { accessToken, refreshToken } =
        await this.generateTokenPair.generateTokens(uuid);

      await this.tokensRepository.saveTokens(uuid, accessToken, refreshToken);

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
      if (error instanceof DataBaseConflictError)
        throw new EmailConflictApiError();

      throw error;
    }
  }
}
