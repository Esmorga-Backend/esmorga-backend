import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  InternalServerErrorException,
  Param,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';
import { HttpExceptionFilter } from '../errors';
import { AuthGuard, OptionalAuthGuard } from '../guards';
import { RequestId, SessionId } from '../req-decorators';
import { CreatePollDto, VotePollDto } from '../dtos';
import {
  CreatePollService,
  GetPollListService,
  VotePollService,
} from '../../../application/handler/poll';
import {
  SwaggerCreatePoll,
  SwaggerGetPolls,
  SwaggerVotePoll,
} from '../swagger/decorators/polls';
import { PollDto, PollListDto } from '../../dtos';

@ApiTags('Poll')
@Controller('/v1/polls')
@UseFilters(new HttpExceptionFilter())
export class PollController {
  constructor(
    private readonly logger: PinoLogger,
    private readonly createPollService: CreatePollService,
    private readonly getPollListService: GetPollListService,
    private readonly votePollService: VotePollService,
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
  @UseGuards(OptionalAuthGuard)
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

  @Post('/:pollId/vote')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  @SwaggerVotePoll()
  async votePoll(
    @Body() votePollDto: VotePollDto,
    @Param('pollId') pollId: string,
    @SessionId() sessionId: string,
    @RequestId() requestId: string,
  ): Promise<PollDto> {
    try {
      this.logger.info(
        `[PollController] [votePoll] - x-request-id:${requestId}`,
      );

      const poll = await this.votePollService.vote(
        sessionId,
        votePollDto,
        pollId,
        requestId,
      );

      return poll;
    } catch (error) {
      this.logger.error(
        `[PollController] [votePoll] - x-request-id:${requestId}, error ${error}`,
      );

      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }
}
