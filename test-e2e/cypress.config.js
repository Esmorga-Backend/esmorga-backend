const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportHeight: 1080,
  viewportWidth: 1920,

  e2e: {
    setupNodeEvents(on, config) {

    },

    baseUrl: 'https://qa.esmorga.canarte.org/',
    specPattern: 'cypress/e2e/**/*.spec.{js,jsx,ts,tsx}',
    supportFile: false
  },
});
