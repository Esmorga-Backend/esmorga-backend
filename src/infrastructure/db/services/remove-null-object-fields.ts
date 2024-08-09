/**
 * Removes fields with null values from an object.
 * @param fieldsToCheck- The object with fields to check.
 * @returns The object without null properties.
 */
export function removeNullObjectFields(
  fieldsToUpdate: object,
  nullFields: object,
): object {
  Object.keys(nullFields).forEach((key) => {
    const value = nullFields[key];

    if (value === null) {
      delete fieldsToUpdate[key];
    }
    if (typeof value === 'object' && value !== null) {
      removeNullObjectFields(fieldsToUpdate[key], value);

      if (Object.keys(fieldsToUpdate[key]).length === 0) {
        delete fieldsToUpdate[key];
      }
    }
  });

  return fieldsToUpdate;
}
