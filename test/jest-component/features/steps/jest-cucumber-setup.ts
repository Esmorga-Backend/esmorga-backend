
import { loadFeatures, autoBindSteps } from 'jest-cucumber';

import { getEvents } from './get-events-steps';

const features = loadFeatures('test/jest-component/features/*.feature')

autoBindSteps(features, [ getEvents ]);