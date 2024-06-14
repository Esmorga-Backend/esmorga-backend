
import { loadFeatures, autoBindSteps } from 'jest-cucumber';

import { basicSteps } from './basic-steps';

const features = loadFeatures('test/jest-component/features/*.feature')

autoBindSteps(features, [ basicSteps ]);