const Aio = require('./Aio.js');
const aio = new Aio();
class Features {
  constructor() {}
  getSelectedTestTypes(testTypes) {
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
  async getTestInUS(usName) {
    try {
      //      let result = await git.getBranchName();
      let data = aio.prepareDataForBranch(
        usName,
        selectedTestTypes[selectedTestType],
      );
      return data;
    } catch (err) {
      this.printeError(err);
    }
  }
  async getTestFromQuerys(Data, onErrorMsg) {
    const Tests = [];
    for (const data of Data) {
      try {
        const result = await aio.getTests(data, onErrorMsg);
        Tests.push(...result);
      } catch (err) {
        console.error('Error getting tests:', err);
      }
    }
    return Tests;
  }
  printeError(err) {
    console.error(err);
  }
  getUsNameFromBranch(branchName) {
    const regex = /\/([A-Z]+-\d+)/;
    const match = branchName.match(regex);
    if (match && match.length > 1) {
      return match[1];
    }
    return;
  }
}

module.exports = Features;
