import * as argon2 from 'argon2';
import { ApiError } from '../errors';

export async function encodeValue(value: string) {
  try {
    return await argon2.hash(value);
  } catch (error) {
    throw new ApiError();
  }
}
