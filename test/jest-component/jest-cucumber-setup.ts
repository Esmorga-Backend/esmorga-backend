import { loadFeatures, autoBindSteps } from 'jest-cucumber';
import { directoryImport } from 'directory-import';
import * as glob from 'glob';

const featureFiles = glob.sync('test/jest-component/features/*.feature');

if (featureFiles.length > 0) {
  const importedModules = directoryImport('./features/steps/');
  const Steps: any = [];
  Object.values(importedModules).forEach((file) => {
    Object.values(file).forEach((exported) => {
      Steps.push(exported);
    });
  });

  const features = loadFeatures('test/jest-component/features/*.feature');
  autoBindSteps(features, Steps);
} else {
  describe('Component Tests', () => {
    it('should skip when no Jira ticket is present', () => {
      expect(true).toBe(true);
    });
  });
}
