import { HttpException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { GetEventListService } from '../../../src/application/handler/event';
import { Event } from '../../../src/domain/entities';
import { EventController } from '../../../src/infraestructure/http/controllers';
import { eventMock } from '../../mocks';

jest.mock('../../../src/application/handler/event');

describe('[unit-test] - EventController', () => {
  let eventControler: EventController;

  let getEventListService: GetEventListService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [EventController],
      providers: [GetEventListService],
    }).compile();

    eventControler = module.get<EventController>(EventController);
    getEventListService = module.get<GetEventListService>(GetEventListService);

    jest.clearAllMocks();
  });

  it('Controller and handlers should be defined', () => {
    expect(eventControler).toBeDefined();
    expect(getEventListService).toBeDefined();
  });

  describe('[getEvents] - Get event list', () => {
    it('Should return the data provided mapped', async () => {
      const events: Event[] = [eventMock];

      jest.spyOn(getEventListService, 'find').mockResolvedValue({
        totalEvents: 1,
        events,
      });

      const response = await eventControler.getEvents();

      expect(response).toEqual({ totalEvents: 1, events });
      expect(getEventListService.find).toHaveBeenCalled();
    });

    it('Should throw HttpException if error is HttpException type', async () => {
      const httpException = new HttpException('ForbiddenException', 403);

      jest.spyOn(getEventListService, 'find').mockRejectedValue(httpException);

      await expect(eventControler.getEvents()).rejects.toThrow(httpException);
      expect(getEventListService.find).toHaveBeenCalled();
    });
  });
});
