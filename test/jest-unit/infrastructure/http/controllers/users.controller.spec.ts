import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { UsersController } from '../../../../../src/infrastructure/http/controllers/users.controller';
import { GetUsersService } from '../../../../../src/application/handler/users';
import { UsersListPaginatedDto } from '../../../../../src/infrastructure/dtos';
import { GetUsersDto } from '../../../../../src/infrastructure/http/dtos/get-users.dto';
import { ACCOUNT_ROLES } from '../../../../../src/domain/const';

describe('[unit-test] [UsersController]', () => {
  let usersController: UsersController;
  let logger: PinoLogger;
  let getUsersService: GetUsersService;

  const MOCKED_SESSION_ID = 'mocked-session-id';
  const MOCKED_REQUEST_ID = 'mocked-request-id';

  beforeEach(() => {
    logger = {
      info: jest.fn(),
      error: jest.fn(),
    } as unknown as PinoLogger;

    getUsersService = {
      getUsers: jest.fn(),
    } as unknown as GetUsersService;

    usersController = new UsersController(logger, getUsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('[getUsers]', () => {
    it('Should return a paginated list of users when service succeeds', async () => {
      const getUsersDto: GetUsersDto = {
        page: 1,
        limit: 10,
        sortBy: 'name' as any,
        order: 'asc' as any,
      };

      const expectedResult: UsersListPaginatedDto = {
        users: [
          {
            id: 'user-1',
            name: 'Alice',
            lastName: 'Cooper',
            email: 'alice@example.com',
            role: ACCOUNT_ROLES.USER,
          },
        ],
        meta: {
          currentPage: 1,
          itemsPerPage: 10,
          totalItems: 1,
          totalPages: 1,
        },
      };

      (getUsersService.getUsers as jest.Mock).mockResolvedValue(expectedResult);

      const result = await usersController.getUsers(
        MOCKED_SESSION_ID,
        MOCKED_REQUEST_ID,
        getUsersDto,
      );

      expect(result).toEqual(expectedResult);
      expect(getUsersService.getUsers).toHaveBeenCalledWith(
        MOCKED_REQUEST_ID,
        MOCKED_SESSION_ID,
        getUsersDto,
      );
      expect(logger.info).toHaveBeenCalledWith(
        expect.stringContaining('[UsersController] [getUsers]'),
      );
    });

    it('Should rethrow HttpException if one is thrown by the service', async () => {
      const getUsersDto: GetUsersDto = {
        page: 1,
        limit: 10,
      };

      const error = new BadRequestException('Invalid parameters');
      (getUsersService.getUsers as jest.Mock).mockRejectedValue(error);

      await expect(
        usersController.getUsers(
          MOCKED_SESSION_ID,
          MOCKED_REQUEST_ID,
          getUsersDto,
        ),
      ).rejects.toThrow(BadRequestException);

      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining(
          `[UsersController] [getUsers] - x-request-id: ${MOCKED_REQUEST_ID}, error:`,
        ),
      );
    });

    it('Should throw InternalServerErrorException for unknown errors', async () => {
      const getUsersDto: GetUsersDto = {
        page: 1,
        limit: 10,
      };

      const error = new Error('Unexpected database error');
      (getUsersService.getUsers as jest.Mock).mockRejectedValue(error);

      await expect(
        usersController.getUsers(
          MOCKED_SESSION_ID,
          MOCKED_REQUEST_ID,
          getUsersDto,
        ),
      ).rejects.toThrow(InternalServerErrorException);

      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining(
          `[UsersController] [getUsers] - x-request-id: ${MOCKED_REQUEST_ID}, error:`,
        ),
      );
    });
  });
});
