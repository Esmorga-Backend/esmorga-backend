import { filterAvailablePolls } from '../../../../src/domain/services';
import { POLL_MOCK, OLD_POLL_MOCK } from '../../../mocks/dtos';

describe('[unit-test] [filterAvailablePolls]', () => {
  it('Should return polls not expired yet', () => {
    const response = filterAvailablePolls([POLL_MOCK, OLD_POLL_MOCK]);

    expect(response).toMatchObject([POLL_MOCK]);
  });

  it('Should not return a list of polls that have expired', () => {
    const response = filterAvailablePolls([OLD_POLL_MOCK]);

    expect(response).toMatchObject([]);
  });
});
