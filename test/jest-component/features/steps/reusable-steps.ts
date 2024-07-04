import { StepDefinitions } from 'jest-cucumber';
import * as request from 'supertest';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { app, schema, context } from '../../steps-config';
const ajv = new Ajv({ strict: false });
addFormats(ajv);

function genRandString(length: number): string {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charsLength = chars.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charsLength);
    result += chars[randomIndex];
  }

  return result;
}

function check_swagger() {
  const method = context.response.request.method.toLowerCase();
  const reference =
    schema.paths[context.path][method].responses[context.response.status]
      .content['application/json'].schema;
  const validate = ajv.compile(reference);
  const valid = validate(context.response.body);

  expect(valid).toBe(true);
}

export const reusableSteps: StepDefinitions = ({ when, then, and }) => {
  and(/^use row: (.*) with data length: (.*)$/, (row, data_length) => {
    if (row.split('.').length == 2) {
      context.mock[row.split('.')[0]][row.split('.')[1]] =
        genRandString(data_length);
    } else {
      context.mock[row] = genRandString(data_length);
    }
    console.log(context.mock);
  });

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
    async (code_n, description, result) => {
      expect(await context.response.status).toBe(parseInt(code_n));
      expect(await context.response.body.type).toBe(context.path);
      expect(await context.response.body.errors[0]).toBe(result);
      check_swagger();
    },
  );

  then(/^success response code (\d+) returned$/, (code_n) => {
    expect(context.response.status).toBe(parseInt(code_n));
    check_swagger();
  });
  and(/^detail in error is (.*) ,description: (.*)$/, (arg0, arg1) => {});
};
