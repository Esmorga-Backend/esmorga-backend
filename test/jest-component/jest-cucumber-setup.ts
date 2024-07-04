import { loadFeatures, autoBindSteps } from 'jest-cucumber';
import './steps-config';
import { directoryImport } from 'directory-import';
const importedModules = directoryImport('./features/steps/');

const Steps: any = [];
Object.values(importedModules).forEach((file) => {
  Object.values(file).forEach((exported) => {
    Steps.push(exported);
  });
});

const features = loadFeatures('test/jest-component/features/*.feature');
autoBindSteps(features, Steps);
