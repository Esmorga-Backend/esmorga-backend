import { filterAvaliableEvents } from '../../../../src/domain/services';
import { EVENT_MOCK, OLD_EVENT_MOCK } from '../../../mocks/dtos';

describe('[unit-test] [filterAvaliableEvents]', () => {
  it('Should return events not celebrated yet', () => {
    const response = filterAvaliableEvents([EVENT_MOCK, OLD_EVENT_MOCK]);

    expect(response).toMatchObject([EVENT_MOCK]);
  });

  it('Should not return a list of event of evets have been celebrated', () => {
    const response = filterAvaliableEvents([OLD_EVENT_MOCK]);

    expect(response).toMatchObject([]);
  });
});
