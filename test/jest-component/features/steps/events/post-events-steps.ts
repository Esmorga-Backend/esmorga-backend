import { StepDefinitions } from 'jest-cucumber';
import { eventRepository, context } from '../../../steps-config';
import { CREATE_EVENT_MOCK } from '../../../../mocks/dtos';

export const postEventsSteps: StepDefinitions = ({ given, and }) => {
  given('the POST Events API is available', () => {
    context.path = '/v1/events';
  });

  and('an authenticated user with admin rights is logged in', () => {
    console.log(
      'To be developed -> an authenticated user with admin rights is logged in',
    );
  });

  and('with invalid data', () => {
    context.mock = { ...CREATE_EVENT_MOCK };

    delete context.mock.eventName;
  });

  and(
    /^with valid data, use tags: (.*), imageUrl: (.*), location.lat(.*) and location.long:(.*)$/,
    (tags, imageUrl, lat, long) => {
      jest.spyOn(eventRepository, 'save').mockResolvedValue();
      context.mock = { ...CREATE_EVENT_MOCK };

      context.mock.location.imageUrl = imageUrl;
      context.mock.location.tags = tags;
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
  and('should be created successfully', () => {
    console.log('To be developed -> should be created successfully');
  });
  */
};