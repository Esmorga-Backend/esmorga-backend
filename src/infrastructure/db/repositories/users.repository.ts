import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { DataBaseInternalError } from '../errors';
import { UserDA } from '../modules/none/user-da';
import { UserPaginatedItemDto } from '../../dtos';
import { GetUsersDto } from '../../http/dtos/get-users.dto';

@Injectable()
export class UsersRepository {
  constructor(
    private readonly logger: PinoLogger,
    private readonly userDA: UserDA,
  ) {}

  async getAllUsers(
    getUsersDto: GetUsersDto,
  ): Promise<{ users: UserPaginatedItemDto[]; total: number }> {
    try {
      this.logger.info(`[UsersRepository] [getAllUsers]`);

      const result = await this.userDA.getAllUsers(getUsersDto);

      return result;
    } catch (error) {
      this.logger.error(`[UsersRepository] [getAllUsers] - error: ${error}`);

      throw new DataBaseInternalError();
    }
  }
}
