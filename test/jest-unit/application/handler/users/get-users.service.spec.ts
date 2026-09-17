import { jest, beforeEach, describe, it, afterAll, expect } from '@jest/globals';
import { PinoLogger } from 'nestjs-pino';
import { SessionDto } from '../../../../../src/infrastructure/dtos';

import { GetUsersService } from '../../../../../src/application/handler/users';

import {
  InvalidTokenApiError,
  NotAdminAccountApiError,
} from '../../../../../src/domain/errors';

import { DataBaseUnauthorizedError } from '../../../../../src/infrastructure/db/errors';

import {
  sessionRepository,
  accountRepository,
  usersRepository,
} from '../../../../mocks/repositories';

import { getUserProfile } from '../../../../mocks/db/user';

import { ACCOUNT_ROLES } from '../../../../../src/domain/const';

describe('[unit-test] [GetUsersService]', () => {
  let logger: PinoLogger;

  let getUsersService: GetUsersService;

  const MOCKED_REQUEST_ID = 'mocked-request-id';
  const MOCKED_SESSION_ID = 'mocked-session-id';

  beforeEach(() => {
    jest.clearAllMocks();

    logger = {
      info: jest.fn(),
      error: jest.fn(),
    } as unknown as PinoLogger;

    getUsersService = new GetUsersService(
      logger,
      usersRepository,
      sessionRepository,
      accountRepository,
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('Given a valid admin session, return paginated users list with metadata', async () => {
    const MOCKED_PROFILE = await getUserProfile();
    const MOCKED_USERS = [
      {
        id: '64b0f37d9c8d4b3e8a123456',
        name: 'Alice',
        lastName: 'Cooper',
        email: 'alice.cooper@yopmail.com',
        role: ACCOUNT_ROLES.USER,
      },
      {
        id: '64b0f37d9c8d4b3e8a123457',
        name: 'Bob',
        lastName: 'Dylan',
        email: 'bob.dylan@yopmail.com',
        role: ACCOUNT_ROLES.USER,
      },
    ];

    const MOCKED_GET_USERS_DTO = {
      page: 1,
      limit: 10,
      sortBy: 'name',
      order: 'asc',
    };

    jest
      .spyOn(sessionRepository, 'getBySessionId')
      .mockResolvedValue({ uuid: MOCKED_PROFILE.uuid } as SessionDto);

    jest.spyOn(accountRepository, 'getUserById').mockResolvedValue({
      role: ACCOUNT_ROLES.ADMIN,
    } as any);

    const getAllUsersSpy = jest
      .spyOn(usersRepository, 'getAllUsers')
      .mockResolvedValue({ users: MOCKED_USERS, total: 2 } as any);

    const result = await getUsersService.getUsers(
      MOCKED_REQUEST_ID,
      MOCKED_SESSION_ID,
      MOCKED_GET_USERS_DTO as any,
    );

    expect(result).toBeDefined();
    expect(result.users).toEqual(MOCKED_USERS);
    expect(result.meta).toEqual({
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 2,
      totalPages: 1,
    });

    expect(sessionRepository.getBySessionId).toHaveBeenCalledWith(
      MOCKED_SESSION_ID,
      MOCKED_REQUEST_ID,
    );

    expect(accountRepository.getUserById).toHaveBeenCalledWith(
      MOCKED_PROFILE.uuid,
      MOCKED_REQUEST_ID,
    );

    expect(getAllUsersSpy).toHaveBeenCalledWith(MOCKED_GET_USERS_DTO);
  });

  it('Given a valid admin session with pagination, return correct metadata', async () => {
    const MOCKED_PROFILE = await getUserProfile();
    const MOCKED_USERS = Array.from({ length: 25 }, (_, i) => ({
      id: `64b0f37d9c8d4b3e8a12345${i}`,
      name: `User${i}`,
      lastName: `LastName${i}`,
      email: `user${i}@yopmail.com`,
      role: ACCOUNT_ROLES.USER,
    }));

    const MOCKED_GET_USERS_DTO = {
      page: 2,
      limit: 10,
      sortBy: 'name',
      order: 'asc',
    };

    jest
      .spyOn(sessionRepository, 'getBySessionId')
      .mockResolvedValue({ uuid: MOCKED_PROFILE.uuid } as SessionDto);

    jest.spyOn(accountRepository, 'getUserById').mockResolvedValue({
      role: ACCOUNT_ROLES.ADMIN,
    } as any);

    jest
      .spyOn(usersRepository, 'getAllUsers')
      .mockResolvedValue({ users: MOCKED_USERS, total: 25 } as any);

    const result = await getUsersService.getUsers(
      MOCKED_REQUEST_ID,
      MOCKED_SESSION_ID,
      MOCKED_GET_USERS_DTO as any,
    );

    expect(result).toBeDefined();
    expect(result.users).toEqual(MOCKED_USERS);
    expect(result.meta).toEqual({
      currentPage: 2,
      itemsPerPage: 10,
      totalItems: 25,
      totalPages: 3,
    });
  });

  it('Given a non-admin user session, NotAdminAccountApiError should be thrown', async () => {
    const MOCKED_PROFILE = await getUserProfile();

    jest
      .spyOn(sessionRepository, 'getBySessionId')
      .mockResolvedValue({ uuid: MOCKED_PROFILE.uuid } as SessionDto);

    jest.spyOn(accountRepository, 'getUserById').mockResolvedValue({
      role: ACCOUNT_ROLES.USER,
    } as any);

    try {
      await getUsersService.getUsers(MOCKED_REQUEST_ID, MOCKED_SESSION_ID, {
        page: 1,
        limit: 10,
        sortBy: 'name',
        order: 'asc',
      } as any);
    } catch (error) {
      expect(error).toBeInstanceOf(NotAdminAccountApiError);
    }

    expect(accountRepository.getUserById).toHaveBeenCalledWith(
      MOCKED_PROFILE.uuid,
      MOCKED_REQUEST_ID,
    );

    expect(usersRepository.getAllUsers).not.toHaveBeenCalled();
  });

  it('Given an invalid session, InvalidTokenApiError should be thrown', async () => {
    jest
      .spyOn(sessionRepository, 'getBySessionId')
      .mockRejectedValue(new DataBaseUnauthorizedError());

    try {
      await getUsersService.getUsers(MOCKED_REQUEST_ID, 'invalid-session-id', {
        page: 1,
        limit: 10,
        sortBy: 'name',
        order: 'asc',
      } as any);
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidTokenApiError);
    }

    expect(sessionRepository.getBySessionId).toHaveBeenCalledWith(
      'invalid-session-id',
      MOCKED_REQUEST_ID,
    );

    expect(accountRepository.getUserById).not.toHaveBeenCalled();
    expect(usersRepository.getAllUsers).not.toHaveBeenCalled();
  });

  it('Given a database error during user retrieval, error should be rethrown', async () => {
    const MOCKED_PROFILE = await getUserProfile();
    const DATABASE_ERROR = new Error('Database connection failed');

    jest
      .spyOn(sessionRepository, 'getBySessionId')
      .mockResolvedValue({ uuid: MOCKED_PROFILE.uuid } as SessionDto);

    jest.spyOn(accountRepository, 'getUserById').mockResolvedValue({
      role: ACCOUNT_ROLES.ADMIN,
    } as any);

    jest
      .spyOn(usersRepository, 'getAllUsers')
      .mockRejectedValue(DATABASE_ERROR);

    try {
      await getUsersService.getUsers(MOCKED_REQUEST_ID, MOCKED_SESSION_ID, {
        page: 1,
        limit: 10,
        sortBy: 'name',
        order: 'asc',
      } as any);
    } catch (error) {
      expect(error).toBe(DATABASE_ERROR);
    }

    expect(usersRepository.getAllUsers).toHaveBeenCalled();
  });
});
