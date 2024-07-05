const Aio = require('./Aio.js');
const aio = new Aio();
class Features {
  getSelectedTestTypes(testTypes) {
    let data = {};
    let n = 0;
    for (const testType in testTypes) {
      if (process.argv.includes('--' + testType)) {
        data[testType] = testTypes[testType];
        n = n + 1;
      }
    }
    return n !== 0 ? data : testTypes;
  }
  async getTestInUS(usName, selectedTestTypes, selectedTestType) {
    try {
      let data = aio.prepareDataForBranch(
        usName,
        selectedTestTypes[selectedTestType],
      );
      return data;
    } catch (err) {
      console.error(err);
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
