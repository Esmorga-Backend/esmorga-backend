const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportHeight: 1080, //Resolución de la pantalla
  viewportWidth: 1920,

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },

    // baseUrl: "http://localhost:3000", //Url base (por determinar)
    specPattern: 'cypress/e2e/**/*.spec.{js,jsx,ts,tsx}' //Patrón de búsqueda de archivos de prueba
  },
});
