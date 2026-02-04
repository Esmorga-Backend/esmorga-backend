import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { DataBaseUnauthorizedError } from '../../../infrastructure/db/errors';
import {
  InvalidTokenApiError,
  NotAdminAccountApiError,
} from '../../../domain/errors';
import { UsersListPaginatedDto } from '../../../infrastructure/dtos';
import {
  UsersRepository,
  SessionRepository,
  AccountRepository,
} from '../../../infrastructure/db/repositories';
import { GetUsersDto } from '../../../infrastructure/http/dtos/get-users.dto';
import { ACCOUNT_ROLES } from '../../../domain/const';

@Injectable()
export class GetUsersService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly usersRepository: UsersRepository,
    private readonly sessionRepository: SessionRepository,
    private readonly accountRepository: AccountRepository,
  ) {}

  async getUsers(
    requestId?: string,
    sessionId?: string,
    getUsersDto?: GetUsersDto,
  ): Promise<UsersListPaginatedDto> {
    try {
      this.logger.info(
        `[GetUsersService] [getUsers] - x-request-id: ${requestId}`,
      );

      const { uuid } = await this.sessionRepository.getBySessionId(
        sessionId,
        requestId,
      );

      const { role } = await this.accountRepository.getUserById(
        uuid,
        requestId,
      );

      if (role !== ACCOUNT_ROLES.ADMIN) throw new NotAdminAccountApiError();

      const users = await this.usersRepository.getAllUsers(getUsersDto);

      return {
        users,
        meta: {
          currentPage: getUsersDto.page,
          itemsPerPage: getUsersDto.limit,
          totalItems: users.length,
          totalPages: Math.ceil(users.length / getUsersDto.limit),
        },
      };
    } catch (error) {
      this.logger.error(
        `[GetUsersService] [getUsers] - x-request-id: ${requestId}, error: ${error}`,
      );

      if (error instanceof DataBaseUnauthorizedError)
        throw new InvalidTokenApiError();

      throw error;
    }
  }
}
