import {
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';
import { HttpExceptionFilter } from '../errors';
import { AuthGuard } from '../guards';
import { RequestId, SessionId } from '../req-decorators';
import { GetUsersService } from '../../../application/handler/users';
import { UsersListPaginatedDto } from '../../dtos';

@Controller('/v1/users')
@ApiTags('Users')
@UseFilters(new HttpExceptionFilter())
export class UserController {
  constructor(
    private readonly logger: PinoLogger,
    private readonly getUsersService: GetUsersService,
  ) {}

  @Get('/')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  async getUsers(
    @SessionId() sessionId: string,
    @RequestId() requestId: string,
  ): Promise<UsersListPaginatedDto> {
    try {
      this.logger.info(
        `[UsersController] [getUsers] - x-request-id: ${requestId}`,
      );

      const result: UsersListPaginatedDto =
        await this.getUsersService.getUsers(sessionId);

      return result;
    } catch (error) {
      this.logger.error(
        `[UsersController] [getUsers] - x-request-id: ${requestId}, error: ${error}`,
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException();
    }
  }
}
