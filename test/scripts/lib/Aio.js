const axios = require('axios');
const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const FormData = require('form-data');

class Aio {
  constructor() {
    this.headers = {
      accept: 'application/json;charset=utf-8',
      Authorization: `AioAuth ${process.env.AIO_TOKEN}`,
      'Content-Type': 'application/json',
    };
  }

  async getTests(data, onErrorMsg) {
    const tests = [];
    const url =
      'https://tcms.aiojiraapps.com/aio-tcms/api/v1/project/MOB/testcase/search';

    try {
      const response = await axios.post(url, data, { headers: this.headers });
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
    const headers = {
      ...this.headers,
      accept: 'application/octet-stream',
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
        console.log(error);
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
  async createCycle(onErrorMsg, usName, usVersionName) {
    let url =
      'https://tcms.aiojiraapps.com/aio-tcms/api/v1/project/MOB/testcycle/detail';

    const data = {
      jiraTaskIDs: [usName],
      title: 'CY for ' + usVersionName,
      objective: 'TEST US ' + usName,
      ownedByID: '6135554fc425a20068e24a56',
      folder: {
        ID: 24,
      },
    };

    console.log(data);
    try {
      const response = await axios.post(url, data, { headers: this.headers });
      return response.data.key;
    } catch (error) {
      console.error('Error:', error);
      console.error(onErrorMsg);
      process.exit(1);
    }
  }
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async addTestToCycle(
    onErrorMsg,
    test,
    cyKey,
    options = {},
    retries = 3,
    delayMs = 30000,
  ) {
    let url =
      'https://tcms.aiojiraapps.com/aio-tcms/api/v1/project/MOB/testcycle/' +
      cyKey +
      '/testcase/' +
      test;

    const data = { isAutomated: true };

    console.log(data);
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await axios.post(url, data, { headers: this.headers });
        return 'ok';
      } catch (error) {
        if (attempt <= retries) {
          console.log(`Retry in 30 secs ... (attemp ${attempt + 1})`);
          await this.delay(delayMs);
        } else {
          console.error('Is ' + test + '  already in list?');
        }
      }
    }
  }
  async findCycleByUs(onErrorMsg, usName) {
    let url =
      'https://tcms.aiojiraapps.com/aio-tcms/api/v1/project/MOB/testcycle/search';

    const data = {
      title: {
        comparisonType: 'CONTAINS',
        value: 'CY for ' + usName,
      },
    };
    try {
      const response = await axios.post(url, data, { headers: this.headers });
      for (const cy of response.data.items) {
        if (cy.title == 'CY for ' + usName) {
          return cy.key;
        }
      }
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

      const req = axios.create({
        headers: this.headers,
        baseURL: 'https://tcms.aiojiraapps.com',
      });
      const response = await req.get(url);
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

    const req = axios.create({
      headers: this.headers,
      baseURL: 'https://tcms.aiojiraapps.com',
    });
    try {
      const response = await req.get(url);
      return response.data;
    } catch (error) {
      console.error('Error:', error);
      console.error(onErrorMsg);
      process.exit(1);
    }
  }
  async UploadResults(cyKey, onErrorMsg) {
    const url =
      'https://tcms.aiojiraapps.com/aio-tcms/api/v1/project/MOB/testcycle/' +
      cyKey +
      '/import/results?type=JUnit';

    try {
      const data = new FormData();
      data.append('bddForceUpdateCase', 'false');
      data.append('forceUpdateCase', 'false');
      data.append('updateDatasets', 'false');
      data.append('createNewRun', 'false');
      data.append('createCase', 'false');
      data.append('addCaseToCycle', 'false');
      data.append('file', fs.createReadStream(process.argv[2]));

      var config = {
        method: 'post',
        url: url,
        headers: {
          accept: 'application/json;charset=utf-8',
          Authorization: `AioAuth ${process.env.AIO_TOKEN}`,
          'Content-Type': 'multipart/form-data',
          ...data.getHeaders(),
        },
        data: data,
      };
      axios(config).then(function (response) {
        console.log(JSON.stringify(response.data));
      });
    } catch (error) {
      console.error('Error:', error);
      console.error(onErrorMsg);
      process.exit(1);
    }
  }
}
module.exports = Aio;
