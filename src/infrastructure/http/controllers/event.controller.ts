import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  InternalServerErrorException,
  Patch,
  Post,
  UseFilters,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';
import {
  CreateEventService,
  GetEventListService,
  UpdateEventService,
} from '../../../application/handler/event';
import { HttpExceptionFilter } from '../errors';
import {
  SwaggerCreateEvent,
  SwaggerGetEvents,
  SwaggerUpdateEvent,
} from '../swagger/decorators/events';
import { EventDto, EventListDto } from '../../dtos';
import { CreateEventDto, UpdateEventDto } from '../dtos';
import { RequestId } from '../req-decorators';

@ApiTags('Event')
@Controller('/v1/events')
@UseFilters(new HttpExceptionFilter())
export class EventController {
  constructor(
    private readonly logger: PinoLogger,
    private readonly getEventListService: GetEventListService,
    private readonly createEventService: CreateEventService,
    private readonly updateEventService: UpdateEventService,
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

  @Patch('/')
  @SwaggerUpdateEvent()
  async updateEvent(
    @Body() updateEventDto: UpdateEventDto, //TODO: meter dto
    @Headers('Authorization') accessToken: string,
    @RequestId() requestId: string,
    // ): Promise<EventDto> {
  ) {
    try {
      this.logger.info(
        `[EventController] [updateEvent] - x-request-id:${requestId}`,
      );
      // const accessToken =
      //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiNjY2YWMyNzBjODlmNWE1Y2FiMGI0NTM2IiwiaWF0IjoxNzE4Nzk0NjQwLCJleHAiOjE3MTg3OTUyNDB9.Kklm7nK5RgobEz_V1Eiqc5fTt33w2KNKByjU7V2M4aE';

      //TODO: El accesToken validado en la pr de Abrodos

      // const response: EventDto = await this.updateEventService.update(
      //   accessToken,
      //   updateEventDto,
      //   requestId,
      // );

      // const response = await this.updateEventService.update(
      //   accessToken,
      //   updateEventDto,
      //   requestId,
      // );

      return 'Hola';
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
}
