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
    let currentObject = eventDto;

    for (const nestedField of field.split('.')) {
      if (
        !(nestedField in currentObject) ||
        currentObject[nestedField] === undefined
      ) {
        return true;
      }

      currentObject = currentObject[nestedField];
    }
    return false;
  });

  if (missingFields.length > 0) {
    // eslint-disable-next-line no-console
    console.log({ missingFields });

    throw new DataBaseInternalError();
  }
}
