import { removeNullObjectFields } from '../../../../../src/infrastructure/db/services';
import { UPDATE_EVENT_MOCK } from '../../../../mocks/dtos';

describe('[unit-test] [removeNullObjectFields]', () => {
  it('Should return the object without null fields', () => {
    const event = JSON.parse(JSON.stringify(UPDATE_EVENT_MOCK));

    delete event.location.long;
    delete event.location.lat;
    delete event.tags;
    delete event.imageUrl;

    const nullFields = {
      imageUrl: null,
      location: { lat: null, long: null },
      tags: null,
    };

    const objectWithoutNullFields = removeNullObjectFields(
      UPDATE_EVENT_MOCK,
      nullFields,
    );

    expect(objectWithoutNullFields).toEqual(event);
  });
});
