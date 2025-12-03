import {
  PollRepository,
  SessionRepository,
  EventRepository,
  AccountRepository,
  EventParticipantsRepository,
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
  removeUserFromAllPolls: jest.fn(),
} as unknown as jest.Mocked<PollRepository>;

export const eventRepository = {
  createEvent: jest.fn(),
  getEventById: jest.fn(),
  getEventsByUserId: jest.fn(),
  updateEvent: jest.fn(),
  deleteEvent: jest.fn(),
} as unknown as jest.Mocked<EventRepository>;

export const accountRepository = {
  createAccount: jest.fn(),
  getAccountByEmail: jest.fn(),
  getCurrentPasswordByUuid: jest.fn(),
  deleteAccountByUuid: jest.fn(),
} as unknown as jest.Mocked<AccountRepository>;

export const eventParticipantsRepository = {
  addParticipantToEvent: jest.fn(),
  removeUserFromAllEvents: jest.fn(),
} as unknown as jest.Mocked<EventParticipantsRepository>;
