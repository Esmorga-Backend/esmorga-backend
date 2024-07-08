import { StepDefinitions } from 'jest-cucumber';
import { eventRepository, context, schema } from '../../../steps-config';
import { CREATE_EVENT_MOCK } from '../../../../mocks/dtos';
import { GenRand } from '../../../instruments/gen-random';
import { SwagerThings } from '../../../instruments/swagger-things';
const swagerThings = new SwagerThings();
const genRand = new GenRand();

export const postEventsSteps: StepDefinitions = ({ given, and }) => {
  given('the POST Events API is available', () => {
    context.path = '/v1/events';
    context.mock = { ...CREATE_EVENT_MOCK };
    context.method = 'post';
  });

  and('an unauthenticated user', () => {});
  and('an authenticated user without admin rights is logged in', () => {});
  and('an authenticated user with admin rights is logged in', () => {});

  and('with invalid data', () => {
    context.mock.eventName = 'asdda';
  });
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
      const rows = swagerThings.getRowsDetail('maxLength');
      for (const row in rows) {
        if (row.split('.').length == 2) {
          context.mock[row.split('.')[0]][row.split('.')[1]] =
            genRand.genRandString(rows[row]);
        } else {
          context.mock[row] = genRand.genRandString(rows[row]);
        }
      }
    },
  );
  and(
    'user creates a new event with the minimum allowed characters in all input fields',
    () => {
      const rows = swagerThings.getRowsDetail('minLength');
      for (const row in rows) {
        if (row.split('.').length == 2) {
          context.mock[row.split('.')[0]][row.split('.')[1]] =
            genRand.genRandString(rows[row]);
        } else {
          context.mock[row] = genRand.genRandString(rows[row]);
        }
      }
    },
  );

  and(
    /^with valid data to create an event, use tags: (.*), imageUrl: (.*), location.lat(.*) and location.long:(.*)$/,
    (tags, imageUrl, lat, long) => {
      jest.spyOn(eventRepository, 'save').mockResolvedValue();
      context.mock.imageUrl = imageUrl;
      const arr: string[] = JSON.parse(tags);
      context.mock.tags = arr;
      if (lat != '') {
        context.mock.location.lat = parseInt(lat);
      } else {
        delete context.mock.location.lat;
      }
      if (long != '') {
        context.mock.location.long = parseInt(long);
      } else {
        delete context.mock.location.long;
      }
    },
  );
};
