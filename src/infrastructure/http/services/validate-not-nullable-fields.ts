import { InvalidNullFieldApiError } from '../errors';

/**
 * Validates if optional fields of the object are null.
 * @param fieldsToValidate Password saved in the DB for this user.
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
