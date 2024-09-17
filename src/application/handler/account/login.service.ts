import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import { PinoLogger } from 'nestjs-pino';
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
    private readonly logger: PinoLogger,
    private readonly generateTokenPair: GenerateTokenPair,
    private readonly accountRepository: AccountRepository,
    private readonly tokensRepository: TokensRepository,
    private configService: ConfigService,
  ) {}

  /**
   * Verify credentials provided match with an user stored in the DB and provided new pair of tokens with profile data.
   *
   * @param accountLoginDto - Account email and password.
   * @param requestId - Request idenfier.
   * @returns AccountLoggedDto - Object with new pair of tokens and profile data.
   * @throws InvalidCredentialsLoginApiError - Email and password combination do not match with the DB data.
   */
  async login(
    accountLoginDto: AccountLoginDto,
    requestId?: string,
  ): Promise<AccountLoggedDto> {
    try {
      this.logger.info(
        `[LoginService] [login] - x-request-id:${requestId}, email ${accountLoginDto.email}`,
      );

      const { email, password } = accountLoginDto;

      const { userProfile, password: userDbPassword } =
        await this.accountRepository.getUserByEmail(email, requestId);

      await validateLoginCredentials(userDbPassword, password);

      const { uuid } = userProfile;

      const { accessToken, refreshToken } =
        await this.generateTokenPair.generateTokens(uuid);

      const pairOfTokens: PairOfTokensDto[] =
        await this.tokensRepository.getAllTokensByUuid(uuid, requestId);

      if (pairOfTokens.length >= this.configService.get('MAX_PAIR_OF_TOKEN')) {
        const oldestPairOfTokenId = getOldestPairOfTokens(pairOfTokens);

        await this.tokensRepository.removeTokensById(
          oldestPairOfTokenId,
          requestId,
        );
      }

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
        `[LoginService] [login] - x-request-id:${requestId}, error ${error}`,
      );

      if (error instanceof DataBaseUnathorizedError)
        throw new InvalidCredentialsLoginApiError();

      throw error;
    }
  }
}
