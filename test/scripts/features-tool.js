require('dotenv').config();
const Aio = require('./lib/Aio.js');
const aio = new Aio();
const Features = require('./lib/Features.js');
const features = new Features();
const GitHelper = require('./lib/GitHelper.js');
const git = new GitHelper();

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
  'Usage: node features-update.js \n \
--Create-Cycle-for-US\n\
';

if (process.argv.includes('--help')) {
  console.error(onErrorMsg);
  process.exit(1);
}

async function main() {
  try {
    let branchName = '';
    if (process.env.GITHUB_HEAD_REF) {
      branchName = process.env.GITHUB_HEAD_REF;
    } else {
      branchName = await git.getBranchName();
    }
    if (branchName == 'main') {
      git.fixedBranchName(counter);
      branchName = await git.getBranchName();
      console.log(branchName);
    }
    const usName = features.getUsNameFromBranch(branchName);

    //Comment previous line and use nexts to force a US with tests
    //  const usName = 'MOB-80';

    selectedTestTypes = features.getSelectedTestTypes(testTypes);
    console.log(selectedTestTypes);
    if (process.argv.includes('--Upload-Results')) {
      const cyKey = await aio.findCycleByUs(onErrorMsg, usName);
      aio.UploadResults(cyKey);
    } else if (process.argv.includes('--Update-Test-to-Automated')) {
      const cyKey = await aio.findCycleByUs(onErrorMsg, usName);
      if (cyKey != null) {
        const Tests = await aio.getTestsByCy(onErrorMsg, cyKey);
        console.log('Update', Tests, 'to Automated');
        for (test of Tests) {
          console.log('Update', test);
          const tc = await aio.getTest(onErrorMsg, test);
          console.log(tc);
          if (tc.automationStatus.ID == 2) {
            tc.automationStatus = {
              ID: 4,
              name: 'Automated',
              description: 'The case has been automated',
            };
          }
        }
      }
    } else if (process.argv.includes('--Create-Cycle-for-US')) {
      TESTS = [];
      for (selectedTestType in selectedTestTypes) {
        Data = [];
        Data.push(
          await features.getTestInUS(
            usName,
            selectedTestTypes,
            selectedTestType,
          ),
        );
        Data.push(
          aio.prepareDataForAutomated(selectedTestTypes[selectedTestType]),
        );
        Tests = await features.getTestFromQuerys(Data, onErrorMsg);
        TESTS.push(...Tests);
      }
      console.log('Create Cycle for', usName, 'with tests', TESTS);
      let cyKey = await aio.findCycleByUs(onErrorMsg, usName);
      if (cyKey == null) {
        cyKey = await aio.createCycle(onErrorMsg, usName);
        for (test of TESTS) {
          await aio.addTestToCycle(onErrorMsg, test, cyKey);
        }
      } else {
        console.log('This US has a CY created, for ADD new TCs do it on Jira');
      }
    } else {
      const cyKey = await aio.findCycleByUs(onErrorMsg, usName);
      if (cyKey == null) {
        console.log(
          "Seems Cycle is not created, create it with 'node test/scripts/features-tool --Create-Cycle-for-US",
        );
        process.exit(1);
      } else {
        const Tests = await aio.getTestsByCy(onErrorMsg, cyKey);
        for (selectedTestType in selectedTestTypes) {
          Data = [];
          Data.push(
            await features.getTestInUS(
              usName,
              selectedTestTypes,
              selectedTestType,
            ),
          );
          if (Tests.length > 0) {
            await aio.getFeatures(
              Tests,
              selectedTestTypes[selectedTestType],
              onErrorMsg,
            );
          }
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
}
main();
