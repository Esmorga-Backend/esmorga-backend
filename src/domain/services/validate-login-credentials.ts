import { HttpException } from '@nestjs/common';
import * as argon2 from 'argon2';
import {
  AccountRepository,
  LoginAttemptsRepository,
} from '../../infrastructure/db/repositories';
import {
  DataBaseBlockedError,
  DataBaseUnathorizedError,
} from '../../infrastructure/db/errors';

/**
 * Validate if request password match with user password store in the db.
 * If the password doesn't match, it increments the login attempts.
 * If the login attempts is 5 the account is blocked.
 *
 * @param uuid - User identifier.
 * @param userDbPassword - Password saved in the DB for this user.
 * @param requestPassword - Password provided by the request.
 * @param accountRepository - Repository for interacting with the user account data.
 * @param loginAttemptsRepository - Repository for interacting to login attempts.
 * @param requestId - Request identifier.
 * @throws BlockedUserApiError - The account has been blocked due to too many failed login attempts.
 * @throws InvalidCredentialsLoginApiError - The email and password combination don't match with the db data.
 */
export async function validateLoginCredentials(
  uuid: string,
  userDbPassword: string,
  requestPassword: string,
  accountRepository: AccountRepository,
  loginAttemptsRepository: LoginAttemptsRepository,
  requestId?: string,
) {
  try {
    if (!(await argon2.verify(userDbPassword, requestPassword))) {
      const updatedAttempts = await loginAttemptsRepository.updateLoginAttempts(
        uuid,
        requestId,
      );
      if (updatedAttempts === 5) {
        await accountRepository.blockAccountByUuid(uuid, requestId);
        throw new DataBaseBlockedError();
      }
      throw new DataBaseUnathorizedError();
    }
  } catch (error) {
    if (error instanceof HttpException) throw error;
  }
}
