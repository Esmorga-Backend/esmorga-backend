/**
 * Removes fields without null values from an object and create a new one.
 * @param fieldsToCheck- The object with fields to check.
 * @param prefix- The prefix to build the full path for nested objects.
 * @returns A new object with null properties.
 */
export function getNullFields(
  fieldsToCheck: object,
  prefix: string = '',
): object {
  const nullFields = {};

  Object.entries(fieldsToCheck).forEach(([key, value]) => {
    const fullPath = prefix ? `${prefix}.${key}` : key;

    if (value === null) {
      nullFields[fullPath] = null;
    } else if (typeof value === 'object' && value !== null) {
      const nestedNullFields = getNullFields(value, fullPath);
      Object.assign(nullFields, nestedNullFields);
    }
  });

  return nullFields;
}
