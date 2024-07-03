const axios = require('axios');
const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
let headers = {};
headers.accept = 'application/json;charset=utf-8';
headers.Authorization = `AioAuth ${process.env.AIO_TOKEN}`;
headers['Content-Type'] = 'application/json';

class Aio {
  constructor() {}

  async getTests(data, onErrorMsg) {
    const tests = [];
    headers.accept = 'application/json;charset=utf-8';
    const url =
      'https://tcms.aiojiraapps.com/aio-tcms/api/v1/project/MOB/testcase/search';

    try {
      const response = await axios.post(url, data, { headers });
      response.data.items.forEach((item) => {
        tests.push(item.ID);
      });
      return tests;
    } catch (error) {
      console.error('Error:', error);
      console.error(onErrorMsg);
      process.exit(1);
    }
  }
  async getFeatures(Tests, selectedTestType) {
    const num = selectedTestType['num'];
    const url =
      'https://tcms.aiojiraapps.com/aio-tcms/api/v1/project/MOB/testcase/export/feature?type=NONE';
    headers.accept = 'application/octet-stream';
    const data = {
      ID: {
        comparisonType: 'IN',
        list: Tests,
      },
      customFields: [
        {
          name: 'Test type',
          value: {
            comparisonType: 'IN',
            list: [num],
          },
        },
      ],
    };

    try {
      const response = await axios.post(url, data, {
        headers,
        responseType: 'arraybuffer',
      });

      const zipPath = path.resolve(__dirname, 'features.zip');
      fs.writeFileSync(zipPath, response.data);
      const zip = new AdmZip(zipPath);
      zip.extractAllTo(selectedTestType['outputDir'], true);
      fs.unlinkSync(zipPath);
      console.log('Features updated');
    } catch (error) {
      if (error.response.status != 400) {
        console.log(await error);
      } else {
        console.error('No Features to Download');
      }
    }
  }

  prepareDataForBranch(usName, selectedTestType) {
    const data = {
      requirementID: {
        comparisonType: 'IN',
        list: [usName],
      },
      statusID: { comparisonType: 'IN', list: [3] },
      automationStatusID: { comparisonType: 'IN', list: [2] },
      customFields: [
        {
          name: 'Test type',
          value: {
            comparisonType: 'IN',
            list: [selectedTestType['num']],
          },
        },
      ],
    };
    return data;
  }
  prepareDataForAutomated(selectedTestType) {
    const data = {
      statusID: {
        comparisonType: 'IN',
        list: [3],
      },
      automationStatusID: {
        comparisonType: 'IN',
        list: [4],
      },

      customFields: [
        {
          name: 'Test type',
          value: {
            comparisonType: 'IN',
            list: [selectedTestType['num']],
          },
        },
      ],
    };
    return data;
  }
  async createCycle(onErrorMsg, usName) {
    let url =
      'https://tcms.aiojiraapps.com/aio-tcms/api/v1/project/MOB/testcycle/detail';
    headers.accept = 'application/json;charset=utf-8';
    const data = {
      jiraTaskIDs: [usName],
      title: 'CY for ' + usName,
      objective: 'TEST US ' + usName,
      ownedByID: '6135554fc425a20068e24a56',
      folder: {
        ID: 24,
      },
    };

    console.log(data);
    try {
      const response = await axios.post(url, data, { headers });
      return response.data.key;
    } catch (error) {
      console.error('Error:', error);
      console.error(onErrorMsg);
      process.exit(1);
    }
  }
  async addTestToCycle(onErrorMsg, test, cyKey) {
    let url =
      'https://tcms.aiojiraapps.com/aio-tcms/api/v1/project/MOB/testcycle/' +
      cyKey +
      '/testcase/' +
      test;
    headers.accept = 'application/json;charset=utf-8';
    const data = { isAutomated: true };

    console.log(data);
    try {
      await axios.post(url, data, { headers });
    } catch (error) {
      console.error('Is ' + test + '  already in list?');
    }
  }
  async findCycleByUs(onErrorMsg, usName) {
    let url =
      'https://tcms.aiojiraapps.com/aio-tcms/api/v1/project/MOB/testcycle/search';
    headers.accept = 'application/json;charset=utf-8';
    const data = {
      title: {
        comparisonType: 'CONTAINS',
        value: 'CY for ' + usName,
      },
    };
    try {
      const response = await axios.post(url, data, { headers });
      for (const cy of response.data.items) {
        if (cy.title == 'CY for ' + usName) {
          return cy.key;
        }
      }
      return;
    } catch (error) {
      console.error('Error:', error);
      console.error(onErrorMsg);
      process.exit(1);
    }
  }

  async getTestsByCy(onErrorMsg, cyKey) {
    try {
      const url =
        'aio-tcms/api/v1/project/MOB/testcycle/' + cyKey + '/testcase';
      headers.accept = 'application/json;charset=utf-8';
      const req = axios.create({
        headers,
        baseURL: 'https://tcms.aiojiraapps.com',
      });
      const response = await req.get(url); //, data, { headers });
      const Tests = [];
      for (const run of response.data.items) {
        Tests.push(run.testCase.ID);
      }
      return Tests;
    } catch (error) {
      console.error('Error:', error);
      console.error(onErrorMsg);
      process.exit(1);
    }
  }
  async getTest(onErrorMsg, tc) {
    const url = '/aio-tcms/api/v1/project/MOB/testcase/' + tc + '/detail';
    headers.accept = 'application/json;charset=utf-8';
    const req = axios.create({
      headers,
      baseURL: 'https://tcms.aiojiraapps.com',
    });
    try {
      const response = await req.get(url); //, data, { headers });
      return response.data;
    } catch (error) {
      console.error('Error:', error);
      console.error(onErrorMsg);
      process.exit(1);
    }
  }

  async setTest(onErrorMsg, tc, data) {
    //Testing
    const url =
      'https://tcms.aiojiraapps.com/aio-tcms/api/v1/project/MOB/testcase/' + tc;
    headers.accept = 'application/json;charset=utf-8';
    /*    const data = {
      automationStatus: {
        ID: 4,
        name: 'Automated',
        description: 'The case has been automated',
      },
    };*/
    try {
      console.log('TRY');
      await axios.post(url, data, { headers });
    } catch (error) {
      console.error('Error:', error);
      console.error(onErrorMsg);
      process.exit(1);
    }
  }
}
module.exports = Aio;
