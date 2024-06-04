const axios = require('axios');
const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

if (process.argv.length < 5) {
    console.error('Usage: node exportAndExtract.js <output_directory> <automationStatusID> <Test type>\n \
    "automationStatus": \n \
                        4 : "Automated"\n \
                        2 : "To be Automated"\n \
    "Test type" \n \
                       3 : "Backend-Cypress-E2E" \n \
                       5: "Backend-Jest-Component" \n \
    ');
    process.exit(1);
  }

const outputDir = process.argv[2];
if (!fs.existsSync(outputDir)) {
    process.exit(1);
}

const automationStatusID = process.argv[3].split(',');;
const Test_Type = process.argv[4].split(',');
console.log('Value"', automationStatusID, '"');



const url = "https://tcms.aiojiraapps.com/aio-tcms/api/v1/project/MOB/testcase/export/feature?type=NONE";
const headers = {
  "accept": "application/octet-stream",
  "Authorization": `AioAuth ${process.env.AoiToken}`,
  "Content-Type": "application/json"
};
const data = {
  "statusID": {
    "comparisonType": "IN",
    "list": [3]
  },
  "automationStatusID": {
    "comparisonType": "IN",
    "list": automationStatusID
  },
  "customFields": [
    {
      "name": "Test type",
      "value": {
        "comparisonType": "IN",
        "list": Test_Type
      }
    }
  ]
};
console.log('Make the Request');
axios.post(url, data, { headers, responseType: 'arraybuffer' })
  .then(response => {
    const zipPath = path.resolve(__dirname, 'features.zip');
    fs.writeFileSync(zipPath, response.data);
    console.log('File saved to', zipPath);

    // Descomprimir el fichero ZIP
    const zip = new AdmZip(zipPath);
//    const outputDir = path.resolve(__dirname, 'extracted');
    zip.extractAllTo(outputDir, true);
    console.log('Files extracted to', outputDir);
    fs.unlinkSync(zipPath);
    console.log('ZIP file deleted');

  })
  .catch(error => {
    console.error('Error:', error);
  });