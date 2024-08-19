import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateEventDto } from '../../../../../src/infrastructure/http/dtos';
import {
  CREATE_EVENT_MOCK,
  CREATE_EVENT_WITHOUT_OPTIONAL_FIELDS_MOCK,
} from '../../../../mocks/dtos';

describe('[unit-test] [CreateEventDto]', () => {
  it('Should validate all fields successfully (required and optional)', async () => {
    const createEventDto = plainToInstance(CreateEventDto, CREATE_EVENT_MOCK);

    const errors = await validate(createEventDto, { stopAtFirstError: true });

    expect(errors.length).toBe(0);
  });

  it('Should validate all fields successfully', async () => {
    const createEventDto = plainToInstance(
      CreateEventDto,
      CREATE_EVENT_WITHOUT_OPTIONAL_FIELDS_MOCK,
    );

    const errors = await validate(createEventDto, { stopAtFirstError: true });

    expect(errors.length).toBe(0);
  });

  describe('[CreateEventDto] [eventName]', () => {
    it('Should not accept empty value', async () => {
      const event = { ...CREATE_EVENT_MOCK };

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
      const event = { ...CREATE_EVENT_MOCK };

      event.eventName = 'AA';

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('eventName');
      expect(errors[0].constraints).toEqual({
        minLength: 'eventName must have min 3 characters',
      });
    });

    it('Should not accept more than 100 characters', async () => {
      const event = { ...CREATE_EVENT_MOCK };

      event.eventName = 'A'.repeat(300);

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('eventName');
      expect(errors[0].constraints).toEqual({
        maxLength: 'eventName must have max 100 characters',
      });
    });

    it('Should only accept string values', async () => {
      const event: any = { ...CREATE_EVENT_MOCK };

      event.eventName = 123;

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
      const event = { ...CREATE_EVENT_MOCK };

      delete event.eventDate;

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('eventDate');
      expect(errors[0].constraints).toEqual({
        isNotEmpty: 'eventDate should not be empty',
      });
    });

    it('Should not accept invalid dates', async () => {
      const event = { ...CREATE_EVENT_MOCK };

      event.eventDate = '2020-03-08T10:65:30.915Z';

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('eventDate');
      expect(errors[0].constraints).toEqual({
        customValidation: 'eventDate must be valid',
      });
    });

    it('Should not accept past dates', async () => {
      const event = { ...CREATE_EVENT_MOCK };

      event.eventDate = '2020-03-08T10:05:30.915Z';

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('eventDate');
      expect(errors[0].constraints).toEqual({
        customValidation: 'eventDate cannot be in the past',
      });
    });

    it('Should only accept ISO format', async () => {
      const event = { ...CREATE_EVENT_MOCK };

      event.eventDate = '02-02-1996T03:04:05.000Z';

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('eventDate');
      expect(errors[0].constraints).toEqual({
        matches: 'eventDate must be in ISO format (yyyy-MM-ddTHH:mm:ss.SSSZ)',
      });
    });

    it('Should only accept string value', async () => {
      const event: any = { ...CREATE_EVENT_MOCK };

      event.eventDate = 123;

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
      const event = { ...CREATE_EVENT_MOCK };

      delete event.description;

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('description');
      expect(errors[0].constraints).toEqual({
        isNotEmpty: 'description should not be empty',
      });
    });

    it('Should not accept more than 5000 characters', async () => {
      const event = { ...CREATE_EVENT_MOCK };

      event.description = 'A'.repeat(5001);

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('description');
      expect(errors[0].constraints).toEqual({
        maxLength: 'description must have max 5000 characters',
      });
    });

    it('Should not accept less than 4 characters', async () => {
      const event = { ...CREATE_EVENT_MOCK };

      event.description = 'a';

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('description');
      expect(errors[0].constraints).toEqual({
        minLength: 'description must have min 4 characters',
      });
    });

    it('Should only accept string value', async () => {
      const event: any = { ...CREATE_EVENT_MOCK };

      event.description = 123;

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
      const event = { ...CREATE_EVENT_MOCK };

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
      const event: any = { ...CREATE_EVENT_MOCK };

      event.eventType = 123;

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('eventType');
      expect(errors[0].constraints).toEqual({
        isString: 'eventType must be a string',
      });
    });

    it('Should only accept value predifined values', async () => {
      const event: any = { ...CREATE_EVENT_MOCK };

      event.eventType = 'INVALID EVENT TYPE';

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('eventType');
      expect(errors[0].constraints).toEqual({
        isEnum:
          'eventType must be one of the following values: Party, Sport, Food, Charity, Games',
      });
    });
  });

  describe('[CreateEventDto] [imageUrl]', () => {
    it('Should only accept string value', async () => {
      const event: any = { ...CREATE_EVENT_MOCK };

      event.imageUrl = 123;

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('imageUrl');
      expect(errors[0].constraints).toEqual({
        isString: 'imageUrl must be a string',
      });
    });

    it('Should not accept more than 500 characters', async () => {
      const event = { ...CREATE_EVENT_MOCK };

      event.imageUrl = 'A'.repeat(600);

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('imageUrl');
      expect(errors[0].constraints).toEqual({
        maxLength: 'imageUrl must have max 500 characters',
      });
    });
  });

  describe('[UpdateEventDto] [location]', () => {
    it('Should only accept an object', async () => {
      const event = JSON.parse(
        JSON.stringify({ ...CREATE_EVENT_MOCK, location: 123 }),
      );

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('location');
      expect(errors[0].constraints).toEqual({
        isObject: 'location must be an object',
      });
    });
  });

  describe('[CreateEventDto] [location] [name]', () => {
    it('Should not accept empty value', async () => {
      const event = JSON.parse(JSON.stringify(CREATE_EVENT_MOCK));

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

    it('Should not accept more than 100 characters', async () => {
      const event = JSON.parse(JSON.stringify(CREATE_EVENT_MOCK));

      event.location.name = 'A'.repeat(200);

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('location');
      expect(errors[0].children[0].property).toEqual('name');
      expect(errors[0].children[0].constraints).toEqual({
        maxLength: 'name must have max 100 characters',
      });
    });

    it('Should not accept less than 1 character', async () => {
      const event = JSON.parse(JSON.stringify(CREATE_EVENT_MOCK));

      event.location.name = '';

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('location');
      expect(errors[0].children[0].property).toEqual('name');
      expect(errors[0].children[0].constraints).toEqual({
        minLength: 'name must have min 1 character',
      });
    });

    it('Should only accept string values', async () => {
      const event = {
        eventName: 'Mobgen Fest',
        eventDate: '2025-03-08T10:05:30.915Z',
        description: 'Hello World',
        eventType: 'Party',
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
      const event = JSON.parse(JSON.stringify(CREATE_EVENT_MOCK));

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
      const event = JSON.parse(JSON.stringify(CREATE_EVENT_MOCK));

      event.location.lat = 'invalid type';

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
      const event = JSON.parse(JSON.stringify(CREATE_EVENT_MOCK));

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
      const event = JSON.parse(JSON.stringify(CREATE_EVENT_MOCK));

      event.location.long = 'invalid type';

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
    it('Should not accept less than 3 characters for each array field', async () => {
      const event = { ...CREATE_EVENT_MOCK };

      event.tags = ['AA'];

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('tags');
      expect(errors[0].constraints).toEqual({
        minLength: 'tags must have min 3 characters for each tag',
      });
    });

    it('Should not accept more than 25 characters for each array field', async () => {
      const event = { ...CREATE_EVENT_MOCK };

      event.tags = ['A'.repeat(30)];

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('tags');
      expect(errors[0].constraints).toEqual({
        maxLength: 'tags must have max 25 characters for each tag',
      });
    });

    it('Should not accept more than 10 different tags', async () => {
      const event = { ...CREATE_EVENT_MOCK };

      event.tags = [
        'AAA',
        'AAB',
        'AAC',
        'AAD',
        'AAE',
        'AAF',
        'AAG',
        'AAH',
        'AAI',
        'AAJ',
        'AAK',
      ];

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('tags');
      expect(errors[0].constraints).toEqual({
        arrayMaxSize: 'tags must have max 10 elements',
      });
    });

    it('Should only accept string values inside the array', async () => {
      const event = { ...CREATE_EVENT_MOCK, tags: [123] };

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('tags');
      expect(errors[0].constraints).toEqual({
        isString: 'each value in tags must be a string',
      });
    });

    it('Should only accept an array as tags field', async () => {
      const event = { ...CREATE_EVENT_MOCK, tags: 'invalid type' };

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
