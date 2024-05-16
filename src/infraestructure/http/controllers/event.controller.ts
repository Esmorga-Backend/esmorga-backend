import {
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  UseFilters,
} from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetEventListService } from '../../../application/handler/event';
import { HttpExceptionFilter } from '../errors';
import { SwaggerGetEvents } from '../swagger/decorators/events';

@Controller('/v1/events')
@ApiTags('Event')
export class EventController {
  constructor(private readonly getEventListService: GetEventListService) {}

  @Get('/')
  @UseFilters(new HttpExceptionFilter())
  @SwaggerGetEvents()
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
