import {
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  UseFilters,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetEventListService } from '../../../application/handler/event';
import { HttpExceptionFilter } from '../errors';
import { SwaggerGetEvents } from '../swagger/decorators/events';
import { EventListDTO } from '../../dtos';

@Controller('/v1/events')
@ApiTags('Event')
export class EventController {
  constructor(private readonly getEventListService: GetEventListService) {}

  @Get('/')
  @UseFilters(new HttpExceptionFilter())
  @SwaggerGetEvents()
  async getEvents(): Promise<EventListDTO> {
    try {
      const response: EventListDTO = await this.getEventListService.find();

      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }
}
