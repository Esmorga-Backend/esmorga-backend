import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import { DataBaseUnathorizedError } from '../../../infrastructure/db/errors';
import {
  AccountRepository,
  TokensRepository,
} from '../../../infrastructure/db/repositories';
import {
  AccountLoggedDto,
  PairOfTokensDto,
} from '../../../infrastructure/dtos';
import { AccountLoginDto } from '../../../infrastructure/http/dtos';
import {
  validateLoginCredentials,
  getOldestPairOfTokens,
  GenerateTokenPair,
} from '../../../domain/services';
import { InvalidCredentialsLoginApiError } from '../../../domain/errors';

@Injectable()
export class LoginService {
  constructor(
    private readonly generateTokenPair: GenerateTokenPair,
    private readonly accountRepository: AccountRepository,
    private readonly tokensRepository: TokensRepository,
    private configService: ConfigService,
  ) {}

  async login(accountLoginDto: AccountLoginDto): Promise<AccountLoggedDto> {
    try {
      const { email, password } = accountLoginDto;

      const { userProfile, password: userDbPassword } =
        await this.accountRepository.getUserByEmail(email);

      validateLoginCredentials(userDbPassword, password);

      const { uuid } = userProfile;

      const { accessToken, refreshToken } =
        await this.generateTokenPair.generateTokens(uuid);

      const pairOfTokens: PairOfTokensDto[] =
        await this.tokensRepository.getAllTokensByUuid(uuid);

      if (pairOfTokens.length >= this.configService.get('MAX_PAIR_OF_TOKEN')) {
        const oldestPairOfTokenId = getOldestPairOfTokens(pairOfTokens);

        await this.tokensRepository.removeTokensById(oldestPairOfTokenId);
      }

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
      if (error instanceof DataBaseUnathorizedError)
        throw new InvalidCredentialsLoginApiError();

      throw error;
    }
  }
}
