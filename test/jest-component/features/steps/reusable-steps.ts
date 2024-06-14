import { app, eventRepository, schema, context } from '../steps-config'
import { StepDefinitions} from 'jest-cucumber';

const Ajv = require('ajv');
const addFormats = require('ajv-formats');



export const reusableSteps: StepDefinitions = ({ given, and, when, then}) => {
    const ajv = new Ajv({ strict: false });
    addFormats(ajv)

    
    and('the response should following swagger schema', () => {
      const reference = schema.paths[context.path].get.responses[context.response.status].content['application/json'].schema
      const validate = ajv.compile(reference);
      const valid = validate(context.response.body);
      if (!valid) {
        console.error(validate.errors);
      }
      expect(valid).toBe(true);

    });

  
}