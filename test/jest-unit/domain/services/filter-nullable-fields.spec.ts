import { getNullFields } from '../../../../src/domain/services';
import { UPDATE_EVENT_MOCK } from '../../../mocks/dtos';

describe('[unit-test] [getNullFields]', () => {
  it('Should return a new object with null fields', () => {
    const event = JSON.parse(JSON.stringify(UPDATE_EVENT_MOCK));

    event.location.long = null;
    event.location.lat = null;
    event.tags = null;
    event.imageUrl = null;

    const nullFields = {
      imageUrl: null,
      location: { lat: null, long: null },
      tags: null,
    };

    const objectWithNullFields = getNullFields(event);

    expect(objectWithNullFields).toEqual(nullFields);
  });
});
