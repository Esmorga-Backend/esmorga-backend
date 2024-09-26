import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import {
  AccountRepository,
  LoginAttemptsRepository,
} from '../../infrastructure/db/repositories';
import {
  BlockedUserApiError,
  InvalidCredentialsLoginApiError,
} from '../errors';

@Injectable()
export class ValidateLoginCredentialsService {
  constructor(
    private configService: ConfigService,
    private readonly accountRepository: AccountRepository,
    private readonly loginAttemptsRepository: LoginAttemptsRepository,
  ) {}
  /**
   * Validate if request password match with user password store in the db.
   * If the password doesn't match, it increments the login attempts.
   * If the login attempts is 5 the account is blocked.
   *
   * @param uuid - User identifier.
   * @param userDbPassword - Password saved in the DB for this user.
   * @param requestPassword - Password provided by the request.
   * @param requestId - Request identifier.
   * @throws BlockedUserApiError - The account has been blocked due to too many failed login attempts.
   * @throws InvalidCredentialsLoginApiError - The email and password combination don't match with the db data.
   */
  async validateLoginCredentials(
    uuid: string,
    userDbPassword: string,
    requestPassword: string,
    requestId?: string,
  ) {
    try {
      if (!(await argon2.verify(userDbPassword, requestPassword))) {
        const updatedAttempts =
          await this.loginAttemptsRepository.updateLoginAttempts(
            uuid,
            requestId,
          );

        if (updatedAttempts === this.configService.get('MAX_LOGIN_ATTEMPTS')) {
          await this.accountRepository.blockAccountByUuid(uuid, requestId);
          throw new BlockedUserApiError();
        }
        throw new InvalidCredentialsLoginApiError();
      }
    } catch (error) {
      if (error instanceof HttpException) throw error;
    }
  }
}
