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
    it('Should not accept less than 3 characters', async () => {
      const event = { ...createEventMock };

      event.eventName = 'AA';

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('eventName');
      expect(errors[0].constraints).toEqual({
        minLength: 'eventName must be longer than or equal to 3 characters',
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
        maxLength: 'eventName must be shorter than or equal to 100 characters',
      });
    });

    it('Should only accept string value', async () => {
      const event = { ...createEventMock };

      event.eventName = null;

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('eventName');
      expect(errors[0].constraints).toEqual({
        isNotEmpty: 'eventName should not be empty',
      });
    });
  });

  describe('[CreateEventDto] [eventDate]', () => {
    it('Should not accept past dates', async () => {
      const event = { ...createEventMock };

      event.eventDate = '2020-03-08T10:05:30.915Z';

      const createEventDto = plainToInstance(CreateEventDto, event);

      const errors = await validate(createEventDto, { stopAtFirstError: true });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('eventDate');
      expect(errors[0].constraints).toEqual(
        expect.objectContaining('eventDate can not be a past date'),
      );
    });
  });
});
