import {
  Body,
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';
import { HttpExceptionFilter } from '../errors';
import { AuthGuard } from '../guards';
import { RequestId, SessionId } from '../req-decorators';
import { CreatePollDto } from '../dtos';
import {
  CreatePollService,
  GetPollListService,
} from '../../../application/handler/poll';
import {
  SwaggerCreatePoll,
  SwaggerGetPolls,
} from '../swagger/decorators/polls';
import { PollListDto } from '../../dtos';

@ApiTags('Poll')
@Controller('/v1/polls')
@UseFilters(new HttpExceptionFilter())
export class PollController {
  constructor(
    private readonly logger: PinoLogger,
    private readonly createPollService: CreatePollService,
    private readonly getPollListService: GetPollListService,
  ) {}
  @Post('/')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @SwaggerCreatePoll()
  async createPoll(
    @Body() createPollDto: CreatePollDto,
    @SessionId() sessionId: string,
    @RequestId() requestId: string,
  ) {
    try {
      this.logger.info(
        `[PollController] [createPoll] - x-request-id:${requestId}`,
      );

      await this.createPollService.create(sessionId, createPollDto, requestId);
    } catch (error) {
      this.logger.error(
        `[PollController] [createPoll] - x-request-id:${requestId}, error ${error}`,
      );

      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  @Get('/')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @SwaggerGetPolls()
  async getPolls(
    @RequestId() requestId: string,
    @SessionId() sessionId: string,
  ): Promise<PollListDto> {
    try {
      this.logger.info(
        `[PollController] [getPolls] - x-request-id:${requestId}`,
      );

      const response: PollListDto = await this.getPollListService.find(
        sessionId,
        requestId,
      );

      return response;
    } catch (error) {
      this.logger.error(
        `[PollController] [getPolls] - x-request-id:${requestId}, error ${error}`,
      );

      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }
}
