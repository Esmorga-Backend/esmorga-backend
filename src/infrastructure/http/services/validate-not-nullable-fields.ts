import { InvalidNullFieldApiError } from '../errors';

/**
 * Validates if optional fields of the object are null.
 * @param fieldsToValidate - An object containing the fields to check.
 * @throws {InvalidNullFieldApiError} - Throw and error if any field that should not be null is found to be null.
 */
export function validateNotNullableFields(fieldsToValidate: object) {
  Object.entries(fieldsToValidate).forEach(([key, value]) => {
    if (value === null && value !== undefined) {
      throw new InvalidNullFieldApiError(key);
    }
    if (typeof value === 'object' && value !== null) {
      validateNotNullableFields(value);
    }
  });
}
