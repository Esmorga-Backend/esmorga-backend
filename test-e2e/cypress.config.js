const { defineConfig } = require("cypress");
const cucumber = require("cypress-cucumber-preprocessor").default;
module.exports = defineConfig({
  e2e: {
    supportFile: false,
    baseUrl: 'https://qa.esmorga.canarte.org/',
    specPattern: 'test-e2e/cypress/e2e/**/*.feature',
    setupNodeEvents(on, config) {
      on("file:preprocessor", cucumber());
    },
  },
});



/*

module.exports = {
  ...(on, config) => {
    on("file:preprocessor", cucumber());
  },
  viewportHeight: 1080,
  viewportWidth: 1920,

  e2e: {
    baseUrl: 'https://qa.esmorga.canarte.org/',
    

    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
};

*/
