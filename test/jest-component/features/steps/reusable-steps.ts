import { HttpStatus } from '@nestjs/common';
import { StepDefinitions } from 'jest-cucumber';
import * as request from 'supertest';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import {
  app, schema, accountRepository,
  tokensRepository, generateTokenPair, context
} from '../../steps-config';
import { USER_DB, PASSWORD } from '../../../mocks/db';

const TTL = parseInt(process.env.ACCESS_TOKEN_TTL);


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
    if (!valid) {
      console.error(validate.errors);
    }
    expect(valid).toBe(true);
  });
  then(
    /^error response code (\d+) returned, description: (.*)$/,
    (error, p) => {});
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

  then(/^success response code (\d+) returned$/, (code_n) => {
    if (code_n == 201) {
      expect(context.response.status).toBe(HttpStatus.CREATED);
      expect(context.response.body).toEqual({});
    } else if (code_n == 200) {
      console.log(context.response);
      expect(context.response.status).toBe(HttpStatus.OK);
      expect(context.response.body).toMatchObject({
        accessToken: 'ACCESS_TOKEN',
        refreshToken: 'REFRESH_TOKEN',
        ttl: TTL,
        profile: {
          name: USER_DB.name,
          email: USER_DB.email,
        },
      });
    } else {
      expect(false).toBe(true);
    }
  });

};