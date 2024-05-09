import { Controller, Get, UseFilters } from '@nestjs/common';
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
      return this.getEventListService.find();
    } catch (error) {
      throw error;
    }
  }
}
