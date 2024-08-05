import {
  Headers,
  Body,
  Controller,
  Get,
  Post,
  Delete,
  HttpException,
  InternalServerErrorException,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';
import {
  CreateEventService,
  GetEventListService,
  DeleteEventService,
} from '../../../application/handler/event';
import { HttpExceptionFilter } from '../filters';
import {
  SwaggerCreateEvent,
  SwaggerGetEvents,
} from '../swagger/decorators/events';
import { EventListDto } from '../../dtos';
import { CreateEventDto, JoinEventDto } from '../dtos';
import { RequestId } from '../req-decorators';
import { AuthGuard } from '../guards';

@ApiTags('Event')
@Controller('/v1/events')
@UseFilters(new HttpExceptionFilter())
export class EventController {
  constructor(
    private readonly logger: PinoLogger,
    private readonly getEventListService: GetEventListService,
    private readonly createEventService: CreateEventService,
    private readonly deleteEventService: DeleteEventService,
  ) {}

  @Get('/')
  @SwaggerGetEvents()
  async getEvents(@RequestId() requestId: string): Promise<EventListDto> {
    try {
      this.logger.info(
        `[EventController] [getEvents] - x-request-id:${requestId}`,
      );

      const response: EventListDto =
        await this.getEventListService.find(requestId);

      return response;
    } catch (error) {
      this.logger.error(
        `[EventController] [getEvents] - x-request-id:${requestId}, error ${error}`,
      );

      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  @Post('/')
  @SwaggerCreateEvent()
  async createEvent(
    @Body() createEventDto: CreateEventDto,
    @RequestId() requestId: string,
  ) {
    try {
      this.logger.info(
        `[EventController] [createEvent] - x-request-id:${requestId}`,
      );

      await this.createEventService.create(createEventDto, requestId);

      return {};
    } catch (error) {
      this.logger.error(
        `[EventController] [createEvent] - x-request-id:${requestId}, error ${error}`,
      );

      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  @Delete('/')
  @UseGuards(AuthGuard)
  @SwaggerCreateEvent()
  async deleteEvent(
    @Headers('Authorization') accessToken: string,
    @Body() joinEventDto: JoinEventDto,
    @RequestId() requestId: string,
  ) {
    try {
      // TODO change JoinEventDto
      this.logger.info(
        `[EventController] [deleteEvent] - x-request-id:${requestId}`,
      );

      await this.deleteEventService.delete(
        accessToken,
        joinEventDto.eventId,
        requestId,
      );

      return {};
    } catch (error) {
      this.logger.error(
        `[EventController] [deleteEvent] - x-request-id:${requestId}, error ${error}`,
      );

      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }
}
