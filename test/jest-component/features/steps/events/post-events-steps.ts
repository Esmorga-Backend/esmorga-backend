import { HttpStatus } from '@nestjs/common';
import { StepDefinitions } from 'jest-cucumber';
import { eventRepository, context } from '../../../steps-config';
import { createEventMock } from '../../../../mocks/dtos';

export const postEventsSteps: StepDefinitions = ({ given, and, then }) => {
  given('the POST Events API is available', () => {
    context.path = '/v1/events';
  });

  and('an authenticated user with admin rights is logged in', () => {
    console.log(
      'To be developed -> an authenticated user with admin rights is logged in',
    );
  });

  and('with invalid data', () => {
    context.mock = { ...createEventMock };

    delete context.mock.eventName;
  });

  and('should not be created', () => {
    console.log('To be developed -> should not be created');
  });

  and(
    /^with valid data, use tags: (.*), imageUrl: (.*), location.lat(.*) and location.long:(.*)$/,
    (tags, imageUrl, lat, long) => {
      jest.spyOn(eventRepository, 'save').mockResolvedValue();
      context.mock = { ...createEventMock };

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
  then(/^success response code (\d+) returned$/, (code_n) => {
    if (code_n == 201) {
      expect(context.response.status).toBe(HttpStatus.CREATED);
      expect(context.response.body).toEqual({});
    } else {
      expect(false).toBe(true);
    }
  });

  and('should be created successfully', () => {
    console.log('To be developed -> should be created successfully');
  });
};
