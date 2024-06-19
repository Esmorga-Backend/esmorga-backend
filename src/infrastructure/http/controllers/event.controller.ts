import {
  Headers,
  Body,
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  Post,
  UseFilters,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';
import {
  CreateEventService,
  GetEventListService,
} from '../../../application/handler/event';
import { HttpExceptionFilter } from '../errors';
import {
  SwaggerCreateEvent,
  SwaggerGetEvents,
} from '../swagger/decorators/events';
import { EventListDto } from '../../dtos';
import { CreateEventDto } from '../dtos';

@ApiTags('Event')
@Controller('/v1/events')
@UseFilters(new HttpExceptionFilter())
export class EventController {
  constructor(
    private readonly logger: PinoLogger,
    private readonly getEventListService: GetEventListService,
    private readonly createEventService: CreateEventService,
  ) {}

  @Get('/')
  @SwaggerGetEvents()
  async getEvents(
    @Headers('x-request-id') requestId: string,
  ): Promise<EventListDto> {
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
    @Headers('x-request-id') requestId: string,
  ): Promise<Record<string, never>> {
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
}
