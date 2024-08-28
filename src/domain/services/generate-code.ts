/**
 * Return a number with the length specifiec by parameter and random value.
 *
 * @param digitsLength - Number of total digits. Default value 6
 * @returns Code with leght specified
 */
export function generateCode(digitsLength: number = 6): number {
  const min = Math.pow(10, digitsLength - 1);

  const max = Math.pow(10, digitsLength) - 1;

  return Math.floor(min + Math.random() * (max - min + 1));
}
