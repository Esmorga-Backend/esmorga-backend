import { EventDto } from '../../dtos';
import { DataBaseInternalError } from '../errors';

/**
 * This funcition validates if the object mapped contain all required events fields,
 * event if the required fied is nedted
 * @param eventDto - Event following the expected format to be returned with db data
 */
export function validateEventDto(eventDto: EventDto) {
  const requiredEventFields = [
    'eventId',
    'eventName',
    'eventDate',
    'eventType',
    'description',
    'location.name',
  ];

  const missingFields = requiredEventFields.filter((field) => {
    const fieldPath = field.split('.');
    let currentObject = eventDto;

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
    //TODO add a trace with the missingFields

    throw new DataBaseInternalError();
  }
}
