/**
 * Generate a 6 digit random verification/forgot password code number between 000000 and 999999.
 *
 * @returns Random 6 digit code (as a string to preserve leading zeros).
 */
export function generateTemporalCode(): string {
  return Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0');
}
