import {
  PollRepository,
  SessionRepository,
} from '../../src/infrastructure/db/repositories';

export const sessionRepository = {
  saveSession: jest.fn(),
  getAllTokensByUuid: jest.fn(),
  getBySessionId: jest.fn(),
  removeTokensById: jest.fn(),
  removeAllSessionsByUuid: jest.fn(),
  removeTokensBySessionId: jest.fn(),
  updateRefreshTokenId: jest.fn(),
} as unknown as jest.Mocked<SessionRepository>;

export const pollRepository = {
  createPoll: jest.fn(),
  getPollList: jest.fn(),
  findOneByPollId: jest.fn(),
  votePoll: jest.fn(),
} as unknown as jest.Mocked<PollRepository>;
