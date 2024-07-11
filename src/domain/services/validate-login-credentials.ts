import { HttpException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { InvalidCredentialsLoginApiError, ApiError } from '../errors';
/**
 * Validate if request password match with user password store in the db.
 * @param userDbPassword Password saved in the DB for this user.
 * @param requestPassword Password provided by the request.
 */
export async function validateLoginCredentials(
  userDbPassword: string,
  requestPassword: string,
) {
  try {
    if (!(await argon2.verify(userDbPassword, requestPassword))) {
      throw new InvalidCredentialsLoginApiError();
    }
  } catch (error) {
    if (error instanceof HttpException) throw error;

    throw new ApiError();
  }
}
