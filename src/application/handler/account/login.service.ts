import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import { PinoLogger } from 'nestjs-pino';

import {
  DataBaseBlockedError,
  DataBaseForbiddenError,
  DataBaseUnathorizedError,
} from '../../../infrastructure/db/errors';
import {
  AccountRepository,
  TokensRepository,
  LoginAttemptsRepository,
} from '../../../infrastructure/db/repositories';
import {
  AccountLoggedDto,
  PairOfTokensDto,
} from '../../../infrastructure/dtos';
import { AccountLoginDto } from '../../../infrastructure/http/dtos';
import {
  ValidateLoginCredentialsService,
  getOldestPairOfTokens,
  GenerateTokenPair,
} from '../../../domain/services';
import {
  BlockedUserApiError,
  InvalidCredentialsLoginApiError,
  UnverifiedUserApiError,
} from '../../../domain/errors';

@Injectable()
export class LoginService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly generateTokenPair: GenerateTokenPair,
    private readonly accountRepository: AccountRepository,
    private readonly loginAttemptsRepository: LoginAttemptsRepository,
    private readonly tokensRepository: TokensRepository,
    private readonly validateLoginCredentialsService: ValidateLoginCredentialsService,
    private configService: ConfigService,
  ) {}

  /**
   * Verify credentials provided match with an user stored in the DB and provided new pair of tokens with profile data.
   *
   * @param accountLoginDto - Account email and password.
   * @param requestId - Request idenfier.
   * @returns AccountLoggedDto - Object with new pair of tokens and profile data.
   * @throws BlockedUserApiError - The user status account is BLOCKED in the DB data.
   * @throws InvalidCredentialsLoginApiError - Email and password combination do not match with the DB data.
   * @throws UnverifiedUserApiError - The user status account is UNVERIFIED in the DB data.
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

      const { expireBlockedAt, uuid } = userProfile;
      let { status } = userProfile;

      const currentDate = new Date();

      if (expireBlockedAt && currentDate >= expireBlockedAt) {
        status = await this.accountRepository.unblockAccountByEmail(
          email,
          requestId,
        );
      }

      await this.validateLoginCredentialsService.validateLoginCredentials(
        uuid,
        userDbPassword,
        password,
        status,
        requestId,
      );

      await this.loginAttemptsRepository.removeLoginAttempts(uuid, requestId);

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

      if (error instanceof DataBaseBlockedError)
        throw new BlockedUserApiError();

      if (error instanceof DataBaseForbiddenError)
        throw new UnverifiedUserApiError();

      if (error instanceof DataBaseUnathorizedError)
        throw new InvalidCredentialsLoginApiError();

      throw error;
    }
  }
}
