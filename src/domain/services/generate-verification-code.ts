/**
 * Generate a 6 digit random verification code number between 0 and 999999.
 * The result is returned as a string to preserve leading zeros.
 *
 * @returns Random 6 digit verification code.
 */
export function generateVerificationCode(): string {
  return Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0');
}
