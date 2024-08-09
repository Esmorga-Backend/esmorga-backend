/**
 * Removes fields without null values from an object and create a new one.
 * @param fieldsToCheck- The object with fields to check.
 * @returnS A new object with null properties.
 */
export function getNullFields(fieldsToCheck: object): object {
  const nullFields = {};

  Object.entries(fieldsToCheck).forEach(([key, value]) => {
    if (value === null) {
      nullFields[key] = null;
    }
    if (typeof value === 'object' && value !== null) {
      const nestedNullFields = getNullFields(value);

      if (Object.keys(nestedNullFields).length > 0) {
        nullFields[key] = nestedNullFields;
      }
    }
  });

  return nullFields;
}
