require('dotenv').config();
const fs = require('fs');
const GitHelper = require('./lib/GitHelper');
const Aio = require('./lib/Aio.js');

git = new GitHelper();
aio = new Aio();

const testTypes = {
  'Backend-Cypress-E2E': {
    outputDir: 'test/cypress-e2e/cypress/e2e/features/',
    num: 3,
  },
  'Backend-Jest-Component': {
    outputDir: 'test/jest-component/features/',
    num: 5,
  },
};
const onErrorMsg =
  'Usage: node features-update.js <Test Type> [What to get] [What to get] [...]  \n \
  "What to get": \n \
                      "--Test-automated"(default) : Return Test cases in state Automated \n \
                      "--Test-branch" Just testcases inside US related to branch\n \
  "Test Type" one of: \n \
                     "--Backend-Cypress-E2E" \n \
                     "--Backend-Jest-Component" \n \
  ';

function getSelectedTestTypes(testTypes) {
  let data = {};
  let n = 0;
  for (const testType in testTypes) {
    if (process.argv.includes('--' + testType)) {
      data[testType] = testTypes[testType];
      n = n + 1;
    }
  }

  if (n == 0) {
    return testTypes;
  }
  return data;
}
if (process.argv.includes('--help')) {
  console.error(onErrorMsg);
  process.exit(1);
}
selectedTestTypes = getSelectedTestTypes(testTypes);
console.log(selectedTestTypes);

async function main() {
  for (selectedTestType in selectedTestTypes) {
    Tests = [];
    Data = [];
    if (
      process.argv.includes('--Test-branch') ||
      process.argv.includes('--Update-branch-to-automated')
    ) {
      try {
        result = await git.getBranchName();
        data = aio.prepareDataForBranch(
          result.branchName,
          selectedTestTypes[selectedTestType],
        );
        Data.push(data);
      } catch (err) {
        console.error(err);
      }
    }
    if (
      process.argv.includes('--Test-automated') ||
      (!process.argv.includes('--Test-branch') &&
        !process.argv.includes('--Update-branch-to-automated'))
    ) {
      data = aio.prepareDataForAutomated(selectedTestTypes[selectedTestType]);
      Data.push(data);
    }

    for (data of Data) {
      try {
        tests = await aio.getTests(data, onErrorMsg);
        Tests.push(...tests);
      } catch (err) {
        console.error('Error getting tests:', err);
      }
    }
    console.log('Test to Download Features for', selectedTestType, Tests);
    if (
      !process.argv.includes('--Update-branch-to-automated') &&
      Tests.length > 0 &&
      !process.argv.includes('--No-Features')
    ) {
      console.log('Download');
      await aio.getFeatures(
        Tests,
        selectedTestTypes[selectedTestType]['outputDir'],
        onErrorMsg,
      );
    }
  }
}

main();
