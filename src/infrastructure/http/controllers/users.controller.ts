import {
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  Query,
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
import { GetUsersDto } from '../dtos/get-users.dto';
import { SwaggerGetUsers } from '../swagger/decorators/users';

@Controller('/v1/users')
@ApiTags('Users')
@UseFilters(new HttpExceptionFilter())
export class UsersController {
  constructor(
    private readonly logger: PinoLogger,
    private readonly getUsersService: GetUsersService,
  ) {}

  @Get('/')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @SwaggerGetUsers()
  async getUsers(
    @SessionId() sessionId: string,
    @RequestId() requestId: string,
    @Query() getUsersDto: GetUsersDto,
  ): Promise<UsersListPaginatedDto> {
    try {
      this.logger.info(
        `[UsersController] [getUsers] - x-request-id: ${requestId}`,
      );

      const result: UsersListPaginatedDto = await this.getUsersService.getUsers(
        requestId,
        sessionId,
        getUsersDto,
      );

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
