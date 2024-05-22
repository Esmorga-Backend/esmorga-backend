const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportHeight: 1080, //Resolución de la pantalla
  viewportWidth: 1920,

  e2e: {
    setupNodeEvents(on, config) {

    },

    baseUrl: 'https://qa.esmorga.canarte.org/', //URL base de la aplicación
    specPattern: 'cypress/e2e/**/*.spec.{js,jsx,ts,tsx}', //Patrón de búsqueda de archivos de prueba
    supportFile: false //Archivo de soporte no necesario
  },
});
