import { PinoLogger } from 'nestjs-pino';
import { VotePollService } from '../../../../../src/application/handler/poll/vote-poll.service';
import { AccountRepository } from '../../../../../src/infrastructure/db/repositories';
import { VotePollDto } from '../../../../../src/infrastructure/http/dtos';
import { PollDto } from '../../../../../src/infrastructure/dtos';
import {
  InvalidMultipleSelectionApiError,
  InvalidTokenApiError,
  NotFoundApiError,
  VoteClosedApiError,
} from '../../../../../src/domain/errors';
import {
  DataBaseBadRequestError,
  DataBaseNotFoundError,
  DataBaseUnathorizedError,
} from '../../../../../src/infrastructure/db/errors';
import { POLL_MOCK, OLD_POLL_MOCK } from '../../../../mocks/dtos/poll';
import {
  sessionRepository,
  pollRepository,
} from '../../../../mocks/repositories';

const createSessionUser = (uuid = 'user-uuid') => ({ uuid }) as any;

const createActivePoll = (): PollDto => ({
  ...POLL_MOCK,
  voteDeadline: new Date(POLL_MOCK.voteDeadline),
  options: POLL_MOCK.options.map((option) => ({
    ...option,
    votes: option.votes ? [...option.votes] : [],
  })),
  userSelectedOptions: [...(POLL_MOCK.userSelectedOptions ?? [])],
});

const createClosedPoll = (): PollDto => ({
  ...OLD_POLL_MOCK,
  voteDeadline: new Date(OLD_POLL_MOCK.voteDeadline),
  options: OLD_POLL_MOCK.options.map((option) => ({
    ...option,
    votes: option.votes ? [...option.votes] : [],
  })),
  userSelectedOptions: [...(OLD_POLL_MOCK.userSelectedOptions ?? [])],
});

describe('[unit-test] [VotePollService]', () => {
  let accountRepository: AccountRepository;
  let logger: PinoLogger;
  let service: VotePollService;

  const sessionId = 'session-id';
  const pollId = POLL_MOCK.pollId;
  const requestId = 'request-id';
  const OPTION_A = POLL_MOCK.options[0].optionId;
  const OPTION_B = POLL_MOCK.options[1].optionId;
  const votePollDto: VotePollDto = {
    selectedOptions: [OPTION_A],
  };

  beforeEach(() => {
    accountRepository = {} as AccountRepository;

    logger = {
      info: jest.fn(),
      error: jest.fn(),
    } as unknown as PinoLogger;

    service = new VotePollService(
      logger,
      accountRepository,
      pollRepository,
      sessionRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('throws VoteClosedApiError when poll is closed', async () => {
    const closedPoll = createClosedPoll();
    sessionRepository.getBySessionId.mockResolvedValue(createSessionUser());
    pollRepository.findOneByPollId.mockResolvedValue(closedPoll);

    await expect(
      service.vote(sessionId, votePollDto, pollId, requestId),
    ).rejects.toBeInstanceOf(VoteClosedApiError);

    expect(pollRepository.votePoll).not.toHaveBeenCalled();
  });

  it('throws InvalidMultipleSelectionApiError on single-choice poll', async () => {
    const singleChoicePoll = createActivePoll();
    singleChoicePoll.isMultipleChoice = false;
    sessionRepository.getBySessionId.mockResolvedValue(createSessionUser());
    pollRepository.findOneByPollId.mockResolvedValue(singleChoicePoll);

    await expect(
      service.vote(
        sessionId,
        { selectedOptions: [OPTION_A, OPTION_B] },
        pollId,
        requestId,
      ),
    ).rejects.toBeInstanceOf(InvalidMultipleSelectionApiError);
  });

  it('throws NotFoundApiError when option does not exist', async () => {
    const poll = createActivePoll();
    sessionRepository.getBySessionId.mockResolvedValue(createSessionUser());
    pollRepository.findOneByPollId.mockResolvedValue(poll);

    await expect(
      service.vote(
        sessionId,
        { selectedOptions: [OPTION_A, 'option-x'] },
        pollId,
        requestId,
      ),
    ).rejects.toBeInstanceOf(NotFoundApiError);

    expect(pollRepository.votePoll).not.toHaveBeenCalled();
  });

  it('returns poll with user selected options', async () => {
    const poll = createActivePoll();
    const uuid = 'user-uuid';
    const votedPoll = createActivePoll();
    votedPoll.options[0].votes = [uuid, 'friend'];
    votedPoll.options[1].votes = [];

    sessionRepository.getBySessionId.mockResolvedValue(createSessionUser(uuid));
    pollRepository.findOneByPollId.mockResolvedValue(poll);
    pollRepository.votePoll.mockResolvedValue(votedPoll);

    const result = await service.vote(
      sessionId,
      votePollDto,
      pollId,
      requestId,
    );

    expect(result.userSelectedOptions).toEqual([OPTION_A]);
    expect(result.options).toEqual([
      { optionId: OPTION_A, option: POLL_MOCK.options[0].option, voteCount: 2 },
      { optionId: OPTION_B, option: POLL_MOCK.options[1].option, voteCount: 0 },
    ]);
    expect(pollRepository.votePoll).toHaveBeenCalledWith(
      votePollDto.selectedOptions,
      uuid,
      pollId,
      requestId,
    );
  });

  it('throws InvalidTokenApiError when session is invalid', async () => {
    sessionRepository.getBySessionId.mockRejectedValue(
      new DataBaseUnathorizedError(),
    );

    await expect(
      service.vote(sessionId, votePollDto, pollId, requestId),
    ).rejects.toBeInstanceOf(InvalidTokenApiError);

    expect(pollRepository.findOneByPollId).not.toHaveBeenCalled();
  });

  it('throws NotFoundApiError when pollRepository throws DataBaseBadRequestError', async () => {
    sessionRepository.getBySessionId.mockResolvedValue(createSessionUser());
    pollRepository.findOneByPollId.mockRejectedValue(
      new DataBaseBadRequestError(),
    );

    await expect(
      service.vote(sessionId, votePollDto, pollId, requestId),
    ).rejects.toBeInstanceOf(NotFoundApiError);

    expect(pollRepository.votePoll).not.toHaveBeenCalled();
  });

  it('throws NotFoundApiError when pollRepository throws DataBaseNotFoundError', async () => {
    sessionRepository.getBySessionId.mockResolvedValue(createSessionUser());
    pollRepository.findOneByPollId.mockRejectedValue(
      new DataBaseNotFoundError(),
    );

    await expect(
      service.vote(sessionId, votePollDto, pollId, requestId),
    ).rejects.toBeInstanceOf(NotFoundApiError);
  });
});
