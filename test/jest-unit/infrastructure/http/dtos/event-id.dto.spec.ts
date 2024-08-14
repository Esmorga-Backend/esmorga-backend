import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { EventIdDto } from '../../../../../src/infrastructure/http/dtos';
import { EVENT_ID_MOCK } from '../../../../mocks/dtos';

describe('[unit-test] [EventIdDto]', () => {
  it('Should validate all fields successfully', async () => {
    const joinEventDto = plainToInstance(EventIdDto, EVENT_ID_MOCK);

    const errors = await validate(joinEventDto, { stopAtFirstError: true });

    expect(errors.length).toBe(0);
  });

  describe('[EventIdDto] [eventId]', () => {
    it('Should not accept an empty eventId', async () => {
      const joinEventData = { ...EVENT_ID_MOCK };

      delete joinEventData.eventId;

      const joinEventDto = plainToInstance(EventIdDto, joinEventData);

      const errors = await validate(joinEventDto, {
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

      const joinEventDto = plainToInstance(EventIdDto, joinEventData);

      const errors = await validate(joinEventDto, {
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
