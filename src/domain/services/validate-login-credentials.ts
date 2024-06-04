import { createHash } from 'crypto';
import { InvalidCredentialsApiError } from '../errors';

export function validateLoginCredentials(user, requestPassword) {
  if (
    !user ||
    user.password !== createHash('sha256').update(requestPassword).digest('hex')
  ) {
    throw new InvalidCredentialsApiError();
  }
}
