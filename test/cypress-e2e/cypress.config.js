const { defineConfig } = require('cypress');
const cucumber = require('cypress-cucumber-preprocessor').default;
module.exports = defineConfig({
  e2e: {
    screenshotsFolder: 'test/cypress-e2e/cypress/e2e/screenshots',
    downloadsFolder: 'test/cypress-e2e/cypress/e2e/downloads',
    supportFile: false,
    baseUrl: 'https://qa.esmorga.canarte.org/',
    specPattern: 'test/cypress-e2e/cypress/e2e/**/*.feature',
    setupNodeEvents(on, config) {
      on('file:preprocessor', cucumber());
    },
  },
});
