require('dotenv').config();
const { defineConfig } = require('cypress');
const cucumber = require('cypress-cucumber-preprocessor').default;

module.exports = defineConfig({
  e2e: {
    screenshotsFolder: 'test/cypress-e2e/cypress/e2e/screenshots',
    downloadsFolder: 'test/cypress-e2e/cypress/e2e/downloads',
    supportFile: false,
    baseUrl: 'http://localhost:3000/',
    specPattern: 'test/cypress-e2e/cypress/e2e/**/*.feature',
    setupNodeEvents(on, config) {
      on('file:preprocessor', cucumber());
    },
    env: {
      MOCK_SERVER_USERNAME: process.env.MOCK_SERVER_USERNAME,
      MOCK_SERVER_PASSWORD: process.env.MOCK_SERVER_PASSWORD,
    },
  },

  reporter: 'junit',
  reporterOptions: {
    mochaFile: 'report/junit-e2e.xml',
    toConsole: false,
    useFullSuiteTitle: false,
    testCaseSwitchClassnameAndName: true,
  },
});
