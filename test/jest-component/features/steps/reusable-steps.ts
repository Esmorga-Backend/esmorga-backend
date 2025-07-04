import { StepDefinitions } from 'jest-cucumber';
import * as request from 'supertest';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { app, schema, context } from '../../steps-config';
import { genRandString } from '../../instruments/gen-random';
import { getRowsDetail } from '../../instruments/swagger-things';

const ajv = new Ajv({ strict: false });
addFormats(ajv);

function getPathSegments(path: string) {
  return path.split('/').filter((i) => !!i.length);
}
function comparePathSegments(
  pathSchemaSegments: string[],
  pathSegments: string[],
) {
  if (pathSegments.length !== pathSchemaSegments.length) {
    return false;
  }
  for (let i = 0; i < pathSchemaSegments.length; i++) {
    const pathSchemaSegment = pathSchemaSegments[i];
    const isParam =
      pathSchemaSegment.startsWith('{') && pathSchemaSegment.endsWith('}');
    if (!isParam && pathSegments[i] !== pathSchemaSegment) {
      return false;
    }
  }
  return true;
}
function getPathSchemaEntryMatcher(path: string) {
  const pathSegments = getPathSegments(path);
  return (pathSchemaEntry: [string, any]) =>
    comparePathSegments(getPathSegments(pathSchemaEntry[0]), pathSegments);
}
function check_swagger() {
  const method = context.response.request.method.toLowerCase();
  const pathsSchemas = schema.paths;
  const matcherFn = getPathSchemaEntryMatcher(context.path);
  const pathSchemaEntry = Object.entries(pathsSchemas).find(matcherFn);
  const reference =
    pathSchemaEntry?.[1][method].responses[context.response.status].content?.[
      'application/json'
    ].schema;
  if (reference) {
    const validate = ajv.compile(reference);
    const valid = validate(context.response.body);
    expect(valid).toBe(true);
  } else {
    expect(context.response.body).toEqual({});
  }
}

export const reusableSteps: StepDefinitions = ({ when, then, and }) => {
  and(/^use row: (.*) with data length: (.*)$/, (row, data_length) => {
    if (row.split('.').length == 2) {
      context.mock[row.split('.')[0]][row.split('.')[1]] =
        genRandString(data_length);
    } else {
      context.mock[row] = genRandString(data_length);
    }
  });

  and(/^with empty data in (.*)$/, (row) => {
    if (row.split('.').length == 2) {
      context.mock[row.split('.')[0]][row.split('.')[1]] = null;
    } else {
      context.mock[row] = '';
    }
  });

  and(/^user role is (.*)$/, async (role) => {
    context.user.role = role;
  });

  and('with the maximum allowed characters in all input fields', () => {
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
  });
  and('with the minimum allowed characters in all input fields', () => {
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
  });

  when(/^a GET request is made to (.*) API$/, async () => {
    context.response = await request(app.getHttpServer())
      .get(context.path)
      .set(context.headers);
  });

  when(/^a POST request is made to (.*) API$/, async () => {
    context.response = await request(app.getHttpServer())
      .post(context.path)
      .set(context.headers)
      .send(context.mock);
  });

  when(/^a PATCH request is made to (.*) API$/, async () => {
    context.response = await request(app.getHttpServer())
      .patch(context.path)
      .set(context.headers)
      .send(context.mock);
  });

  when(/^a DELETE request is made to (.*) API$/, async () => {
    context.response = await request(app.getHttpServer())
      .delete(context.path)
      .set(context.headers)
      .send(context.mock);
  });

  when(/^a PUT request is made to (.*) API$/, async () => {
    context.response = await request(app.getHttpServer())
      .put(context.path)
      .set(context.headers)
      .send(context.mock);
  });

  then(
    /^well-formed error response with status code (\d+) returned, description: (.*), expected result: (.*)$/,
    async (code_n, description, result) => {
      expect(context.response.status).toBe(parseInt(code_n));
      expect(context.response.body.type).toBe(context.path);
      expect(context.response.body.errors[0]).toBe(result);
      check_swagger();
    },
  );

  and(/^(\w+) field correctly filled with (.*)$/, (row, value) => {
    context.mock[row] = value;
  });

  then(
    /^well-formed success response with status code (\d+) returned$/,
    (code_n) => {
      expect(context.response.status).toBe(parseInt(code_n));

      check_swagger();
    },
  );
  and(/^detail in error is (.*) ,description: (.*)$/, async (row) => {
    expect(context.response.body.detail).toBe(row);
  });

  then(
    /^well-formed response with status code (.*) returned$/,
    (responseCode) => {
      expect(context.response.status).toBe(parseInt(responseCode));

      check_swagger();
    },
  );
};
