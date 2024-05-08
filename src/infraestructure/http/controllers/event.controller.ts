import { Controller, Get } from '@nestjs/common';
import { GetEventListService } from '../../../application/event';

@Controller('/v1')
export class EventController {
  constructor(private readonly getEventListService: GetEventListService) {}

  // TODO add swagger decorators
  // TODO implement error filter
  @Get('/getEvents')
  async getEvents() {
    try {
      return this.getEventListService.find();
    } catch (error) {
      throw error;
    }
  }
}
