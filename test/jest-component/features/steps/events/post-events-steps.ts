import { StepDefinitions } from 'jest-cucumber';
import { eventRepository, context, schema } from '../../../steps-config';
import { CREATE_EVENT_MOCK } from '../../../../mocks/dtos';
import { GenRand } from '../../../instruments/gen-random';

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
  and(
    'user creates a new event with the maximum allowed characters in all input fields',
    () => {
      for (const row in schema.paths[context.path][context.method].requestBody
        .content['application/json'].schema.properties) {
        const prop =
          schema.paths[context.path][context.method].requestBody.content[
            'application/json'
          ].schema.properties[row];
        if (prop.type == 'string' && prop.maxLength) {
          const data_length = prop.maxLength;
          if (row.split('.').length == 2) {
            context.mock[row.split('.')[0]][row.split('.')[1]] =
              genRand.genRandString(data_length);
          } else {
            context.mock[row] = genRand.genRandString(data_length);
          }
        }
      }
    },
  );
  and(
    'user creates a new event with the minimum allowed characters in all input fields',
    () => {
      for (const row in schema.paths[context.path][context.method].requestBody
        .content['application/json'].schema.properties) {
        const prop =
          schema.paths[context.path][context.method].requestBody.content[
            'application/json'
          ].schema.properties[row];

        if (prop.type == 'string' && prop.minLength) {
          const data_length = prop.minLength;
          if (row.split('.').length == 2) {
            context.mock[row.split('.')[0]][row.split('.')[1]] =
              genRand.genRandString(data_length);
          } else {
            context.mock[row] = genRand.genRandString(data_length);
          }
        }
      }
    },
  );
  and('with valid data to create an event', () => {});
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

  /*
  /*
  and('should be created successfully', () => {
    console.log('To be developed -> should be created successfully');
  });
  */
  /*  and('with invalid data to create an event', () => {
    delete context.mock.eventName;
  });*/
};
