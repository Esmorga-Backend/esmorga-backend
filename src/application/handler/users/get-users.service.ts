import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { DataBaseUnauthorizedError } from '../../../infrastructure/db/errors';
import { InvalidTokenApiError } from '../../../domain/errors';
import { UserPaginatedItemDto } from '../../../infrastructure/dtos';

@Injectable()
export class GetUsersService {
  constructor(private readonly logger: PinoLogger) {}

  async getUsers(requestId?: string): Promise<UserPaginatedItemDto[]> {
    try {
      this.logger.info(
        `[GetUsersService] [getUsers] - x-request-id: ${requestId}`,
      );

      return [];
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
