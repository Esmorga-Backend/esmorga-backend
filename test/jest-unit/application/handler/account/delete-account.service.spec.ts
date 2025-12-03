import { PinoLogger } from 'nestjs-pino';

import { SessionDto } from '../../../../../src/infrastructure/dtos';

import { DeleteAccountService } from '../../../../../src/application/handler/account';

import { InvalidPasswordError } from '../../../../../src/domain/errors';

import {
  pollRepository,
  sessionRepository,
  accountRepository,
  eventParticipantsRepository,
} from '../../../../mocks/repositories';

import {
  getUserProfile,
  getCurrentPassword,
  PASSWORD_MOCK_DB,
} from '../../../../mocks/db/user';

describe('[unit-test] [DeleteAccountService]', () => {
  let logger: PinoLogger;

  let deleteAccountService: DeleteAccountService;

  const MOCKED_REQUEST_ID = 'mocked-request-id';

  beforeEach(() => {
    logger = {
      info: jest.fn(),
      error: jest.fn(),
    } as unknown as PinoLogger;

    deleteAccountService = new DeleteAccountService(
      logger,
      sessionRepository,
      accountRepository,
      eventParticipantsRepository,
      pollRepository,
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('Given a valid password, return success, remove user profile data, invalidate tokens and delete data related to events and polls', async () => {
    const MOCKED_PROFILE = await getUserProfile();
    const CURRENT_PASSWORD_HASHED_MOCK = await getCurrentPassword();

    jest
      .spyOn(sessionRepository, 'getBySessionId')
      .mockResolvedValue({ uuid: MOCKED_PROFILE.uuid } as SessionDto);

    jest
      .spyOn(accountRepository, 'getCurrentPasswordByUuid')
      .mockResolvedValue(CURRENT_PASSWORD_HASHED_MOCK);

    const removeUserFromAllEventsSpy = jest.spyOn(
      eventParticipantsRepository,
      'removeUserFromAllEvents',
    );
    const removeUserFromAllPollsSpy = jest.spyOn(
      pollRepository,
      'removeUserFromAllPolls',
    );
    const removeAllSessionsByUuidSpy = jest.spyOn(
      sessionRepository,
      'removeAllSessionsByUuid',
    );
    const deleteAccountByUuidSpy = jest.spyOn(
      accountRepository,
      'deleteAccountByUuid',
    );
    const result = await deleteAccountService.deleteAccount(
      'valid-session-id',
      { password: PASSWORD_MOCK_DB },
      MOCKED_REQUEST_ID,
    );

    expect(result).toBeUndefined();

    expect(removeUserFromAllEventsSpy).toHaveBeenCalledWith(
      MOCKED_PROFILE.uuid,
      MOCKED_REQUEST_ID,
    );

    expect(removeUserFromAllPollsSpy).toHaveBeenCalledWith(
      MOCKED_PROFILE.uuid,
      MOCKED_REQUEST_ID,
    );

    expect(removeAllSessionsByUuidSpy).toHaveBeenCalledWith(
      MOCKED_PROFILE.uuid,
      null,
      MOCKED_REQUEST_ID,
    );

    expect(deleteAccountByUuidSpy).toHaveBeenCalledWith(
      MOCKED_PROFILE.uuid,
      MOCKED_REQUEST_ID,
    );
  });

  it('Given an invalid password InvalidPasswordError should be returned', async () => {
    const MOCKED_PROFILE = await getUserProfile();
    const CURRENT_PASSWORD_HASHED_MOCK = await getCurrentPassword();

    jest
      .spyOn(sessionRepository, 'getBySessionId')
      .mockResolvedValue({ uuid: MOCKED_PROFILE.uuid } as SessionDto);

    jest
      .spyOn(accountRepository, 'getCurrentPasswordByUuid')
      .mockResolvedValue(CURRENT_PASSWORD_HASHED_MOCK);

    try {
      await deleteAccountService.deleteAccount(
        'valid-session-id',
        { password: 'invalid-password' },
        MOCKED_REQUEST_ID,
      );
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidPasswordError);
    }
  });
});
