import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { EventIdDto } from '../../../../../src/infrastructure/http/dtos';
import { JOIN_EVENT_MOCK } from '../../../../mocks/dtos';

describe('[unit-test] [EventIdDto]', () => {
  it('Should validate all fields successfully', async () => {
    const eventIdDto = plainToInstance(EventIdDto, JOIN_EVENT_MOCK);

    const errors = await validate(eventIdDto, { stopAtFirstError: true });

    expect(errors.length).toBe(0);
  });

  describe('[EventIdDto] [eventId]', () => {
    it('Should not accept an empty eventId', async () => {
      const joinEventData = { ...JOIN_EVENT_MOCK };

      delete joinEventData.eventId;

      const eventIdDto = plainToInstance(EventIdDto, joinEventData);

      const errors = await validate(eventIdDto, {
        stopAtFirstError: true,
      });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('eventId');
      expect(errors[0].constraints).toEqual({
        isNotEmpty: 'eventId should not be empty',
      });
    });

    it('Should only accept string values for eventId field', async () => {
      const joinEventData = {
        eventId: 123,
      };

      const eventIdDto = plainToInstance(EventIdDto, joinEventData);

      const errors = await validate(eventIdDto, {
        stopAtFirstError: true,
      });

      expect(errors.length).toEqual(1);
      expect(errors[0].property).toEqual('eventId');
      expect(errors[0].constraints).toEqual({
        isString: 'eventId must be a string',
      });
    });
  });
});
