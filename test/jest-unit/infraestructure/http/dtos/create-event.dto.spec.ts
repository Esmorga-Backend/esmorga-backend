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

    it('Should accept the minimum 3 characters allowed', async () => {
      const event = { ...createEventMock };

      event.eventName = 'AAA';

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toBe(0);
    });

    it('Should accept the maximum 100 characters allowed', async () => {
      const event = { ...createEventMock };

      event.eventName = 'A'.repeat(100);

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toBe(0);
    });

    it('Should not accept less than 3 characters', async () => {
      const event = { ...createEventMock };

      event.eventName = 'AA';

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('eventName');
      expect(errors[0].constraints).toEqual({
        minLength: 'min 3 characters',
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
        maxLength: 'max 100 characters',
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

    it('Should accept the minimum 1 character allowed', async () => {
      const event = { ...createEventMock };

      event.description = 'A';

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toBe(0);
    });

    it('Should accept the maximum 5000 character allowed', async () => {
      const event = { ...createEventMock };

      event.description = 'A'.repeat(5000);

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toBe(0);
    });

    it('Should not accept less than 1 characters', async () => {
      const event = { ...createEventMock };

      event.description = '';

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('description');
      expect(errors[0].constraints).toEqual({
        minLength: 'min 1 characters',
      });
    });

    it('Should not accept more than 5000 characters', async () => {
      const event = { ...createEventMock };

      event.description = 'A'.repeat(5001);

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('description');
      expect(errors[0].constraints).toEqual({
        maxLength: 'max 5000 characters',
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

  describe('[CreateEventDto] [imageUrl]', () => {
    it('Should only accept string value', async () => {
      const event = {
        eventName: 'MongoFest',
        eventDate: '2025-03-08T10:05:30.915Z',
        description: 'Hello world',
        eventType: 'PARTY',
        imageUrl: 123,
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
      expect(errors[0].property).toEqual('imageUrl');
      expect(errors[0].constraints).toEqual({
        isString: 'imageUrl must be a string',
      });
    });

    it('Should accept the maximum 500 characters allowed', async () => {
      const event = { ...createEventMock };

      event.imageUrl = 'A'.repeat(500);

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toBe(0);
    });

    it('Should not accept more than 500 characters', async () => {
      const event = { ...createEventMock };

      event.imageUrl = 'A'.repeat(600);

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('imageUrl');
      expect(errors[0].constraints).toEqual({
        maxLength: 'max 500 characters',
      });
    });
  });

  describe('[CreateEventDto] [location] [name]', () => {
    it('Should not accept empty value', async () => {
      const event = JSON.parse(JSON.stringify(createEventMock));

      delete event.location.name;

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('location');
      expect(errors[0].children[0].property).toEqual('name');
      expect(errors[0].children[0].constraints).toEqual({
        isDefined: 'name should not be empty',
      });
    });

    it('Should accept the minimum 1 character allowed', async () => {
      const event = { ...createEventMock };

      event.location.name = 'A';

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toBe(0);
    });

    it('Should accept the maximum 100 characters allowed', async () => {
      const event = { ...createEventMock };

      event.eventName = 'A'.repeat(100);

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toBe(0);
    });

    it('Should not accept less than 1 character', async () => {
      const event = JSON.parse(JSON.stringify(createEventMock));

      event.location.name = '';

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('location');
      expect(errors[0].children[0].property).toEqual('name');
      expect(errors[0].children[0].constraints).toEqual({
        minLength: 'min 1 characters',
      });
    });

    it('Should not accept more than 100 characters', async () => {
      const event = JSON.parse(JSON.stringify(createEventMock));

      event.location.name = 'A'.repeat(200);

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('location');
      expect(errors[0].children[0].property).toEqual('name');
      expect(errors[0].children[0].constraints).toEqual({
        maxLength: 'max 100 characters',
      });
    });

    it('Should only accept string values', async () => {
      const event = {
        eventName: 'Mobgen Fest',
        eventDate: '2025-03-08T10:05:30.915Z',
        description: 'Hello World',
        eventType: 'PARTY',
        imageUrl: 'img.url',
        location: {
          lat: 43.35525182148881,
          long: -8.41937931298951,
          name: 123,
        },
        tags: ['Meal', 'Music'],
      };

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('location');
      expect(errors[0].children[0].property).toEqual('name');
      expect(errors[0].children[0].constraints).toEqual({
        isString: 'name must be a string',
      });
    });
  });

  describe('[CreateEventDto] [location] [lat]', () => {
    it('Should not accept empty value if location.long is defined', async () => {
      const event = JSON.parse(JSON.stringify(createEventMock));

      delete event.location.lat;

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('location');
      expect(errors[0].children[0].property).toEqual('lat');
      expect(errors[0].children[0].constraints).toEqual({
        isNotEmpty: 'lat must be defined if long is already define',
      });
    });

    it('Should only accept numbers as value', async () => {
      const event = {
        eventName: 'MobgenFest',
        eventDate: '2025-03-08T10:05:30.915Z',
        description: 'Hello World',
        eventType: 'PARTY',
        imageUrl: 'img.url',
        location: {
          lat: 'test',
          long: -8.41937931298951,
          name: 'A Coruña',
        },
        tags: ['Meal', 'Music'],
      };

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('location');
      expect(errors[0].children[0].property).toEqual('lat');
      expect(errors[0].children[0].constraints).toEqual({
        isNumber: 'lat must be a number',
      });
    });
  });

  describe('[CreateEventDto] [location] [long]', () => {
    it('Should not accept empty value if location.lat is defined', async () => {
      const event = JSON.parse(JSON.stringify(createEventMock));

      delete event.location.long;

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('location');
      expect(errors[0].children[0].property).toEqual('long');
      expect(errors[0].children[0].constraints).toEqual({
        isNotEmpty: 'long must be defined if lat is already define',
      });
    });

    it('Should only accept numbers as value', async () => {
      const event = {
        eventName: 'MobgenFest',
        eventDate: '2025-03-08T10:05:30.915Z',
        description: 'Hello World',
        eventType: 'PARTY',
        imageUrl: 'img.url',
        location: {
          lat: -8.41937931298951,
          long: 'test',
          name: 'A Coruña',
        },
        tags: ['Meal', 'Music'],
      };

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('location');
      expect(errors[0].children[0].property).toEqual('long');
      expect(errors[0].children[0].constraints).toEqual({
        isNumber: 'long must be a number',
      });
    });
  });

  describe('[CreateEventDto] [tags]', () => {
    it('Should accept the minimum 3 characters allowed for each array field', async () => {
      const event = { ...createEventMock };

      event.tags = ['AAA'];

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toBe(0);
    });

    it('Should accept the maximum 25 characters allowed for each array field', async () => {
      const event = { ...createEventMock };

      event.tags = ['A'.repeat(25)];

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toBe(0);
    });

    it('Should not accept less than 3 characters for each array field', async () => {
      const event = { ...createEventMock };

      event.tags = ['AA'];

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('tags');
      expect(errors[0].constraints).toEqual({
        minLength: 'min 3 characters for each tag',
      });
    });

    it('Should not accept more than 25 characters for each array field', async () => {
      const event = { ...createEventMock };

      event.tags = ['A'.repeat(30)];

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('tags');
      expect(errors[0].constraints).toEqual({
        maxLength: 'max 25 characters for each tag',
      });
    });

    it('Should not accept more than 10 different tags', async () => {
      const event = {
        eventName: 'MobgenFest',
        eventDate: '2025-03-08T10:05:30.915Z',
        description: 'Hello World',
        eventType: 'PARTY',
        imageUrl: 'img.url',
        location: {
          lat: 43.35525182148881,
          long: -8.41937931298951,
          name: 'A Coruña',
        },
        tags: [
          'AAA',
          'AAB',
          'AAC',
          'AAD',
          'AAF',
          'AAG',
          'AAH',
          'AAI',
          'AAJ',
          'AAK',
          'AAAA',
        ],
      };

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('tags');
      expect(errors[0].constraints).toEqual({
        arrayMaxSize: 'max 10 elements in tags',
      });
    });

    it('Should only accept string values inside the array', async () => {
      const event = {
        eventName: 'MobgenFest',
        eventDate: '2025-03-08T10:05:30.915Z',
        description: 'Hello World',
        eventType: 'PARTY',
        imageUrl: 'img.url',
        location: {
          lat: 43.35525182148881,
          long: -8.41937931298951,
          name: 'A Coruña',
        },
        tags: [134],
      };

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('tags');
      expect(errors[0].constraints).toEqual({
        isString: 'each value in tags must be a string',
      });
    });

    it('Should only accept an array as tags field', async () => {
      const event = {
        eventName: 'MobgenFest',
        eventDate: '2025-03-08T10:05:30.915Z',
        description: 'Hello World',
        eventType: 'PARTY',
        imageUrl: 'img.url',
        location: {
          lat: 43.35525182148881,
          long: -8.41937931298951,
          name: 'A Coruña',
        },
        tags: 'test',
      };

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('tags');
      expect(errors[0].constraints).toEqual({
        isArray: 'tags must be an array',
      });
    });
  });
});
