import { createHash } from 'crypto';
import { InvalidCredentialsApiError } from '../errors';

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
