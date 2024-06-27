import { StepDefinitions } from 'jest-cucumber';
import * as request from 'supertest';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { app, schema, context } from '../../steps-config';
const ajv = new Ajv({ strict: false });
addFormats(ajv);

function check_swagger() {
  const method = context.response.request.method.toLowerCase();
  const reference =
    schema.paths[context.path][method].responses[context.response.status]
      .content['application/json'].schema;
  const validate = ajv.compile(reference);
  const valid = validate(context.response.body);

  expect(valid).toBe(true);
}

export const reusableSteps: StepDefinitions = ({ when, then }) => {
  when(/^a GET request is made to (\w+) API$/, async () => {
    context.response = await request(app.getHttpServer()).get(context.path);
  });
  when(/^a POST request is made to (\w+) API$/, async () => {
    context.response = await request(app.getHttpServer())
      .post(context.path)
      .set(context.headers)
      .send(context.mock);
  });

  then(
    /^error response code (\d+) returned, description: (.*), expected result: (.*)$/,
    async (error, description, result) => {
      expect(context.response.status).toBe(parseInt(error));
      check_swagger();
      expect(context.response.body.type).toBe(context.path);
      expect(context.response.body.errors[0]).toBe(result);
    },
  );

  then(/^success response code (\d+) returned$/, (code_n) => {
    expect(context.response.status).toBe(parseInt(code_n));
    check_swagger();
  });
};
