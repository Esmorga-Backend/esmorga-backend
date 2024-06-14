import { StepDefinitions} from 'jest-cucumber';
import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { EventRepository } from '../../../../src/infrastructure/db/repositories' ;
import { matchers } from 'jest-json-schema';

const addFormats = require('ajv-formats');

let app : INestApplication;
let eventRepository: EventRepository;
let schema;



export const reusableSteps: StepDefinitions = ({ given, and, when, then}) => {
    let response
    let path: string = '';
    const ajv = new Ajv({ strict: false });
    addFormats(ajv)

    
    and('the response should following swagger schema', () => {
      const reference = schema.paths[path].get.responses[response.status].content['application/json'].schema
      const validate = ajv.compile(reference);
      const valid = validate(response.body);
      if (!valid) {
        console.error(validate.errors);
      }
      expect(valid).toBe(true);

    });

  
}