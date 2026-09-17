import { jest, beforeEach, describe, it, afterEach, expect } from '@jest/globals';
import { PinoLogger } from 'nestjs-pino';
import { UsersRepository } from '../../../../../src/infrastructure/db/repositories/users.repository';
import { UserDA } from '../../../../../src/infrastructure/db/modules/none/user-da';
import { DataBaseInternalError } from '../../../../../src/infrastructure/db/errors';
import { UserPaginatedItemDto } from '../../../../../src/infrastructure/dtos';
import { GetUsersDto } from '../../../../../src/infrastructure/http/dtos/get-users.dto';
import { ACCOUNT_ROLES } from '../../../../../src/domain/const';

const createUsersMock = (): UserPaginatedItemDto[] => [
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
    role: ACCOUNT_ROLES.ADMIN,
  },
];

describe('[unit-test] [UsersRepository]', () => {
  let userDA: jest.Mocked<UserDA>;
  let logger: PinoLogger;
  let repository: UsersRepository;

  beforeEach(() => {
    userDA = {
      getAllUsers: jest.fn(),
    } as unknown as jest.Mocked<UserDA>;

    logger = {
      info: jest.fn(),
      error: jest.fn(),
    } as unknown as PinoLogger;

    repository = new UsersRepository(logger, userDA);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('[getAllUsers]', () => {
    it('returns all users with pagination parameters', async () => {
      const users = createUsersMock();
      const getUsersDto: GetUsersDto = {
        page: 1,
        limit: 10,
        sortBy: 'name' as any,
        order: 'asc' as any,
      };

      userDA.getAllUsers.mockResolvedValue({ users, total: users.length });

      const result = await repository.getAllUsers(getUsersDto);

      expect(result).toEqual({ users, total: users.length });
      expect(userDA.getAllUsers).toHaveBeenCalledWith(getUsersDto);
    });

    it('returns empty array when no users exist', async () => {
      const getUsersDto: GetUsersDto = {
        page: 1,
        limit: 10,
        sortBy: 'name' as any,
        order: 'asc' as any,
      };

      userDA.getAllUsers.mockResolvedValue({ users: [], total: 0 });

      const result = await repository.getAllUsers(getUsersDto);

      expect(result).toEqual({ users: [], total: 0 });
      expect(userDA.getAllUsers).toHaveBeenCalledWith(getUsersDto);
    });

    it('throws DataBaseInternalError when database operation fails', async () => {
      const getUsersDto: GetUsersDto = {
        page: 1,
        limit: 10,
        sortBy: 'name' as any,
        order: 'asc' as any,
      };

      userDA.getAllUsers.mockRejectedValue(
        new Error('Internal database error'),
      );

      await expect(repository.getAllUsers(getUsersDto)).rejects.toBeInstanceOf(
        DataBaseInternalError,
      );
    });

    it('throws DataBaseInternalError when database returns null', async () => {
      const getUsersDto: GetUsersDto = {
        page: 1,
        limit: 10,
        sortBy: 'name' as any,
        order: 'asc' as any,
      };

      userDA.getAllUsers.mockRejectedValue(null);

      await expect(repository.getAllUsers(getUsersDto)).rejects.toBeInstanceOf(
        DataBaseInternalError,
      );
    });
  });
});
