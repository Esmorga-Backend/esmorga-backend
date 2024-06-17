import { createHash } from 'crypto';
import { InvalidCredentialsApiError } from '../errors';

/**
 * Validate if request password match with user password store in the db.
 * @param userDbPassword Password saved in the DB for this user.
 * @param requestPassword Password provided by the request.
 */
export function validateLoginCredentials(
  userDbPassword: string,
  requestPassword: string,
) {
  if (
    !userDbPassword ||
    userDbPassword !==
      createHash('sha256').update(requestPassword).digest('hex')
  ) {
    throw new InvalidCredentialsApiError();
  }
}
