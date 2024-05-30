import { filterAvaliableEvents } from '../../../../src/domain/services';
import { eventMock, oldEventMock } from '../../../mocks/dtos';

describe('[unit-test] [filterAvaliableEvents]', () => {
  it('Should return events not celebrated yet', () => {
    const response = filterAvaliableEvents([eventMock, oldEventMock]);

    expect(response).toMatchObject([eventMock]);
  });

  it('Should not return a list of event of evets have been celebrated', () => {
    const response = filterAvaliableEvents([oldEventMock]);

    expect(response).toMatchObject([]);
  });
});
