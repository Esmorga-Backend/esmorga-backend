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
  when(/^a POST request is made to (\w+) API$/, async () => {
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
    expect(valid).toBe(true);
  });
  then(
    /^error response code (\d+) returned, description: (.*)$/,
    (error, description) => {
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
        if (context.path == '/v1/events') {
          expect(context.response.body.errors[0]).toBe(
            'eventName should not be empty',
          );
        } else if (
          context.path == '/v1/account/login' &&
          description == 'without pass'
        ) {
          expect(context.response.body.errors[0]).toBe(
            'password should not be empty',
          );
        } else if (context.path == '/v1/account/login') {
          expect(context.response.body.errors[0]).toBe(
            'email should not be empty',
          );
        } else if (context.path == '/v1/account/refresh') {
          expect(context.response.body.errors[0]).toBe(
            'refreshToken should not be empty',
          );
        }
      } else if (error == 401) {
        expect(context.response.status).toBe(HttpStatus.UNAUTHORIZED);
        if (context.path == '/v1/account/login') {
          expect(context.response.body.errors[0]).toBe(
            'email password combination is not correct',
          );
        } else if (context.path == '/v1/account/refresh') {
          console.log('*******', context.response);
          expect(context.response.body).toMatchObject({
            title: 'unauthorizedRequestError',
            status: HttpStatus.UNAUTHORIZED,
            type: context.path,
            detail: 'unauthorized',
            errors: ['unauthorized'],
          });
        }
      } else {
        expect(true).toBe(false);
      }
    },
  );

  then(/^success response code (\d+) returned$/, (code_n) => {
    if (code_n == 201) {
      expect(context.response.status).toBe(HttpStatus.CREATED);
      expect(context.response.body).toEqual({});
    } else if (code_n == 200) {
      expect(context.response.status).toBe(HttpStatus.OK);
    } else {
      expect(false).toBe(true);
    }
  });
};
