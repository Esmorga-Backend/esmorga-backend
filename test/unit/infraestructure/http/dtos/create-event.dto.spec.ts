import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateEventDto } from '../../../../../src/infraestructure/http/dtos';
import {
  createEventMock,
  createEventWithoutOptionalFieldsMock,
} from '../../../../mocks/dtos';

describe('[unit-test] [CreateEventDto]', () => {
  it('Should validate all fields successfully (required and optional)', async () => {
    const createEventDto = plainToInstance(CreateEventDto, createEventMock);

    const errors = await validate(createEventDto, { stopAtFirstError: true });

    expect(errors.length).toBe(0);
  });

  it('Should validate all fields successfully', async () => {
    const createEventDto = plainToInstance(
      CreateEventDto,
      createEventWithoutOptionalFieldsMock,
    );

    const errors = await validate(createEventDto, { stopAtFirstError: true });

    expect(errors.length).toBe(0);
  });

  describe('[CreateEventDto] [eventName]', () => {
    it('Should not accept empty value', async () => {
      const event = { ...createEventMock };

      delete event.eventName;

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('eventName');
      expect(errors[0].constraints).toEqual({
        isNotEmpty: 'eventName should not be empty',
      });
    });

    it('Should not accept less than 3 characters', async () => {
      const event = { ...createEventMock };

      event.eventName = 'AA';

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('eventName');
      expect(errors[0].constraints).toEqual({
        minLength: 'Min 3 characters',
      });
    });

    it('Should not accept more than 100 characters', async () => {
      const event = { ...createEventMock };

      event.eventName = 'A'.repeat(300);

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('eventName');
      expect(errors[0].constraints).toEqual({
        maxLength: 'Max 100 characters',
      });
    });

    it('Should only accept string values', async () => {
      const event = {
        eventName: 1345,
        eventDate: '2025-03-08T10:05:30.915Z',
        description: 'Hello World',
        eventType: 'PARTY',
        imageUrl: 'img.url',
        location: {
          lat: 43.35525182148881,
          long: -8.41937931298951,
          name: 'A Coruña',
        },
        tags: ['Meal', 'Music'],
      };

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('eventName');
      expect(errors[0].constraints).toEqual({
        isString: 'eventName must be a string',
      });
    });
  });

  describe('[CreateEventDto] [eventDate]', () => {
    it('Should not accept empty value', async () => {
      const event = { ...createEventMock };

      delete event.eventDate;

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('eventDate');
      expect(errors[0].constraints).toEqual({
        isNotEmpty: 'eventDate should not be empty',
      });
    });

    it('Should not accept past dates', async () => {
      const event = { ...createEventMock };

      event.eventDate = '2020-03-08T10:05:30.915Z';

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('eventDate');
      expect(errors[0].constraints).toEqual({
        customValidation: 'Date cannot be in the past',
      });
    });

    it('Should only accept ISO format', async () => {
      const event = { ...createEventMock };

      event.eventDate = '02-02-1996T03:04:05.000Z';

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('eventDate');
      expect(errors[0].constraints).toEqual({
        matches: 'Date must be in ISO format (yyyy-MM-ddTHH:mm:ss.SSSZ)',
      });
    });

    it('Should only accept string value', async () => {
      const event = {
        eventName: 'MongoFest',
        eventDate: 123,
        description: 'Hello World',
        eventType: 'PARTY',
        imageUrl: 'img.url',
        location: {
          lat: 43.35525182148881,
          long: -8.41937931298951,
          name: 'A Coruña',
        },
        tags: ['Meal', 'Music'],
      };

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('eventDate');
      expect(errors[0].constraints).toEqual({
        isString: 'eventDate must be a string',
      });
    });
  });

  describe('[CreateEventDto] [description]', () => {
    it('Should not accept empty value', async () => {
      const event = { ...createEventMock };

      delete event.description;

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('description');
      expect(errors[0].constraints).toEqual({
        isDefined: 'description should not be empty',
      });
    });

    it('Should not accept less than 1 characters', async () => {
      const event = { ...createEventMock };

      event.description = '';

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('description');
      expect(errors[0].constraints).toEqual({
        minLength: 'Min 1 characters',
      });
    });

    it('Should not accept more than 100 characters', async () => {
      const event = { ...createEventMock };

      event.description = 'A'.repeat(5001);

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('description');
      expect(errors[0].constraints).toEqual({
        maxLength: 'Max 5000 characters',
      });
    });

    it('Should only accept string value', async () => {
      const event = {
        eventName: 'MongoFest',
        eventDate: '2025-03-08T10:05:30.915Z',
        description: 123,
        eventType: 'PARTY',
        imageUrl: 'img.url',
        location: {
          lat: 43.35525182148881,
          long: -8.41937931298951,
          name: 'A Coruña',
        },
        tags: ['Meal', 'Music'],
      };

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('description');
      expect(errors[0].constraints).toEqual({
        isString: 'description must be a string',
      });
    });
  });

  describe('[CreateEventDto] [eventType]', () => {
    it('Should not accept empty value', async () => {
      const event = { ...createEventMock };

      delete event.eventType;

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('eventType');
      expect(errors[0].constraints).toEqual({
        isNotEmpty: 'eventType should not be empty',
      });
    });

    it('Should only accept string value', async () => {
      const event = {
        eventName: 'MongoFest',
        eventDate: '2025-03-08T10:05:30.915Z',
        description: 'Hello World',
        eventType: 123,
        imageUrl: 'img.url',
        location: {
          lat: 43.35525182148881,
          long: -8.41937931298951,
          name: 'A Coruña',
        },
        tags: ['Meal', 'Music'],
      };

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('eventType');
      expect(errors[0].constraints).toEqual({
        isString: 'eventType must be a string',
      });
    });

    it('Should only accept value predifined values', async () => {
      const event = {
        eventName: 'MongoFest',
        eventDate: '2025-03-08T10:05:30.915Z',
        description: 'Hello World',
        eventType: 'TEST',
        imageUrl: 'img.url',
        location: {
          lat: 43.35525182148881,
          long: -8.41937931298951,
          name: 'A Coruña',
        },
        tags: ['Meal', 'Music'],
      };

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('eventType');
      expect(errors[0].constraints).toEqual({
        isEnum:
          'eventType must be one of the following values: PARTY, SPORT, FOOD, CHARITY, GAMES',
      });
    });
  });
});
