import { HttpException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import {
  CreateEventService,
  GetEventListService,
} from '../../../src/application/handler/event';
import { EventListDto, EventDto } from '../../../src/infrastructure/dtos';
import { EventController } from '../../../src/infrastructure/http/controllers';
import { createEventMock, EVENT_MOCK } from '../../mocks/dtos';

jest.mock('../../../src/application/handler/event');

describe('[unit-test] - EventController', () => {
  let eventController: EventController;

  let createEventService: CreateEventService;
  let getEventListService: GetEventListService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [EventController],
      providers: [CreateEventService, GetEventListService],
    }).compile();

    eventController = module.get<EventController>(EventController);
    createEventService = module.get<CreateEventService>(CreateEventService);
    getEventListService = module.get<GetEventListService>(GetEventListService);

    jest.clearAllMocks();
  });

  it('Controller and handlers should be defined', () => {
    expect(eventController).toBeDefined();
    expect(createEventService).toBeDefined();
    expect(getEventListService).toBeDefined();
  });

  describe('[getEvents] - Get event list', () => {
    it('Should return the data provided mapped', async () => {
      const events: EventDto[] = [EVENT_MOCK];

      const eventList: EventListDto = {
        totalEvents: events.length,
        events: events,
      };

      jest.spyOn(getEventListService, 'find').mockResolvedValue(eventList);

      const response = await eventController.getEvents();

      expect(response).toEqual({ totalEvents: 1, events });
      expect(getEventListService.find).toHaveBeenCalled();
    });

    it('Should throw HttpException if error is HttpException type', async () => {
      const httpException = new HttpException('ForbiddenException', 403);

      jest.spyOn(getEventListService, 'find').mockRejectedValue(httpException);

      await expect(eventController.getEvents()).rejects.toThrow(httpException);
      expect(getEventListService.find).toHaveBeenCalled();
    });
  });

  describe('[createEvent] - Create a new event', () => {
    it('Should return an empty object', async () => {
      jest.spyOn(createEventService, 'create').mockResolvedValue();
      const response = await eventController.createEvent(createEventMock);

      expect(response).toEqual({});
      expect(createEventService.create).toHaveBeenCalled();
    });

    it('Should throw HttpException if error is HttpException type', async () => {
      const httpException = new HttpException('ForbiddenException', 403);

      jest.spyOn(createEventService, 'create').mockRejectedValue(httpException);

      await expect(
        eventController.createEvent(createEventMock),
      ).rejects.toThrow(httpException);
      expect(createEventService.create).toHaveBeenCalled();
    });
  });
});
