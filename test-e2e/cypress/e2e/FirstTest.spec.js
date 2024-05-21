describe('Testing is all ok', () => {
  //Test de prueba para verificar que todo está funcionando correctamente
  it('passes', () => {
    cy.visit('https://example.cypress.io')
    cy.log('Test is ok')
  })
})