import * as argon2 from 'argon2';
import { ApiError } from '../errors';

export async function verifyHashedValue(
  hashedValue: string,
  plainValue: string,
): Promise<boolean> {
  try {
    return argon2.verify(hashedValue, plainValue);
  } catch (_error) {
    throw new ApiError();
  }
}
