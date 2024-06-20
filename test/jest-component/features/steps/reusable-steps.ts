import { HttpStatus } from '@nestjs/common';
import { StepDefinitions } from 'jest-cucumber';
import * as request from 'supertest';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { app, schema, context } from '../../steps-config';

export const reusableSteps: StepDefinitions = ({ and, when, then }) => {
  const ajv = new Ajv({ strict: false });
  addFormats(ajv);

  //Need to Talk //
  when(/^a GET request is made to (\w+) API$/, async () => {
    context.response = await request(app.getHttpServer()).get(context.path);
  });
  when('a POST request is made to Events API', async () => {
    context.response = await request(app.getHttpServer())
      .post(context.path)
      .set(context.headers)
      .send(context.mock);
  });

  and('response follows swagger schema', () => {
    const reference =
      schema.paths[context.path].get.responses[context.response.status].content[
        'application/json'
      ].schema;
    const validate = ajv.compile(reference);
    const valid = validate(context.response.body);
    if (!valid) {
      console.error(validate.errors);
    }
    expect(valid).toBe(true);
  });

  then(/^error response code (\d+) returned$/, (error) => {
    if (error == 500) {
      expect(context.response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(context.response.body).toEqual({
        title: 'internalServerError',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: context.path,
        detail: 'unexpected error',
        errors: ['Internal server error occurred in database operation'],
      });
    } else if (error == 400) {
      expect(context.response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(context.response.body.errors[0]).toBe(
        'eventName should not be empty',
      );
    } else {
      expect(true).toBe(false);
    }
  });
};
