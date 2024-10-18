import { HttpStatus } from '@nestjs/common';
import { StepDefinitions } from 'jest-cucumber';
import { matchers } from 'jest-json-schema';
import { context, moduleFixture } from '../../../steps-config';
import {
  FUTURE_EVENT_MOCK_DTO,
  OLD_EVENT_MOCK_DTO,
} from '../../../../mocks/db';
import { EventDA } from '../../../../../src/infrastructure/db/modules/none/event-da';

export const getEventsSteps: StepDefinitions = ({ given, and, then }) => {
  given('the GET Events API is available', () => {
    context.path = '/v1/events';

    context.eventDA = moduleFixture.get<EventDA>(EventDA);
    jest.spyOn(context.eventDA, 'find').mockResolvedValue([]);
  });

  given('the GET Events API is unavailable', () => {
    context.path = '/v1/events';
    jest.spyOn(context.eventDA, 'find').mockRejectedValue(new Error());
  });

  and(
    /^(\d+) Events in DB, (\d+) are in the past$/,
    (events_on_db, expired_events_on_db) => {
      if (expired_events_on_db == 1 && events_on_db == 2) {
        jest
          .spyOn(context.eventDA, 'find')
          .mockResolvedValue([FUTURE_EVENT_MOCK_DTO, OLD_EVENT_MOCK_DTO]);
      } else if (expired_events_on_db == 1 && events_on_db == 1) {
        jest
          .spyOn(context.eventDA, 'find')
          .mockResolvedValue([OLD_EVENT_MOCK_DTO]);
      } else if (events_on_db == 1) {
        jest
          .spyOn(context.eventDA, 'find')
          .mockResolvedValue([FUTURE_EVENT_MOCK_DTO]);
      }
    },
  );

  then(
    /^the response should contain (\d+) upcoming Events$/,
    (events_to_check) => {
      expect(context.response.status).toBe(HttpStatus.OK);
      expect.extend(matchers);
      expect(context.response.body).toMatchObject({
        totalEvents: parseInt(events_to_check),
      });
      if (events_to_check == 1) {
        expect(context.response.body).toEqual({
          totalEvents: 1,
          events: [JSON.parse(JSON.stringify(FUTURE_EVENT_MOCK_DTO))],
        });
      } else if (events_to_check == 0) {
        expect(context.response.body).toEqual({
          totalEvents: 0,
          events: [],
        });
      } else {
        expect(false).toBe(true);
      }
    },
  );
};
