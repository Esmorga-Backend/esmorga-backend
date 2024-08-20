import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { validateNotNullableFields } from '../../../../../src/infrastructure/http/services';
import { InvalidNullFieldApiError } from '../../../../../src/infrastructure/http/errors';
import { UpdateEventDto } from '../../../../../src/infrastructure/http/dtos';
import {
  UPDATE_EVENT_MOCK,
  UPDATE_EVENT_WITHOUT_OPTIONAL_FIELDS_MOCK,
} from '../../../../mocks/dtos';

describe('[unit-test] [UpdateEventDto]', () => {
  it('Should validate all fields successfully (required and optional)', async () => {
    const updateEventDto = plainToInstance(UpdateEventDto, UPDATE_EVENT_MOCK);

    const errors = await validate(updateEventDto, { stopAtFirstError: true });

    expect(errors.length).toBe(0);
  });

  it('Should validate all fields successfully', async () => {
    const updateEventDto = plainToInstance(
      UpdateEventDto,
      UPDATE_EVENT_WITHOUT_OPTIONAL_FIELDS_MOCK,
    );

    const errors = await validate(updateEventDto, { stopAtFirstError: true });

    expect(errors.length).toBe(0);
  });

  describe('[UpdateEventDto] [eventId]', () => {
    it('Should not accept empty value', async () => {
      const event = { ...UPDATE_EVENT_MOCK };

      delete event.eventId;

      const updateEventDto = plainToInstance(UpdateEventDto, event);

      const errors = await validate(updateEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('eventId');
      expect(errors[0].constraints).toEqual({
        isNotEmpty: 'eventId should not be empty',
      });
    });
  });

  describe('[UpdateEventDto] [eventName]', () => {
    it('Should not accept null value', async () => {
      const event = { ...UPDATE_EVENT_MOCK, eventName: null };

      const updateEventDto = plainToInstance(UpdateEventDto, event);

      try {
        validateNotNullableFields(updateEventDto);
        fail('Expected InvalidNullFieldApiError to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidNullFieldApiError);
        expect(error.message).toBe('eventName should not be empty');
      }
    });

    it('Should not accept less than 3 characters', async () => {
      const event = { ...UPDATE_EVENT_MOCK };

      event.eventName = 'AA';

      const updateEventDto = plainToInstance(UpdateEventDto, event);

      const errors = await validate(updateEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('eventName');
      expect(errors[0].constraints).toEqual({
        minLength: 'eventName must have min 3 characters',
      });
    });

    it('Should not accept more than 100 characters', async () => {
      const event = { ...UPDATE_EVENT_MOCK };

      event.eventName = 'A'.repeat(101);

      const updateEventDto = plainToInstance(UpdateEventDto, event);

      const errors = await validate(updateEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('eventName');
      expect(errors[0].constraints).toEqual({
        maxLength: 'eventName must have max 100 characters',
      });
    });

    it('Should only accept string values', async () => {
      const event: any = { ...UPDATE_EVENT_MOCK };

      event.eventName = 123;

      const updateEventDto = plainToInstance(UpdateEventDto, event);

      const errors = await validate(updateEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('eventName');
      expect(errors[0].constraints).toEqual({
        isString: 'eventName must be a string',
      });
    });
  });

  describe('[UpdateEventDto] [eventDate]', () => {
    it('Should not accept null value', async () => {
      const event = { ...UPDATE_EVENT_MOCK, eventDate: null };

      const updateEventDto = plainToInstance(UpdateEventDto, event);

      try {
        validateNotNullableFields(updateEventDto);
        fail('Expected InvalidNullFieldApiError to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidNullFieldApiError);
        expect(error.message).toBe('eventDate should not be empty');
      }
    });

    it('Should not accept invalid dates', async () => {
      const event = { ...UPDATE_EVENT_MOCK };

      event.eventDate = '2025-03-08T10:65:30.915Z';

      const updateEventDto = plainToInstance(UpdateEventDto, event);

      const errors = await validate(updateEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('eventDate');
      expect(errors[0].constraints).toEqual({
        customValidation: 'eventDate must be valid',
      });
    });

    it('Should not accept past dates', async () => {
      const event = { ...UPDATE_EVENT_MOCK };

      event.eventDate = '2020-03-08T10:05:30.915Z';

      const updateEventDto = plainToInstance(UpdateEventDto, event);

      const errors = await validate(updateEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('eventDate');
      expect(errors[0].constraints).toEqual({
        customValidation: 'eventDate cannot be in the past',
      });
    });

    it('Should only accept ISO format', async () => {
      const event = { ...UPDATE_EVENT_MOCK };

      event.eventDate = '02-02-1996T03:04:05.000Z';

      const updateEventDto = plainToInstance(UpdateEventDto, event);

      const errors = await validate(updateEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('eventDate');
      expect(errors[0].constraints).toEqual({
        matches: 'eventDate must be in ISO format (yyyy-MM-ddTHH:mm:ss.SSSZ)',
      });
    });

    it('Should only accept string value', async () => {
      const event: any = { ...UPDATE_EVENT_MOCK };

      event.eventDate = 123;

      const updateEventDto = plainToInstance(UpdateEventDto, event);

      const errors = await validate(updateEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('eventDate');
      expect(errors[0].constraints).toEqual({
        isString: 'eventDate must be a string',
      });
    });
  });

  describe('[UpdateEventDto] [description]', () => {
    it('Should not accept null value', async () => {
      const event = { ...UPDATE_EVENT_MOCK, description: null };

      const updateEventDto = plainToInstance(UpdateEventDto, event);

      try {
        validateNotNullableFields(updateEventDto);
        fail('Expected InvalidNullFieldApiError to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidNullFieldApiError);
        expect(error.message).toBe('description should not be empty');
      }
    });

    it('Should not accept less than 4 characters', async () => {
      const event = { ...UPDATE_EVENT_MOCK };

      event.description = 'a';

      const updateEventDto = plainToInstance(UpdateEventDto, event);

      const errors = await validate(updateEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('description');
      expect(errors[0].constraints).toEqual({
        minLength: 'description must have min 4 characters',
      });
    });

    it('Should not accept more than 5000 characters', async () => {
      const event = { ...UPDATE_EVENT_MOCK };

      event.description = 'A'.repeat(5001);

      const updateEventDto = plainToInstance(UpdateEventDto, event);

      const errors = await validate(updateEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('description');
      expect(errors[0].constraints).toEqual({
        maxLength: 'description must have max 5000 characters',
      });
    });

    it('Should only accept string value', async () => {
      const event: any = { ...UPDATE_EVENT_MOCK };

      event.description = 123;

      const updateEventDto = plainToInstance(UpdateEventDto, event);

      const errors = await validate(updateEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('description');
      expect(errors[0].constraints).toEqual({
        isString: 'description must be a string',
      });
    });
  });

  describe('[UpdateEventDto] [eventType]', () => {
    it('Should not accept empty value', async () => {
      const event = { ...UPDATE_EVENT_MOCK, evenType: null };

      const updateEventDto = plainToInstance(UpdateEventDto, event);

      try {
        validateNotNullableFields(updateEventDto);
        fail('Expected InvalidNullFieldApiError to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidNullFieldApiError);
        expect(error.message).toBe('evenType should not be empty');
      }
    });

    it('Should only accept string value', async () => {
      const event: any = { ...UPDATE_EVENT_MOCK };

      event.eventType = 123;

      const updateEventDto = plainToInstance(UpdateEventDto, event);

      const errors = await validate(updateEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('eventType');
      expect(errors[0].constraints).toEqual({
        isString: 'eventType must be a string',
      });
    });

    it('Should only accept value predifined values', async () => {
      const event: any = { ...UPDATE_EVENT_MOCK };

      event.eventType = 'INVALID EVENT TYPE';

      const updateEventDto = plainToInstance(UpdateEventDto, event);

      const errors = await validate(updateEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('eventType');
      expect(errors[0].constraints).toEqual({
        isEnum:
          'eventType must be one of the following values: Party, Sport, Food, Charity, Games',
      });
    });
  });

  describe('[UpdateEventDto] [imageUrl]', () => {
    it('Should accept null value', async () => {
      const event = { ...UPDATE_EVENT_MOCK, imageUrl: null };

      const updateEventDto = plainToInstance(UpdateEventDto, event);

      const errors = await validate(updateEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(0);
    });

    it('Should only accept string value', async () => {
      const event: any = { ...UPDATE_EVENT_MOCK };

      event.imageUrl = 123;

      const updateEventDto = plainToInstance(UpdateEventDto, event);

      const errors = await validate(updateEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('imageUrl');
      expect(errors[0].constraints).toEqual({
        isString: 'imageUrl must be a string',
      });
    });

    it('Should not accept more than 500 characters', async () => {
      const event = { ...UPDATE_EVENT_MOCK };

      event.imageUrl = 'A'.repeat(501);

      const updateEventDto = plainToInstance(UpdateEventDto, event);

      const errors = await validate(updateEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('imageUrl');
      expect(errors[0].constraints).toEqual({
        maxLength: 'imageUrl must have max 500 characters',
      });
    });
  });

  describe('[UpdateEventDto] [location]', () => {
    it('Should not accept null value', async () => {
      const event = JSON.parse(
        JSON.stringify({ ...UPDATE_EVENT_MOCK, location: null }),
      );

      const updateEventDto = plainToInstance(UpdateEventDto, event);

      try {
        validateNotNullableFields(updateEventDto);
        fail('Expected InvalidNullFieldApiError to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidNullFieldApiError);
        expect(error.message).toBe('location should not be empty');
      }
    });

    it('Should not accept an empty object', async () => {
      const event = JSON.parse(
        JSON.stringify({ ...UPDATE_EVENT_MOCK, location: {} }),
      );

      const updateEventDto = plainToInstance(UpdateEventDto, event);

      const errors = await validate(updateEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('location');
      expect(errors[0].constraints).toEqual({
        customValidation: 'location should not be empty',
      });
    });

    it('Should only accept an object', async () => {
      const event = JSON.parse(
        JSON.stringify({ ...UPDATE_EVENT_MOCK, location: 123 }),
      );

      const updateEventDto = plainToInstance(UpdateEventDto, event);

      const errors = await validate(updateEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('location');
      expect(errors[0].constraints).toEqual({
        isObject: 'location must be an object',
      });
    });
  });

  describe('[UpdateEventDto] [location] [name]', () => {
    it('Should not accept null value', async () => {
      const event = JSON.parse(
        JSON.stringify({ ...UPDATE_EVENT_MOCK, location: { name: null } }),
      );
      const updateEventDto = plainToInstance(UpdateEventDto, event);

      try {
        validateNotNullableFields(updateEventDto);
        fail('Expected InvalidNullFieldApiError to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidNullFieldApiError);
        expect(error.message).toBe('name should not be empty');
      }
    });

    it('Should not accept more than 100 characters', async () => {
      const event = JSON.parse(JSON.stringify(UPDATE_EVENT_MOCK));

      event.location.name = 'A'.repeat(200);

      const updateEventDto = plainToInstance(UpdateEventDto, event);

      const errors = await validate(updateEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('location');
      expect(errors[0].children[0].property).toEqual('name');
      expect(errors[0].children[0].constraints).toEqual({
        maxLength: 'name must have max 100 characters',
      });
    });

    it('Should not accept less than 1 character', async () => {
      const event = JSON.parse(
        JSON.stringify({ ...UPDATE_EVENT_MOCK, location: { name: '' } }),
      );

      const updateEventDto = plainToInstance(UpdateEventDto, event);

      const errors = await validate(updateEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('location');
      expect(errors[0].children[0].property).toEqual('name');
      expect(errors[0].children[0].constraints).toEqual({
        minLength: 'name must have min 1 character',
      });
    });

    it('Should only accept string values', async () => {
      const event = JSON.parse(
        JSON.stringify({ ...UPDATE_EVENT_MOCK, location: { name: 123 } }),
      );

      const updateEventDto = plainToInstance(UpdateEventDto, event);

      const errors = await validate(updateEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('location');
      expect(errors[0].children[0].property).toEqual('name');
      expect(errors[0].children[0].constraints).toEqual({
        isString: 'name must be a string',
      });
    });
  });

  describe('[UpdateEventDto] [location] [lat]', () => {
    it('Should not accept null value if location.long is defined', async () => {
      const event = JSON.parse(
        JSON.stringify({ ...UPDATE_EVENT_MOCK, location: { lat: null } }),
      );

      const updateEventDto = plainToInstance(UpdateEventDto, event);

      try {
        validateNotNullableFields(updateEventDto);
        fail('Expected InvalidNullFieldApiError to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidNullFieldApiError);
        expect(error.message).toBe('lat should not be empty');
      }
    });

    it('Should only accept numbers as value', async () => {
      const event = JSON.parse(JSON.stringify(UPDATE_EVENT_MOCK));

      event.location.lat = 'invalid type';

      const updateEventDto = plainToInstance(UpdateEventDto, event);

      const errors = await validate(updateEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('location');
      expect(errors[0].children[0].property).toEqual('lat');
      expect(errors[0].children[0].constraints).toEqual({
        isNumber: 'lat must be a number',
      });
    });
  });

  describe('[UpdateEventDto] [location] [long]', () => {
    it('Should accept null value if location.lat is also defined as null', async () => {
      const event = JSON.parse(
        JSON.stringify({
          ...UPDATE_EVENT_MOCK,
        }),
      );
      event.location.lat = null;
      event.location.long = null;

      const updateEventDto = plainToInstance(UpdateEventDto, event);

      const errors = await validate(updateEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(0);
    });

    it('Should not accept null value if location.lat is defined', async () => {
      const event = JSON.parse(
        JSON.stringify({ ...UPDATE_EVENT_MOCK, location: { long: null } }),
      );

      const updateEventDto = plainToInstance(UpdateEventDto, event);

      try {
        validateNotNullableFields(updateEventDto);
        fail('Expected InvalidNullFieldApiError to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidNullFieldApiError);
        expect(error.message).toBe('long should not be empty');
      }
    });

    it('Should only accept numbers as value', async () => {
      const event = JSON.parse(JSON.stringify(UPDATE_EVENT_MOCK));

      event.location.long = 'invalid type';

      const updateEventDto = plainToInstance(UpdateEventDto, event);

      const errors = await validate(updateEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('location');
      expect(errors[0].children[0].property).toEqual('long');
      expect(errors[0].children[0].constraints).toEqual({
        isNumber: 'long must be a number',
      });
    });
  });

  describe('[CreateEventDto] [tags]', () => {
    it('Should not accept an empty array', async () => {
      const event = { ...UPDATE_EVENT_MOCK, tags: [] };

      const updateEventDto = plainToInstance(UpdateEventDto, event);

      const errors = await validate(updateEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('tags');
      expect(errors[0].constraints).toEqual({
        customValidation: 'tags should not be empty',
      });
    });
    it('Should not accept less than 3 characters for each array field', async () => {
      const event = { ...UPDATE_EVENT_MOCK };

      event.tags = ['AA'];

      const updateEventDto = plainToInstance(UpdateEventDto, event);

      const errors = await validate(updateEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('tags');
      expect(errors[0].constraints).toEqual({
        minLength: 'tags must have min 3 characters for each tag',
      });
    });

    it('Should not accept more than 25 characters for each array field', async () => {
      const event = { ...UPDATE_EVENT_MOCK };

      event.tags = ['A'.repeat(26)];

      const updateEventDto = plainToInstance(UpdateEventDto, event);

      const errors = await validate(updateEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('tags');
      expect(errors[0].constraints).toEqual({
        maxLength: 'tags must have max 25 characters for each tag',
      });
    });

    it('Should not accept more than 10 different tags', async () => {
      const event = { ...UPDATE_EVENT_MOCK };

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

      const updateEventDto = plainToInstance(UpdateEventDto, event);

      const errors = await validate(updateEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('tags');
      expect(errors[0].constraints).toEqual({
        arrayMaxSize: 'tags must have max 10 elements',
      });
    });

    it('Should only accept string values inside the array', async () => {
      const event = { ...UPDATE_EVENT_MOCK, tags: [123] };

      const updateEventDto = plainToInstance(UpdateEventDto, event);

      const errors = await validate(updateEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('tags');
      expect(errors[0].constraints).toEqual({
        isString: 'each value in tags must be a string',
      });
    });

    it('Should only accept an array as tags field', async () => {
      const event = { ...UPDATE_EVENT_MOCK, tags: 'invalid type' };

      const updateEventDto = plainToInstance(UpdateEventDto, event);

      const errors = await validate(updateEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('tags');
      expect(errors[0].constraints).toEqual({
        isArray: 'tags must be an array',
      });
    });
  });
});