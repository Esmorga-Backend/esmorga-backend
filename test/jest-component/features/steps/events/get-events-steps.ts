import { HttpStatus } from '@nestjs/common';
import { StepDefinitions } from 'jest-cucumber';
import { matchers } from 'jest-json-schema';
import { eventRepository, context } from '../../../steps-config';
import { futureEventMockDB, oldEventMockDB } from '../../../../mocks/db';

export const getEventsSteps: StepDefinitions = ({ given, and, then }) => {
  given('the GET Events API is available', () => {
    context.path = '/v1/events';
  });

  given('the GET Events API is unavailable', () => {
    context.path = '/v1/events';
    jest.spyOn(eventRepository, 'find').mockRejectedValue(new Error());
  });

  and(
    /^(\d+) Events in DB, (\d+) are in the past$/,
    (events_on_db, expired_events_on_db) => {
      if (expired_events_on_db == 1 && events_on_db == 2) {
        jest
          .spyOn(eventRepository, 'find')
          .mockResolvedValue([futureEventMockDB, oldEventMockDB]);
      } else if (expired_events_on_db == 1 && events_on_db == 1) {
        jest.spyOn(eventRepository, 'find').mockResolvedValue([oldEventMockDB]);
      } else if (events_on_db == 1) {
        jest
          .spyOn(eventRepository, 'find')
          .mockResolvedValue([futureEventMockDB]);
      } else if (expired_events_on_db == 0 && events_on_db == 0) {
        jest.spyOn(eventRepository, 'find').mockResolvedValue([]);
      } else {
        expect(false).toBe(true);
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
          events: [
            {
              eventId: futureEventMockDB._id,
              eventName: futureEventMockDB.eventName,
              eventDate: futureEventMockDB.eventDate.toISOString(),
              description: futureEventMockDB.description,
              eventType: futureEventMockDB.eventType,
              imageUrl: futureEventMockDB.imageUrl,
              location: futureEventMockDB.location,
              tags: futureEventMockDB.tags,
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
