import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Delete,
  HttpException,
  InternalServerErrorException,
  Patch,
  UseFilters,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';
import {
  CreateEventService,
  GetEventListService,
  UpdateEventService,
  DeleteEventService,
} from '../../../application/handler/event';
import { HttpExceptionFilter } from '../errors';
import {
  SwaggerCreateEvent,
  SwaggerGetEvents,
  SwaggerUpdateEvent,
  SwaggerDeleteEvents,
} from '../swagger/decorators/events';
import { EventDto, EventListDto } from '../../dtos';
import { CreateEventDto, UpdateEventDto, EventIdDto } from '../dtos';
import { RequestId } from '../req-decorators';
import { AuthGuard } from '../guards';
import { validateNotNullableFields } from '../services';

@ApiTags('Event')
@Controller('/v1/events')
@UseFilters(new HttpExceptionFilter())
export class EventController {
  constructor(
    private readonly logger: PinoLogger,
    private readonly getEventListService: GetEventListService,
    private readonly createEventService: CreateEventService,
    private readonly updateEventService: UpdateEventService,
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
  @UseGuards(AuthGuard)
  @SwaggerCreateEvent()
  async createEvent(
    @Body() createEventDto: CreateEventDto,
    @Headers('Authorization') accessToken: string,
    @RequestId() requestId: string,
  ) {
    try {
      this.logger.info(
        `[EventController] [createEvent] - x-request-id:${requestId}`,
      );

      await this.createEventService.create(
        accessToken,
        createEventDto,
        requestId,
      );

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

  @Patch('/')
  @UseGuards(AuthGuard)
  @SwaggerUpdateEvent()
  async updateEvent(
    @Body() updateEventDto: UpdateEventDto,
    @Headers('Authorization') accessToken: string,
    @RequestId() requestId: string,
  ): Promise<EventDto> {
    try {
      this.logger.info(
        `[EventController] [updateEvent] - x-request-id:${requestId}`,
      );
      const { eventName, eventDate, description, eventType, location } =
        updateEventDto;

      const updatedLocation =
        location !== null
          ? {
              name: location?.name === null ? null : location?.name,
            }
          : null;

      const fieldsToValidate = {
        eventName,
        eventDate,
        description,
        eventType,
        location: updatedLocation,
      };

      validateNotNullableFields(fieldsToValidate);

      const response: EventDto = await this.updateEventService.update(
        accessToken,
        updateEventDto,
        requestId,
      );

      return response;
    } catch (error) {
      this.logger.error(
        `[EventController] [updateEvent] - x-request-id:${requestId}, error ${error}`,
      );
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  @Delete('/')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  @SwaggerDeleteEvents()
  async deleteEvent(
    @Headers('Authorization') accessToken: string,
    @Body() joinEventDto: EventIdDto,
    @RequestId() requestId: string,
  ) {
    try {
      this.logger.info(
        `[EventController] [deleteEvent] - x-request-id:${requestId}`,
      );

      await this.deleteEventService.delete(
        accessToken,
        joinEventDto.eventId,
        requestId,
      );
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
