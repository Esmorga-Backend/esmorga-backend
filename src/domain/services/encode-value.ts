import * as argon2 from 'argon2';

export async function encodeValue(value: string) {
  return await argon2.hash(value);
}
