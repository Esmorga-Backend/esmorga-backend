describe('Test URL events', () => {
  it('GET url and verify that status is 200', () => {
    cy.request('GET', Cypress.config().baseUrl + 'v1/events')
      .then((response) => {
        expect(response.status).to.eq(200);
      })
  })
})