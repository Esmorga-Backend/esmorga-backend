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
import { GET_EVENTS_RESPONSES } from '../swagger';

@Controller('/v1/events')
@ApiTags('Event')
export class EventController {
  constructor(private readonly getEventListService: GetEventListService) {}

  @Get('/')
  @UseFilters(new HttpExceptionFilter())
  @ApiOperation({ summary: 'Return a list of avaliable events' })
  @ApiResponse(GET_EVENTS_RESPONSES.OK)
  @ApiInternalServerErrorResponse(GET_EVENTS_RESPONSES.INTERNAL_ERROR)
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
