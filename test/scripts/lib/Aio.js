const axios = require('axios');
const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
class Aio {
  constructor() {}

  async getTests(data, onErrorMsg) {
    const tests = [];
    const url =
      'https://tcms.aiojiraapps.com/aio-tcms/api/v1/project/MOB/testcase/search';
    const headers = {
      Accept: 'application/json;charset=utf-8',
      Authorization: `AioAuth ${process.env.AIO_TOKEN}`,
      'Content-Type': 'application/json',
    };

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
  async getFeatures(Tests, outputDir, onErrorMsg) {
    const url =
      'https://tcms.aiojiraapps.com/aio-tcms/api/v1/project/MOB/testcase/export/feature?type=NONE';
    const headers = {
      accept: 'application/octet-stream',
      Authorization: `AioAuth ${process.env.AIO_TOKEN}`,
      'Content-Type': 'application/json',
    };
    const data = {
      ID: {
        comparisonType: 'IN',
        list: Tests,
      },
    };
    try {
      const response = await axios.post(url, data, {
        headers,
        responseType: 'arraybuffer',
      });
      const zipPath = path.resolve(__dirname, 'features.zip');
      fs.writeFileSync(zipPath, response.data);
      const zip = new AdmZip(zipPath);
      zip.extractAllTo(outputDir, true);
      fs.unlinkSync(zipPath);
      console.log('Features updated');
    } catch (error) {
      console.error('Error:', error);
      console.error(onErrorMsg);
      process.exit(1);
    }
  }

  prepareDataForBranch(result, selectedTestType) {
    const regex = /\/([A-Z]+-\d+)/;
    console.log(result);
    const match = result.match(regex);
    if (match && match.length > 1) {
      const requirementID = match[1];
      // This will be "MOB-XX"
      //          list: ['MOB-19']
      //          "list": [requirementID]
      const data = {
        requirementID: {
          comparisonType: 'IN',
          list: [requirementID],
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
    return;
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
}
module.exports = Aio;
