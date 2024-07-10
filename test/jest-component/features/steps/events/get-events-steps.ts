import { HttpStatus } from '@nestjs/common';
import { StepDefinitions } from 'jest-cucumber';
import { matchers } from 'jest-json-schema';
import { EventRepository } from '../../../../../src/infrastructure/db/repositories';
import { context, moduleFixture } from '../../../steps-config';
import { FUTURE_EVENT_MOCK_DB, OLD_EVENT_MOCK_DB } from '../../../../mocks/db';

export const getEventsSteps: StepDefinitions = ({ given, and, then }) => {
  given('the GET Events API is available', () => {
    context.path = '/v1/events';

    context.eventRepository =
      moduleFixture.get<EventRepository>(EventRepository);
    jest.spyOn(context.eventRepository, 'find').mockResolvedValue([]);
  });

  given('the GET Events API is unavailable', () => {
    context.path = '/v1/events';
    jest.spyOn(context.eventRepository, 'find').mockRejectedValue(new Error());
  });

  and(
    /^(\d+) Events in DB, (\d+) are in the past$/,
    (events_on_db, expired_events_on_db) => {
      if (expired_events_on_db == 1 && events_on_db == 2) {
        jest
          .spyOn(context.eventRepository, 'find')
          .mockResolvedValue([FUTURE_EVENT_MOCK_DB, OLD_EVENT_MOCK_DB]);
      } else if (expired_events_on_db == 1 && events_on_db == 1) {
        jest
          .spyOn(context.eventRepository, 'find')
          .mockResolvedValue([OLD_EVENT_MOCK_DB]);
      } else if (events_on_db == 1) {
        jest
          .spyOn(context.eventRepository, 'find')
          .mockResolvedValue([FUTURE_EVENT_MOCK_DB]);
      }
    },
  );

  then(
    /^the response should contain (\d+) upcoming Events$/,
    (events_to_check) => {
      expect(context.response.status).toBe(HttpStatus.OK);
      expect.extend(matchers);
      //      if (parseInt(events_to_check) === 1) {
      //        console.log(context.response);
      //      }
      expect(context.response.body).toMatchObject({
        totalEvents: parseInt(events_to_check),
      });
      if (events_to_check == 1) {
        expect(context.response.body).toEqual({
          totalEvents: 1,
          events: [
            {
              eventId: FUTURE_EVENT_MOCK_DB._id,
              eventName: FUTURE_EVENT_MOCK_DB.eventName,
              eventDate: FUTURE_EVENT_MOCK_DB.eventDate.toISOString(),
              description: FUTURE_EVENT_MOCK_DB.description,
              eventType: FUTURE_EVENT_MOCK_DB.eventType,
              imageUrl: FUTURE_EVENT_MOCK_DB.imageUrl,
              location: FUTURE_EVENT_MOCK_DB.location,
              tags: FUTURE_EVENT_MOCK_DB.tags,
            },
          ],
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
