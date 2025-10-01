import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { PinoLogger } from 'nestjs-pino';

import {
  DataBaseBlockedError,
  DataBaseForbiddenError,
  DataBaseUnathorizedError,
} from '../../../infrastructure/db/errors';
import {
  AccountRepository,
  LoginAttemptsRepository,
} from '../../../infrastructure/db/repositories';
import { AccountLoggedDto } from '../../../infrastructure/dtos';
import { AccountLoginDto } from '../../../infrastructure/http/dtos';
import {
  ValidateLoginCredentialsService,
  SessionManager,
} from '../../../domain/services';
import {
  BlockedUserApiError,
  InvalidCredentialsLoginApiError,
  UnverifiedUserApiError,
} from '../../../domain/errors';
import { PasswordSymbol } from '../../../infrastructure/db/modules/none/user-da';

@Injectable()
export class LoginService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly accountRepository: AccountRepository,
    private readonly loginAttemptsRepository: LoginAttemptsRepository,
    private readonly sessionManager: SessionManager,
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

      const userProfile = await this.accountRepository.getUserByEmail(
        email,
        requestId,
      );
      if (!userProfile) {
        throw new DataBaseUnathorizedError();
      }
      const { expireBlockedAt, uuid, role } = userProfile;
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
        userProfile[PasswordSymbol],
        password,
        status,
        requestId,
      );

      await this.loginAttemptsRepository.removeLoginAttempts(uuid, requestId);

      const { accessToken, refreshToken } =
        await this.sessionManager.createSession(uuid, requestId, true);

      const ttl = this.configService.get('ACCESS_TOKEN_TTL');

      const accountLoggedDto: AccountLoggedDto = plainToInstance(
        AccountLoggedDto,
        {
          profile: { ...userProfile, role },
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
