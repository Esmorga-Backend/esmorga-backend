import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  InternalServerErrorException,
  Post,
  UseFilters,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
    private readonly getEventListService: GetEventListService,
    private readonly createEventService: CreateEventService,
  ) {}

  @Get('/')
  @SwaggerGetEvents()
  async getEvents(): Promise<EventListDto> {
    try {
      const response: EventListDto = await this.getEventListService.find();

      return response;
    } catch (error) {
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
  ): Promise<Record<string, never>> {
    try {
      await this.createEventService.create(createEventDto);
      return {};
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }
}
