import { EventDto, UserProfileDto } from '../../dtos';
import { DataBaseInternalError } from '../errors';

/**
 * This funcition validates if the object mapped contain all required dto fields,
 * event if the required fied is nested
 * @param objectDto - Event following the expected format to be returned with db data
 * @param requiredFields - List of fields to check
 */
export function validateObjectDto(
  objectDto: EventDto | UserProfileDto,
  requiredFields: string[],
) {
  const missingFields = requiredFields.filter((field) => {
    const fieldPath = field.split('.');
    let currentObject = objectDto;

    const isMissed = fieldPath.some((nestedField) => {
      if (
        !(nestedField in currentObject) ||
        currentObject[nestedField] === undefined
      ) {
        return true;
      }
      currentObject = currentObject[nestedField];
      return false;
    });

    return isMissed;
  });

  if (missingFields.length > 0) {
    throw new DataBaseInternalError();
  }
}
