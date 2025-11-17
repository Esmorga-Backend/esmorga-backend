import { PinoLogger } from 'nestjs-pino';
import { GetPollListService } from '../../../../../src/application/handler/poll/get-poll-list.service';
import { PollDto } from '../../../../../src/infrastructure/dtos';
import { InvalidTokenApiError } from '../../../../../src/domain/errors';
import { DataBaseUnathorizedError } from '../../../../../src/infrastructure/db/errors';
import { POLL_MOCK, OLD_POLL_MOCK } from '../../../../mocks/dtos/poll';
import {
  pollRepository,
  sessionRepository,
} from '../../../../mocks/repositories';

const createActivePoll = (): PollDto => ({
  ...POLL_MOCK,
  voteDeadline: new Date(POLL_MOCK.voteDeadline),
  options: [
    {
      optionId: POLL_MOCK.options[0].optionId,
      option: POLL_MOCK.options[0].option,
      votes: ['userId', 'something'],
      voteCount: 2,
    },
    {
      optionId: POLL_MOCK.options[1].optionId,
      option: POLL_MOCK.options[1].option,
      votes: ['something'],
      voteCount: 1,
    },
  ],
  userSelectedOptions: [],
});

const createExpiredPoll = (): PollDto => ({
  ...OLD_POLL_MOCK,
  voteDeadline: new Date(OLD_POLL_MOCK.voteDeadline),
  options: [
    {
      optionId: OLD_POLL_MOCK.options[0].optionId,
      option: OLD_POLL_MOCK.options[0].option,
      votes: [],
      voteCount: 0,
    },
    {
      optionId: OLD_POLL_MOCK.options[1].optionId,
      option: OLD_POLL_MOCK.options[1].option,
      votes: [],
      voteCount: 0,
    },
  ],
  userSelectedOptions: [],
});

describe('[unit-test] [GetPollListService]', () => {
  let service: GetPollListService;
  let logger: PinoLogger;

  const sessionId = 'sessionId';
  const requestId = 'requestId';

  beforeEach(() => {
    logger = {
      info: jest.fn(),
      error: jest.fn(),
    } as unknown as PinoLogger;

    service = new GetPollListService(logger, pollRepository, sessionRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns available polls with user selected options and updated vote count', async () => {
    const uuid = 'userId';

    sessionRepository.getBySessionId.mockResolvedValue({ uuid } as any);
    pollRepository.getPollList.mockResolvedValue([
      createActivePoll(),
      createExpiredPoll(),
    ]);

    const result = await service.find(sessionId, requestId);

    expect(sessionRepository.getBySessionId).toHaveBeenCalledWith(
      sessionId,
      requestId,
    );
    expect(pollRepository.getPollList).toHaveBeenCalledWith(requestId);
    expect(result.totalPolls).toBe(1);
    expect(result.polls).toHaveLength(1);
    expect(result.polls[0].userSelectedOptions).toEqual([
      POLL_MOCK.options[0].optionId,
    ]);
    expect(result.polls[0].options).toEqual([
      {
        optionId: POLL_MOCK.options[0].optionId,
        option: POLL_MOCK.options[0].option,
        voteCount: 2,
      },
      {
        optionId: POLL_MOCK.options[1].optionId,
        option: POLL_MOCK.options[1].option,
        voteCount: 1,
      },
    ]);
  });

  it('throws InvalidTokenApiError when session is invalid', async () => {
    sessionRepository.getBySessionId.mockRejectedValue(
      new DataBaseUnathorizedError(),
    );

    await expect(service.find(sessionId, requestId)).rejects.toBeInstanceOf(
      InvalidTokenApiError,
    );
    expect(pollRepository.getPollList).not.toHaveBeenCalled();
  });
});
