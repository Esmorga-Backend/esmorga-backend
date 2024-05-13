import {
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  UseFilters,
} from '@nestjs/common';
import { GetEventListService } from '../../../application/handler/event';
import { HttpExceptionFilter } from '../errors';

@Controller('/v1/events')
export class EventController {
  constructor(private readonly getEventListService: GetEventListService) {}

  // TODO add swagger decorators
  @Get('/')
  @UseFilters(new HttpExceptionFilter())
  async getEvents() {
    try {
      const response = await this.getEventListService.find();

      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }
}
