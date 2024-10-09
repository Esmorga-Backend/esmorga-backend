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
    const regex = /\/(MOB-\d+|mob-\d+)/;
    const match = branchName.match(regex);
    const regexV = /\/(MOB-\d+\(\w+\)|MOB-\d+|mob-\d+|mob-\d+\(\w+\))/;
    const matchV = branchName.match(regexV);
    if (match && match.length > 1) {
      return [match[1], matchV[1]];
    }
    console.log(matchV, match);
    return;
  }
}

module.exports = Features;
