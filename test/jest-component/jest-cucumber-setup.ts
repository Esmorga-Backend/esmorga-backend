import { loadFeatures, autoBindSteps } from 'jest-cucumber';
import { directoryImport } from 'directory-import';
if (process.env.DEBUG === 'jest') {
  jest.setTimeout(5 * 60 * 1000);
}
const importedModules = directoryImport('./features/steps/');

const Steps: any = [];
Object.values(importedModules).forEach((file) => {
  Object.values(file).forEach((exported) => {
    Steps.push(exported);
  });
});

const features = loadFeatures('test/jest-component/features/*.feature');
autoBindSteps(features, Steps);
