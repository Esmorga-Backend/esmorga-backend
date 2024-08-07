import { StepDefinitions } from 'jest-cucumber';
import { context, moduleFixture } from '../../../steps-config';
import { CREATE_EVENT_MOCK } from '../../../../mocks/dtos';
import { genRandString } from '../../../instruments/gen-random';
import { getRowsDetail } from '../../../instruments/swagger-things';
import { EventRepository } from '../../../../../src/infrastructure/db/repositories';
let eventRepository: EventRepository;

export const postEventsSteps: StepDefinitions = ({ given, and }) => {
  given('the POST Events API is available', () => {
    context.eventRepository = eventRepository;
    context.eventRepository =
      moduleFixture.get<EventRepository>(EventRepository);
    context.path = '/v1/events';
    context.mock = { ...CREATE_EVENT_MOCK };
    context.method = 'post';
    jest.spyOn(context.eventRepository, 'save').mockResolvedValue([]);
  });

  and('an unauthenticated user', () => {});
  and('an authenticated user without admin rights is logged in', () => {});
  and('an authenticated user with admin rights is logged in', () => {});

  and(/^with empty data in (.*)$/, (row) => {
    if (row.split('.').length == 2) {
      delete context.mock[row.split('.')[0]][row.split('.')[1]];
    } else {
      delete context.mock[row];
    }
  });

  and(
    'user creates a new event with the maximum allowed characters in all input fields',
    () => {
      const rows = getRowsDetail('maxLength');
      for (const row in rows) {
        if (row.split('.').length == 2) {
          context.mock[row.split('.')[0]][row.split('.')[1]] = genRandString(
            rows[row],
          );
        } else {
          context.mock[row] = genRandString(rows[row]);
        }
      }
    },
  );
  and(
    'user creates a new event with the minimum allowed characters in all input fields',
    () => {
      const rows = getRowsDetail('minLength');
      for (const row in rows) {
        if (row.split('.').length == 2) {
          context.mock[row.split('.')[0]][row.split('.')[1]] = genRandString(
            rows[row],
          );
        } else {
          context.mock[row] = genRandString(rows[row]);
        }
      }
    },
  );

  and(
    /^with valid data to create an event, use tags: (.*), imageUrl: (.*), location.lat(.*) and location.long:(.*)$/,
    (tags, imageUrl, lat, long) => {
      context.mock.imageUrl = imageUrl;
      const arr: string[] = JSON.parse(tags);
      context.mock.tags = arr;
      if (lat !== '') {
        context.mock.location.lat = parseInt(lat);
      } else {
        delete context.mock.location.lat;
      }
      if (long !== '') {
        context.mock.location.long = parseInt(long);
      } else {
        delete context.mock.location.long;
      }
    },
  );
};
