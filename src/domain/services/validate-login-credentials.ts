import * as argon2 from 'argon2';
import {
  AccountRepository,
  LoginAttempsRepository,
} from '../../infrastructure/db/repositories';
import {
  BlockedUserApiError,
  InvalidCredentialsLoginApiError,
} from '../errors';

/**
 * Validate if request password match with user password store in the db.
 * @param userDbPassword Password saved in the DB for this user.
 * @param requestPassword Password provided by the request.
 */
export async function validateLoginCredentials(
  uuid: string,
  userDbPassword: string,
  requestPassword: string,
  accountRepository: AccountRepository,
  loginAttempsRepository: LoginAttempsRepository,
  requestId?: string,
) {
  try {
    if (!(await argon2.verify(userDbPassword, requestPassword))) {
      const updatedAttemps = await loginAttempsRepository.updateLoginAttemps(
        uuid,
        requestId,
      );
      if (updatedAttemps === 5) {
        await accountRepository.blockAccountByUuid(uuid, requestId);
        throw new BlockedUserApiError();
      }
      throw new InvalidCredentialsLoginApiError();
    }
  } catch (error) {
    throw new InvalidCredentialsLoginApiError();
  }
}
